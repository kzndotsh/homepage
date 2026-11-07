import 'server-only'
import { fetchCalAvailability } from '@/lib/integrations/cal'
import { fetchGithubActivity } from '@/lib/integrations/github'
import { fetchHardcoverLibrary } from '@/lib/integrations/hardcover'
import { fetchLastfmFavorites } from '@/lib/integrations/lastfm'
import {
  computeGenres,
  getLastfmStats,
  getNowPlaying,
  getTopCharts,
  type TagStore,
} from '@/lib/integrations/lastfm-history'
import type { GenresByPeriod } from '@/lib/integrations/lastfm-history-types'
import { fetchSpotifyPlaylists } from '@/lib/integrations/spotify'
import { fetchTraktActivity } from '@/lib/integrations/trakt'

import { readStored, writeStored } from './store'

/** What a refresh returns: the data (null on failure) and whether more rounds are due. */
export type Computed<T> = { data: T | null; partial?: boolean }

const MIN = 60_000
const HOUR = 60 * MIN

const plain =
  <T>(fn: () => Promise<T | null>) =>
  async (): Promise<Computed<T>> => ({ data: await fn() })

// The genre map is the one source too big for a single request budget, so it
// remembers artist tags between refreshes and says when it is not finished.
async function computeGenreSnapshot(): Promise<Computed<GenresByPeriod>> {
  const tags = await readStored<TagStore>('lastfm-tags')
  const out = await computeGenres(tags?.data ?? {})
  if (!out) return { data: null }
  await writeStored('lastfm-tags', { at: Date.now(), data: out.tags })
  return { data: out.data, partial: out.partial }
}

/**
 * Every outside source the homepage shows. Each refresh runs in its own request
 * (see index.ts), so each one has its own budget of outgoing requests: keep a
 * single compute well under 50.
 */
export const SOURCES = {
  github: { ttl: 15 * MIN, compute: plain(fetchGithubActivity) },
  spotify: { ttl: HOUR, compute: plain(fetchSpotifyPlaylists) },
  'lastfm-favorites': { ttl: 6 * HOUR, compute: plain(fetchLastfmFavorites) },
  'lastfm-charts': { ttl: HOUR, compute: plain(getTopCharts) },
  'lastfm-stats': { ttl: 30 * MIN, compute: plain(getLastfmStats) },
  // Refreshed on every render: it is one request, and it is the "now" in now playing.
  'lastfm-now': { ttl: 0, compute: plain(getNowPlaying) },
  'lastfm-genres': { ttl: 6 * HOUR, compute: computeGenreSnapshot },
  hardcover: { ttl: HOUR, compute: plain(fetchHardcoverLibrary) },
  trakt: { ttl: 30 * MIN, compute: plain(fetchTraktActivity) },
  cal: { ttl: 5 * MIN, compute: plain(fetchCalAvailability) },
} as const

export type SourceName = keyof typeof SOURCES
export type SnapshotData<N extends SourceName> = NonNullable<
  Awaited<ReturnType<(typeof SOURCES)[N]['compute']>>['data']
>
