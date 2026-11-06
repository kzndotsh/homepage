import { json, limited, methodGuards } from '@/app/api/_lib/respond'
import { getLastfmFavorites } from '@/lib/integrations'
import {
  getCodingVsListening,
  getGenresByPeriod,
  getLastfmStats,
  getNowPlaying,
  getPeriodTops,
  getScrobbleHistory,
  getTopCharts,
  getWeeklyStream,
} from '@/lib/integrations/lastfm-history'
import {
  isMusicKind,
  isMusicPeriod,
  isMusicSection,
  MUSIC_KINDS,
  MUSIC_MAX_LIMIT,
  MUSIC_PERIODS,
  MUSIC_SECTIONS,
} from '@/lib/musicSections'

const bad = (message: string) =>
  json(
    { error: 'bad_query', message },
    { status: 400, headers: { 'Cache-Control': 'no-store' } },
  )

const none = { available: false }

/**
 * Everything the music section draws, one `section` at a time.
 *   section  favorites (default) | now | stats | tops | charts | genres | weekly | history | coding
 *   period   7day | 1month | 3month | 6month | 12month | overall  (tops, charts, genres)
 *   kind     artists | albums | tracks                              (charts)
 *   limit    1 to 100, trims lists                                  (favorites, tops, charts, genres, weekly)
 */
async function get(request: Request): Promise<Response> {
  const q = new URL(request.url).searchParams
  const pick = (key: string) => q.get(key) || null

  const section = pick('section') ?? 'favorites'
  if (!isMusicSection(section)) {
    return bad(`section must be one of: ${MUSIC_SECTIONS.join(', ')}`)
  }
  const period = pick('period')
  if (period !== null && !isMusicPeriod(period)) {
    return bad(`period must be one of: ${MUSIC_PERIODS.join(', ')}`)
  }
  const kind = pick('kind')
  if (kind !== null && !isMusicKind(kind)) {
    return bad(`kind must be one of: ${MUSIC_KINDS.join(', ')}`)
  }
  const rawLimit = pick('limit')
  const limit = rawLimit === null ? null : Number(rawLimit)
  if (
    limit !== null &&
    (!Number.isInteger(limit) || limit < 1 || limit > MUSIC_MAX_LIMIT)
  ) {
    return bad(`limit must be a whole number from 1 to ${MUSIC_MAX_LIMIT}`)
  }
  const cut = <T>(list: T[]): T[] => (limit ? list.slice(0, limit) : list)

  switch (section) {
    case 'favorites': {
      const data = await getLastfmFavorites()
      if (!data) return json(none)
      return json({
        ...data,
        topArtists: cut(data.topArtists),
        topTracks: cut(data.topTracks),
        recent: cut(data.recent),
      })
    }
    case 'now':
      return json(await getNowPlaying())
    case 'stats':
      return json((await getLastfmStats()) ?? none)
    case 'tops': {
      const data = await getPeriodTops()
      if (!data) return json(none)
      if (period && isMusicPeriod(period)) {
        return json({ period, items: cut(data[period]) })
      }
      return json(
        Object.fromEntries(
          Object.entries(data).map(([p, items]) => [p, cut(items)]),
        ),
      )
    }
    case 'charts': {
      const data = await getTopCharts()
      if (!data) return json(none)
      const kinds = kind && isMusicKind(kind) ? [kind] : MUSIC_KINDS
      const periods = period && isMusicPeriod(period) ? [period] : MUSIC_PERIODS
      return json(
        Object.fromEntries(
          kinds.map((k) => [
            k,
            Object.fromEntries(periods.map((p) => [p, cut(data[k][p])])),
          ]),
        ),
      )
    }
    case 'genres': {
      const data = await getGenresByPeriod()
      if (!data) return json(none)
      const periods = period && isMusicPeriod(period) ? [period] : MUSIC_PERIODS
      return json(
        Object.fromEntries(
          periods.map((p) => [p, { tags: cut(data[p].tags) }]),
        ),
      )
    }
    case 'weekly': {
      const data = await getWeeklyStream()
      return json(data ? { ...data, series: cut(data.series) } : none)
    }
    case 'history':
      return json((await getScrobbleHistory()) ?? none)
    case 'coding':
      return json((await getCodingVsListening()) ?? none)
  }
}

export const { POST, PUT, PATCH, DELETE } = methodGuards

export const GET = limited(get)
