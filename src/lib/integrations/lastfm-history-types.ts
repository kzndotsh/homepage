// Dates are YYYY-MM-DD in America/New_York.
export type ScrobbleHistory = {
  from: string
  to: string
  total: number
  perDay: Record<string, number>
  // [weekday 0=Sunday..6][hour 0..23] scrobble counts
  hourGrid: number[][]
  activeDays: number
  longestStreak: { days: number; start: string; end: string }
  currentStreak: number
  busiestDay: { date: string; count: number }
  // newArtists = artists whose first scrobble in this window fell in that month
  monthly: {
    month: string
    scrobbles: number
    newArtists: number
    repeatArtists: number
  }[]
  // Up to 3 most played artists per active day
  dayTopArtists: Record<string, string[]>
}

export type WeeklyStream = {
  weeks: string[] // ISO date of each week start, oldest first
  series: { artist: string; plays: number[] }[] // top artists, aligned to weeks
  other: number[] // everything outside the top artists, aligned to weeks
}

export type GenreMap = { tags: { name: string; weight: number }[] }

export type TopPeriod =
  '7day' | '1month' | '3month' | '6month' | '12month' | 'overall'

export type PeriodTops = Record<
  TopPeriod,
  { name: string; plays: number; url: string }[]
>

export type NowPlaying = {
  nowPlaying: boolean
  name: string
  artist: string
  album: string | null
  image: string | null
  at: string | null
  url: string
} | null

export type CodingVsListening = {
  days: { date: string; contributions: number; scrobbles: number }[]
  correlation: number | null // Pearson r over the days, null when undefined
  heavyThreshold: number // contributions/day counted as a heavy coding day
  heavyCodingArtists: { artist: string; days: number }[]
  lightCodingArtists: { artist: string; days: number }[]
}

export type TopKind = 'artists' | 'albums' | 'tracks'

export type TopItem = {
  name: string
  // The artist, for albums and tracks; null for artists.
  by: string | null
  plays: number
  url: string
}

export type TopCharts = Record<TopKind, Record<TopPeriod, TopItem[]>>

export type LastfmStats = {
  scrobbles: number
  // Unique counts across the whole library.
  artists: number
  albums: number
  tracks: number
}

export type GenresByPeriod = Record<TopPeriod, GenreMap>
