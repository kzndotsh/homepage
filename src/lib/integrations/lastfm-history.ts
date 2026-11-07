import 'server-only'
import { getGithubActivity } from '@/lib/integrations'
import type {
  CodingVsListening,
  GenreMap,
  GenresByPeriod,
  LastfmStats,
  NowPlaying,
  PeriodTops,
  ScrobbleHistory,
  TopCharts,
  TopItem,
  TopKind,
  TopPeriod,
  WeeklyStream,
} from '@/lib/integrations/lastfm-history-types'
import { findAlbumArt } from '@/lib/integrations/spotify'

// Every function resolves to null on missing credentials or upstream failure.
//
// Caching: results live in a module-level map for 6h, storing the promise so
// concurrent callers share one fetch; failures (null/throw) are evicted.
// On Cloudflare Workers isolates are short-lived, so this cache is only a
// best-effort dedupe. Production should refresh a snapshot into KV/R2 on a
// schedule and read that instead (not implemented here).

const USER = 'growwithlogan'
const TZ = 'America/New_York'
// Only dedupes callers within one render; the long-lived copy is a snapshot in
// R2 (lib/snapshots), which is shared between invocations.
const TTL_MS = 60 * 1000
const DAY_S = 86_400
const CONCURRENCY = 6
const PLACEHOLDER_IMAGE = '2a96cbd8b46e442fc41c2b86b821562f'

// ---------- http ----------

async function lfm<T>(
  method: string,
  params: Record<string, string>,
  key: string,
): Promise<T> {
  const qs = new URLSearchParams({
    method,
    user: USER,
    api_key: key,
    format: 'json',
    ...params,
  })
  let lastErr: unknown
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${qs}`, {
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error(`lastfm ${method} ${res.status}`)
      const body = (await res.json()) as T & { error?: number }
      if (body.error) throw new Error(`lastfm ${method} error ${body.error}`)
      return body
    } catch (error) {
      lastErr = error
    }
  }
  throw lastErr
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array<R>(items.length)
  let next = 0
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i])
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  )
  return out
}

const cache = new Map<string, { at: number; p: Promise<unknown> }>()

async function cached<T>(
  name: string,
  fn: () => Promise<T | null>,
): Promise<T | null> {
  const hit = cache.get(name)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.p as Promise<T | null>
  const p = fn().then(
    (v) => {
      if (v === null && cache.get(name)?.p === p) cache.delete(name)
      return v
    },
    (error: unknown) => {
      console.error(`[lastfm] ${name} failed:`, error)
      if (cache.get(name)?.p === p) cache.delete(name)
      return null
    },
  )
  cache.set(name, { at: Date.now(), p })
  return p
}

// ---------- time (America/New_York) ----------

const etFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  weekday: 'short',
  hourCycle: 'h23',
})
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function etParts(uts: number): { date: string; weekday: number; hour: number } {
  const p: Record<string, string> = {}
  for (const part of etFormat.formatToParts(new Date(uts * 1000))) {
    p[part.type] = part.value
  }
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    weekday: WEEKDAYS.indexOf(p.weekday),
    hour: Number(p.hour) % 24,
  }
}

function dayNumber(date: string): number {
  return Math.round(Date.parse(`${date}T00:00:00Z`) / (DAY_S * 1000))
}

function isoWeekStart(uts: number): string {
  return new Date(uts * 1000).toISOString().slice(0, 10)
}

// ---------- scrobble history ----------

type RecentTrack = {
  name: string
  url: string
  artist: { '#text': string }
  album?: { '#text': string }
  image?: { '#text': string; size: string }[]
  '@attr'?: { nowplaying?: string }
  date?: { uts: string }
}
type RecentPage = {
  recenttracks: {
    track?: RecentTrack[] | RecentTrack
    '@attr': { totalPages: string }
  }
}

const asArray = <T>(v: T[] | T | undefined): T[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]

async function buildHistory(key: string): Promise<ScrobbleHistory> {
  const nowS = Math.floor(Date.now() / 1000)
  const fromS = nowS - 365 * DAY_S
  const params = { limit: '200', from: String(fromS) }
  const first = await lfm<RecentPage>(
    'user.getrecenttracks',
    { ...params, page: '1' },
    key,
  )
  const totalPages = Number(first.recenttracks['@attr'].totalPages)
  const rest = await mapLimit(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => i + 2),
    CONCURRENCY,
    async (page) =>
      lfm<RecentPage>(
        'user.getrecenttracks',
        { ...params, page: String(page) },
        key,
      ),
  )

  const perDay: Record<string, number> = {}
  const hourGrid = Array.from({ length: 7 }, () =>
    new Array<number>(24).fill(0),
  )
  const dayArtists = new Map<string, Map<string, number>>()
  const firstMonth = new Map<string, string>()
  const monthArtists = new Map<string, Map<string, number>>() // month -> artist -> n
  let total = 0

  const rows: { uts: number; artist: string }[] = []
  for (const page of [first, ...rest]) {
    for (const t of asArray(page.recenttracks.track)) {
      if (t['@attr']?.nowplaying === 'true' || !t.date) continue
      rows.push({ uts: Number(t.date.uts), artist: t.artist['#text'] })
    }
  }
  rows.sort((a, b) => a.uts - b.uts)

  for (const { uts, artist } of rows) {
    const { date, weekday, hour } = etParts(uts)
    const month = date.slice(0, 7)
    total++
    perDay[date] = (perDay[date] ?? 0) + 1
    hourGrid[weekday][hour]++
    const da = dayArtists.get(date) ?? new Map<string, number>()
    da.set(artist, (da.get(artist) ?? 0) + 1)
    dayArtists.set(date, da)
    if (!firstMonth.has(artist)) firstMonth.set(artist, month)
    const ma = monthArtists.get(month) ?? new Map<string, number>()
    ma.set(artist, (ma.get(artist) ?? 0) + 1)
    monthArtists.set(month, ma)
  }

  const dayTopArtists: Record<string, string[]> = {}
  for (const [date, m] of dayArtists) {
    dayTopArtists[date] = [...m.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 3)
      .map(([a]) => a)
  }

  const monthly = [...monthArtists.keys()].sort().map((month) => {
    const artists = [...monthArtists.get(month)!]
    const scrobbles = artists.reduce((s, [, n]) => s + n, 0)
    const newArtists = artists.filter(
      ([a]) => firstMonth.get(a) === month,
    ).length
    return {
      month,
      scrobbles,
      newArtists,
      repeatArtists: artists.length - newArtists,
    }
  })

  const dates = Object.keys(perDay).sort()
  let busiestDay = { date: '', count: 0 }
  let longest = { days: 0, start: '', end: '' }
  let runStart = ''
  let run = 0
  dates.forEach((d, i) => {
    if (perDay[d] > busiestDay.count) busiestDay = { date: d, count: perDay[d] }
    if (i > 0 && dayNumber(d) - dayNumber(dates[i - 1]) === 1) run++
    else {
      run = 1
      runStart = d
    }
    if (run > longest.days) longest = { days: run, start: runStart, end: d }
  })

  const today = etParts(nowS).date
  let currentStreak = 0
  const last = dates.at(-1)
  if (last !== undefined && dayNumber(today) - dayNumber(last) <= 1) {
    currentStreak = 1
    for (let i = dates.length - 1; i > 0; i--) {
      if (dayNumber(dates[i]) - dayNumber(dates[i - 1]) === 1) currentStreak++
      else break
    }
  }

  return {
    from: etParts(fromS).date,
    to: today,
    total,
    perDay,
    hourGrid,
    activeDays: dates.length,
    longestStreak: longest,
    currentStreak,
    busiestDay,
    monthly,
    dayTopArtists,
  }
}

export async function getScrobbleHistory(): Promise<ScrobbleHistory | null> {
  return cached('history', async () => {
    const key = process.env.LASTFM_TOKEN
    return key ? await buildHistory(key) : null
  })
}

// ---------- weekly stream ----------

type WeekRange = { from: string; to: string }
type WeeklyArtistChart = {
  weeklyartistchart: {
    artist?:
      | { name: string; playcount: string }[]
      | { name: string; playcount: string }
  }
}

async function buildWeekly(key: string): Promise<WeeklyStream> {
  const list = await lfm<{ weeklychartlist: { chart: WeekRange[] } }>(
    'user.getweeklychartlist',
    {},
    key,
  )
  const ranges = list.weeklychartlist.chart.slice(-52)
  const charts = await mapLimit(ranges, CONCURRENCY, async (r) => {
    const c = await lfm<WeeklyArtistChart>(
      'user.getweeklyartistchart',
      { from: r.from, to: r.to },
      key,
    )
    return asArray(c.weeklyartistchart.artist)
  })
  const totals = new Map<string, number>()
  for (const week of charts) {
    for (const a of week) {
      totals.set(a.name, (totals.get(a.name) ?? 0) + Number(a.playcount))
    }
  }
  const top = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => name)
  const topSet = new Set(top)
  return {
    weeks: ranges.map((r) => isoWeekStart(Number(r.from))),
    series: top.map((artist) => ({
      artist,
      plays: charts.map((w) =>
        w
          .filter((a) => a.name === artist)
          .reduce((s, a) => s + Number(a.playcount), 0),
      ),
    })),
    other: charts.map((w) =>
      w
        .filter((a) => !topSet.has(a.name))
        .reduce((s, a) => s + Number(a.playcount), 0),
    ),
  }
}

export async function getWeeklyStream(): Promise<WeeklyStream | null> {
  return cached('weekly', async () => {
    const key = process.env.LASTFM_TOKEN
    return key ? await buildWeekly(key) : null
  })
}

// ---------- genres ----------

type TopArtist = { name: string; playcount: string; url: string }
type TopArtistsResp = { topartists: { artist?: TopArtist[] | TopArtist } }

const PERIODS: TopPeriod[] = [
  '7day',
  '1month',
  '3month',
  '6month',
  '12month',
  'overall',
]

// Tags that are not genres. Real genres on this account carry votes of 20+
// while places and jokes sit far below, so a vote floor does most of the work.
const MIN_TAG_COUNT = 20

// Display names. Tags that map to the same name are merged (their weights add).
const GENRE_ALIASES: Record<string, string> = {
  'alternative rock': 'alt rock',
  'progressive rock': 'prog rock',
  'progressive metal': 'prog metal',
  'experimental electronic': 'experimental',
  'hip hop': 'hip-hop',
}
const JUNK_TAGS = new Set([
  'seen live',
  'favorites',
  'favourites',
  'favorite',
  'favourite',
  'love',
  'awesome',
  'albums i own',
  'under 2000 listeners',
  'dj',
  'producer',
  'podcast',
  'biracial',
  'male vocalists',
  'female vocalists',
  'american',
  'usa',
  'british',
  'uk',
])

type RawTag = { name: string; count: number | string }
type TagsResp = { toptags: { tag?: RawTag[] | RawTag } }

// Artist tags barely change, so they live much longer than the 6h chart cache.
const TAG_TTL_MS = 7 * 24 * 60 * 60 * 1000
const tagCache = new Map<string, { at: number; p: Promise<RawTag[]> }>()

async function artistTags(name: string, key: string): Promise<RawTag[]> {
  const id = name.toLowerCase()
  const hit = tagCache.get(id)
  if (hit && Date.now() - hit.at < TAG_TTL_MS) return hit.p
  const p = lfm<TagsResp>(
    'artist.gettoptags',
    { artist: name, limit: '8', autocorrect: '1' },
    key,
  ).then((r) => asArray(r.toptags.tag))
  tagCache.set(id, { at: Date.now(), p })
  // A failed lookup must not be remembered for a week.
  p.catch(() => {
    if (tagCache.get(id)?.p === p) tagCache.delete(id)
  })
  return p
}

// Weight each genre by plays x vote share, normalised to 100.
function weighGenres(
  artists: { name: string; plays: number }[],
  tags: Map<string, RawTag[]>,
): GenreMap {
  const artistNames = new Set(artists.map((a) => a.name.toLowerCase()))
  const weights = new Map<string, number>()
  for (const a of artists) {
    for (const t of tags.get(a.name.toLowerCase()) ?? []) {
      const raw = t.name.trim().toLowerCase()
      const name = GENRE_ALIASES[raw] ?? raw
      const votes = Number(t.count)
      if (
        !raw ||
        votes < MIN_TAG_COUNT ||
        JUNK_TAGS.has(raw) ||
        artistNames.has(raw)
      ) {
        continue
      }
      weights.set(name, (weights.get(name) ?? 0) + a.plays * (votes / 100))
    }
  }
  const best = [...weights.entries()].sort((x, y) => y[1] - x[1]).slice(0, 24)
  const sum = best.reduce((n, [, w]) => n + w, 0)
  return {
    tags: best.map(([name, w]) => ({
      name,
      weight: sum > 0 ? Math.round((w / sum) * 1000) / 10 : 0,
    })),
  }
}

async function topArtistsFor(
  period: TopPeriod,
  key: string,
): Promise<{ name: string; plays: number }[]> {
  const r = await lfm<TopArtistsResp>(
    'user.gettopartists',
    { period, limit: '30' },
    key,
  )
  return asArray(r.topartists.artist).map((a) => ({
    name: a.name,
    plays: Number(a.playcount),
  }))
}

async function tagsFor(
  names: string[],
  key: string,
): Promise<Map<string, RawTag[]>> {
  // One unknown or malformed artist (Last.fm error 6) must not sink the rest.
  const lists = await mapLimit(names, 3, async (n) =>
    artistTags(n, key).catch((): RawTag[] => []),
  )
  return new Map(names.map((n, i) => [n.toLowerCase(), lists[i]]))
}

async function buildGenres(key: string): Promise<GenreMap> {
  const top = await topArtistsFor('6month', key)
  return weighGenres(
    top,
    await tagsFor(
      top.map((a) => a.name),
      key,
    ),
  )
}

// One genre map per time range (about 100 tag lookups cold, cached a week).
async function buildGenresByPeriod(key: string): Promise<GenresByPeriod> {
  const lists = await mapLimit(PERIODS, 3, async (p) => topArtistsFor(p, key))
  const names = [...new Set(lists.flat().map((a) => a.name))]
  const tags = await tagsFor(names, key)
  const out = {} as GenresByPeriod
  PERIODS.forEach((p, i) => {
    out[p] = weighGenres(lists[i], tags)
  })
  return out
}

/** Artist tags remembered between refreshes, so only new artists cost a request. */
export type TagStore = Record<string, { at: number; tags: RawTag[] }>

/** How many artist lookups one refresh may make. The rest wait for the next round. */
const TAG_LOOKUPS_PER_REFRESH = 30

/**
 * Genre maps for every time range, built to fit one invocation's request budget:
 * 6 top-artist calls plus at most TAG_LOOKUPS_PER_REFRESH tag lookups, the most
 * played unknown artists first. `partial` says some artists still have no tags,
 * so the caller should refresh again.
 */
export async function computeGenres(known: TagStore): Promise<{
  data: GenresByPeriod
  tags: TagStore
  partial: boolean
} | null> {
  const key = process.env.LASTFM_TOKEN
  if (!key) return null
  const lists = await mapLimit(PERIODS, 3, async (p) => topArtistsFor(p, key))

  const played = new Map<string, { name: string; plays: number }>()
  for (const a of lists.flat()) {
    const id = a.name.toLowerCase()
    played.set(id, {
      name: a.name,
      plays: (played.get(id)?.plays ?? 0) + a.plays,
    })
  }
  const now = Date.now()
  const missing = [...played.values()]
    .filter((a) => {
      const hit = known[a.name.toLowerCase()]
      return !hit || now - hit.at >= TAG_TTL_MS
    })
    .sort((x, y) => y.plays - x.plays)
  const batch = missing.slice(0, TAG_LOOKUPS_PER_REFRESH)
  const looked = await mapLimit(batch, 3, async (a) =>
    artistTags(a.name, key).catch((): null => null),
  )

  const tags: TagStore = { ...known }
  batch.forEach((a, i) => {
    const found = looked[i]
    if (found) tags[a.name.toLowerCase()] = { at: now, tags: found }
  })
  const byName = new Map(
    Object.entries(tags).map(([name, v]) => [name, v.tags] as const),
  )
  const data = {} as GenresByPeriod
  PERIODS.forEach((p, i) => {
    data[p] = weighGenres(lists[i], byName)
  })
  const partial =
    missing.length > batch.length || looked.some((found) => found === null)
  return { data, tags, partial }
}

export async function getGenresByPeriod(): Promise<GenresByPeriod | null> {
  return cached('genres-by-period', async () => {
    const key = process.env.LASTFM_TOKEN
    return key ? await buildGenresByPeriod(key) : null
  })
}

export async function getGenreMap(): Promise<GenreMap | null> {
  return cached('genres', async () => {
    const key = process.env.LASTFM_TOKEN
    return key ? await buildGenres(key) : null
  })
}

// ---------- period tops ----------

export async function getPeriodTops(): Promise<PeriodTops | null> {
  return cached('tops', async () => {
    const key = process.env.LASTFM_TOKEN
    if (!key) return null
    const results = await Promise.all(
      PERIODS.map(async (period) =>
        lfm<TopArtistsResp>('user.gettopartists', { period, limit: '10' }, key),
      ),
    )
    const out = {} as PeriodTops
    PERIODS.forEach((p, i) => {
      out[p] = asArray(results[i].topartists.artist).map((a) => ({
        name: a.name,
        plays: Number(a.playcount),
        url: a.url,
      }))
    })
    return out
  })
}

// ---------- library totals ----------

type InfoResp = {
  user: {
    playcount: string
    artist_count: string
    album_count: string
    track_count: string
  }
}

export async function getLastfmStats(): Promise<LastfmStats | null> {
  return cached('stats', async () => {
    const key = process.env.LASTFM_TOKEN
    if (!key) return null
    const info = await lfm<InfoResp>('user.getinfo', {}, key)
    const u = info.user
    return {
      scrobbles: Number(u.playcount),
      artists: Number(u.artist_count),
      albums: Number(u.album_count),
      tracks: Number(u.track_count),
    }
  })
}

// ---------- top charts: artists, albums, tracks x every period ----------

type TopRow = {
  name: string
  playcount: string
  url: string
  artist?: { name: string }
}
type TopChartResp = {
  topartists?: { artist?: TopRow[] | TopRow }
  topalbums?: { album?: TopRow[] | TopRow }
  toptracks?: { track?: TopRow[] | TopRow }
}

const TOP_METHODS: Record<TopKind, string> = {
  artists: 'user.gettopartists',
  albums: 'user.gettopalbums',
  tracks: 'user.gettoptracks',
}

function topRows(kind: TopKind, r: TopChartResp): TopItem[] {
  const rows =
    kind === 'artists'
      ? asArray(r.topartists?.artist)
      : kind === 'albums'
        ? asArray(r.topalbums?.album)
        : asArray(r.toptracks?.track)
  return rows.map((row) => ({
    name: row.name,
    by: row.artist?.name ?? null,
    plays: Number(row.playcount),
    url: row.url,
  }))
}

// 18 requests (3 kinds x 6 periods), made 3 at a time to stay well inside
// Last.fm's undocumented per-IP limit; cached for 6h like the rest.
export async function getTopCharts(): Promise<TopCharts | null> {
  return cached('charts', async () => {
    const key = process.env.LASTFM_TOKEN
    if (!key) return null
    const kinds = Object.keys(TOP_METHODS) as TopKind[]
    const jobs = kinds.flatMap((kind) =>
      PERIODS.map((period) => ({ kind, period })),
    )
    const rows = await mapLimit(jobs, 3, async ({ kind, period }) =>
      lfm<TopChartResp>(TOP_METHODS[kind], { period, limit: '10' }, key),
    )
    const out = { artists: {}, albums: {}, tracks: {} } as TopCharts
    jobs.forEach(({ kind, period }, i) => {
      out[kind][period] = topRows(kind, rows[i])
    })
    return out
  })
}

// ---------- now playing ----------

export async function getNowPlaying(): Promise<NowPlaying> {
  const key = process.env.LASTFM_TOKEN
  if (!key) return null
  try {
    const r = await lfm<{
      recenttracks: { track?: RecentTrack[] | RecentTrack }
    }>('user.getrecenttracks', { limit: '1' }, key)
    const t = asArray(r.recenttracks.track)[0]
    if (!t) return null
    const images = (t.image ?? []).filter(
      (i) => i['#text'] && !i['#text'].includes(PLACEHOLDER_IMAGE),
    )
    const nowPlaying = t['@attr']?.nowplaying === 'true'
    let image = images.length ? images[images.length - 1]['#text'] : null
    let album = t.album?.['#text'] || null
    if (!image) {
      // Last.fm has no cover (common for singles and DJ sets): ask Spotify.
      const art = await findAlbumArt(t.name, t.artist['#text'])
      if (art) {
        image = art.image
        album ??= art.album
      }
    }
    return {
      nowPlaying,
      name: t.name,
      artist: t.artist['#text'],
      album,
      image,
      at:
        !nowPlaying && t.date
          ? new Date(Number(t.date.uts) * 1000).toISOString()
          : null,
      url: t.url,
    }
  } catch {
    return null
  }
}

// ---------- coding vs listening ----------

function pearson(xs: number[], ys: number[]): number | null {
  const n = xs.length
  if (n < 2) return null
  const mx = xs.reduce((s, v) => s + v, 0) / n
  const my = ys.reduce((s, v) => s + v, 0) / n
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my)
    sxx += (xs[i] - mx) ** 2
    syy += (ys[i] - my) ** 2
  }
  if (sxx === 0 || syy === 0) return null
  return Math.round((sxy / Math.sqrt(sxx * syy)) * 1000) / 1000
}

function topArtistDays(
  dates: string[],
  dayTop: Record<string, string[]>,
): { artist: string; days: number }[] {
  const counts = new Map<string, number>()
  for (const d of dates) {
    for (const a of dayTop[d] ?? []) counts.set(a, (counts.get(a) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([artist, days]) => ({ artist, days }))
}

export async function getCodingVsListening(): Promise<CodingVsListening | null> {
  return cached('coding', async () => {
    const [history, gh] = await Promise.all([
      getScrobbleHistory(),
      getGithubActivity(),
    ])
    if (!history || !gh || gh.source !== 'authenticated' || !gh.calendar)
      return null
    const days = gh.calendar.map((c) => ({
      date: c.date,
      contributions: c.count,
      scrobbles: history.perDay[c.date] ?? 0,
    }))
    const active = days
      .map((d) => d.contributions)
      .filter((c) => c >= 1)
      .sort((a, b) => a - b)
    const p75 = active.length ? active[Math.ceil(0.75 * active.length) - 1] : 0
    const heavyThreshold = Math.max(5, p75)
    return {
      days,
      correlation: pearson(
        days.map((d) => d.contributions),
        days.map((d) => d.scrobbles),
      ),
      heavyThreshold,
      heavyCodingArtists: topArtistDays(
        days
          .filter((d) => d.contributions >= heavyThreshold)
          .map((d) => d.date),
        history.dayTopArtists,
      ),
      lightCodingArtists: topArtistDays(
        days.filter((d) => d.contributions === 0).map((d) => d.date),
        history.dayTopArtists,
      ),
    }
  })
}

export type * from '@/lib/integrations/lastfm-history-types'
