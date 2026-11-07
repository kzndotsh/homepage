export type GithubEventKind =
  | 'push'
  | 'pr'
  | 'issue'
  | 'comment'
  | 'review'
  | 'branch'
  | 'other'

export type GithubDiff = { additions: number; deletions: number; files: number }

/** The pull request or issue an event belongs to, shown as a #number chip. */
export type GithubThread = {
  number: number
  url: string
}

export type GithubEvent = {
  id: string
  kind: GithubEventKind
  repo: string
  // Short verb phrase such as "merged PR" or "opened issue"; null when none.
  action: string | null
  // Short commit hash (7 chars): merge commit for merged PRs, head for pushes.
  sha: string | null
  // The pull request or issue this is about; null for pushes and branches.
  thread: GithubThread | null
  // Size of the change when known (PRs and pushes).
  diff: GithubDiff | null
  title: string
  url: string
  at: string
}

export type GithubActivity = {
  // 'authenticated' = GraphQL + token (calendar and totals filled);
  // 'public' = unauthenticated public events only (calendar is null).
  source: 'authenticated' | 'public'
  login: string
  fetchedAt: string
  events: GithubEvent[]
  calendar: { date: string; count: number }[] | null
  totals: {
    publicRepos: number
    followers: number
    contributionsLastYear: number | null
    // Stars received across the owner's public, non-fork repos.
    starsEarned: number | null
    // Repos the owner has starred; null without a token.
    starsGiven: number | null
  }
}

export type SpotifyPlaylistInfo = {
  id: string
  name: string
  trackCount: number
  followers: number | null
  url: string
  image: string | null
}

export type LastfmFavorites = {
  scrobbles: number
  topArtists: { name: string; plays: number; url: string }[]
  topTracks: { name: string; artist: string; plays: number; url: string }[]
  recent: {
    name: string
    artist: string
    nowPlaying: boolean
    at: string | null
  }[]
}

export type HardcoverBook = {
  id: number
  title: string
  author: string
  year: number | null
  pages: number | null
  // 0.5 steps up to 5; null when unrated.
  rating: number | null
  status: 'reading' | 'read' | 'want' | 'paused' | 'dnf'
  cover: string | null
  url: string
  addedAt: string
  // Last finished date from Hardcover; null when none was logged.
  readAt: string | null
}

export type HardcoverLibrary = {
  username: string
  total: number
  fetchedAt: string
  books: HardcoverBook[]
}

export type TraktItem = {
  id: string
  kind: 'movie' | 'show'
  title: string
  year: number | null
  poster: string | null
  url: string
  // Most recent play in the group.
  at: string
  // Episodes watched that day (1 for a movie).
  count: number
  // Latest episode in the group, e.g. "S02E05 Love and Be Loved".
  last: string | null
  runtime: number | null
}

export type TraktActivity = {
  username: string
  fetchedAt: string
  totals: { movies: number; shows: number; episodes: number; minutes: number }
  // One entry per show or movie per day, newest first.
  recent: TraktItem[]
  // Plays per day over the past year.
  calendar: { date: string; count: number }[]
  topShows: { title: string; plays: number; url: string }[]
  watchlist: {
    title: string
    year: number | null
    poster: string | null
    url: string
  }[]
}

export type CalEventType = {
  id: number
  slug: string
  title: string
  minutes: number
  // Public booking page, e.g. https://cal.com/<user>/30min.
  url: string
  // Where it happens, e.g. "Cal Video"; null when the event type sets none.
  location: string | null
  // Start of every open slot, in epoch milliseconds, soonest first.
  slots: number[]
}

export type CalAvailability = {
  // The calendar owner's IANA timezone.
  ownerTimeZone: string
  fetchedAt: string
  // Public (non-hidden) event types, shortest first.
  eventTypes: CalEventType[]
}
