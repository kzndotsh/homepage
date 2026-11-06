import type { TraktActivity, TraktItem } from '@/lib/integrations/types'

const API = 'https://api.trakt.tv'
const DAY = 86_400_000
const MAX_PAGES = 4

type Images = { poster?: string[] }
type Media = {
  title: string
  year: number | null
  runtime?: number | null
  ids: { slug?: string }
  images?: Images
}
type HistoryRow = {
  id: number
  watched_at: string
  type: 'movie' | 'episode'
  movie?: Media
  show?: Media
  episode?: { season: number; number: number; title: string | null }
}
type WatchedShow = { plays: number; show: Media }
type WatchedMovie = { plays: number; movie: Media }
type WatchlistRow = { type: 'movie' | 'show'; movie?: Media; show?: Media }

const poster = (m: Media) => {
  const p = m.images?.poster?.[0]
  return p ? `https://${p}` : null
}
const link = (kind: 'movies' | 'shows', m: Media) =>
  `https://trakt.tv/${kind}/${m.ids.slug ?? ''}`
const code = (e: NonNullable<HistoryRow['episode']>) =>
  `S${String(e.season).padStart(2, '0')}E${String(e.number).padStart(2, '0')}`

export async function fetchTraktActivity(): Promise<TraktActivity | null> {
  const key = process.env.TRAKT_CLIENT_ID
  if (!key) return null
  const user = process.env.TRAKT_USERNAME ?? 'kzndotsh'

  const get = async <T>(path: string): Promise<T | null> => {
    const res = await fetch(`${API}${path}`, {
      headers: {
        'trakt-api-key': key,
        'trakt-api-version': '2',
        // Trakt sits behind Cloudflare, which flags empty or very short UAs.
        'user-agent': 'kzn.sh/1.0 (+https://kzn.sh)',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok || res.status === 204) return null
    return (await res.json()) as T
  }

  try {
    const since = new Date(Date.now() - 365 * DAY).toISOString()
    const history: HistoryRow[] = []
    for (let page = 1; page <= MAX_PAGES; page++) {
      const rows = await get<HistoryRow[]>(
        `/users/${user}/history?limit=250&page=${page}&start_at=${since}&extended=full`,
      )
      if (!rows?.length) break
      history.push(...rows)
      if (rows.length < 250) break
    }

    const [shows, movies, watchlist] = await Promise.all([
      get<WatchedShow[]>(
        `/users/${user}/watched/shows?extended=full,noseasons`,
      ),
      get<WatchedMovie[]>(`/users/${user}/watched/movies?extended=full`),
      get<WatchlistRow[]>(`/users/${user}/watchlist?extended=full&limit=12`),
    ])
    if (!shows && !movies && !history.length) return null

    const recent: TraktItem[] = []
    const byKey = new Map<string, TraktItem>()
    for (const row of history) {
      const m = row.type === 'movie' ? row.movie : row.show
      if (!m) continue
      const day = row.watched_at.slice(0, 10)
      const key = `${row.type}:${m.ids.slug}:${day}`
      const label = row.episode
        ? `${code(row.episode)}${row.episode.title ? ` ${row.episode.title}` : ''}`
        : null
      const hit = byKey.get(key)
      if (hit) {
        hit.count += 1
        continue
      }
      const item: TraktItem = {
        id: key,
        kind: row.type === 'movie' ? 'movie' : 'show',
        title: m.title,
        year: m.year,
        poster: poster(m),
        url: link(row.type === 'movie' ? 'movies' : 'shows', m),
        at: row.watched_at,
        count: 1,
        last: label,
        runtime: m.runtime ?? null,
      }
      byKey.set(key, item)
      recent.push(item)
    }

    const perDay = new Map<string, number>()
    for (const row of history) {
      const d = row.watched_at.slice(0, 10)
      perDay.set(d, (perDay.get(d) ?? 0) + 1)
    }
    const calendar: TraktActivity['calendar'] = []
    const today = new Date(new Date().toISOString().slice(0, 10)).getTime()
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today - i * DAY).toISOString().slice(0, 10)
      calendar.push({ date, count: perDay.get(date) ?? 0 })
    }

    const showList = shows ?? []
    const movieList = movies ?? []
    const minutes =
      showList.reduce((n, s) => n + s.plays * (s.show.runtime ?? 0), 0) +
      movieList.reduce((n, m) => n + m.plays * (m.movie.runtime ?? 0), 0)

    return {
      username: user,
      fetchedAt: new Date().toISOString(),
      totals: {
        movies: movieList.length,
        shows: showList.length,
        episodes: showList.reduce((n, s) => n + s.plays, 0),
        minutes,
      },
      recent,
      calendar,
      topShows: [...showList]
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 8)
        .map((s) => ({
          title: s.show.title,
          plays: s.plays,
          url: link('shows', s.show),
        })),
      watchlist: (watchlist ?? []).flatMap((w) => {
        const m = w.type === 'movie' ? w.movie : w.show
        return m
          ? [
              {
                title: m.title,
                year: m.year,
                poster: poster(m),
                url: link(w.type === 'movie' ? 'movies' : 'shows', m),
              },
            ]
          : []
      }),
    }
  } catch {
    return null
  }
}
