import 'server-only'
import {
  fetchCalAvailability,
  fetchPublicEventTypeIds,
} from '@/lib/integrations/cal'
import { fetchGithubActivity } from '@/lib/integrations/github'
import { fetchHardcoverLibrary } from '@/lib/integrations/hardcover'
import { fetchLastfmFavorites } from '@/lib/integrations/lastfm'
import { fetchSpotifyPlaylists } from '@/lib/integrations/spotify'
import { fetchTraktActivity } from '@/lib/integrations/trakt'
import type {
  CalAvailability,
  GithubActivity,
  HardcoverLibrary,
  LastfmFavorites,
  SpotifyPlaylistInfo,
  TraktActivity,
} from '@/lib/integrations/types'

// Every function resolves to null when credentials are missing or the
// upstream call fails, so callers always render a static fallback.
export async function getGithubActivity(): Promise<GithubActivity | null> {
  return fetchGithubActivity()
}

export async function getSpotifyPlaylists(): Promise<Record<
  string,
  SpotifyPlaylistInfo
> | null> {
  return fetchSpotifyPlaylists()
}

export async function getLastfmFavorites(): Promise<LastfmFavorites | null> {
  return fetchLastfmFavorites()
}

export async function getCalAvailability(): Promise<CalAvailability | null> {
  return fetchCalAvailability()
}

export { createCalBooking } from '@/lib/integrations/cal'
export type { BookingOutcome, BookingRequest } from '@/lib/integrations/cal'

export async function getPublicEventTypeIds(): Promise<number[]> {
  return fetchPublicEventTypeIds()
}

export async function getHardcoverLibrary(): Promise<HardcoverLibrary | null> {
  return fetchHardcoverLibrary()
}

export async function getTraktActivity(): Promise<TraktActivity | null> {
  return fetchTraktActivity()
}

export { playlistIds } from '@/lib/integrations/spotify'

export type {
  CalAvailability,
  CalEventType,
  GithubActivity,
  GithubEvent,
  GithubEventKind,
  HardcoverBook,
  HardcoverLibrary,
  LastfmFavorites,
  SpotifyPlaylistInfo,
  TraktActivity,
  TraktItem,
} from '@/lib/integrations/types'
