import type {
  TopKind,
  TopPeriod,
} from '@/lib/integrations/lastfm-history-types'

/** What `/api/v1/lastfm?section=` can return. The first is the default. */
export const MUSIC_SECTIONS = [
  'favorites',
  'now',
  'stats',
  'tops',
  'charts',
  'genres',
  'weekly',
  'history',
  'coding',
] as const

export const MUSIC_PERIODS = [
  '7day',
  '1month',
  '3month',
  '6month',
  '12month',
  'overall',
] as const satisfies readonly TopPeriod[]

export const MUSIC_KINDS = [
  'artists',
  'albums',
  'tracks',
] as const satisfies readonly TopKind[]

export const MUSIC_LIMITS = ['5', '10', '25', '50'] as const
export const MUSIC_MAX_LIMIT = 100

export type MusicSection = (typeof MUSIC_SECTIONS)[number]

const has = <T extends string>(list: readonly T[], v: string): v is T =>
  (list as readonly string[]).includes(v)

export const isMusicSection = (v: string) => has(MUSIC_SECTIONS, v)
export const isMusicPeriod = (v: string): v is TopPeriod =>
  has(MUSIC_PERIODS, v)
export const isMusicKind = (v: string): v is TopKind => has(MUSIC_KINDS, v)
