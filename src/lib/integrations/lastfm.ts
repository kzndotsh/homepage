import type { LastfmFavorites } from '@/lib/integrations/types'

const USER = 'growwithlogan'

type Artist = { name: string; playcount: string; url: string }
type Track = {
  name: string
  playcount: string
  url: string
  artist: { name: string }
}
type Recent = {
  name: string
  artist: { '#text': string }
  '@attr'?: { nowplaying?: string }
  date?: { uts: string }
}

async function call<T>(
  method: string,
  extra: Record<string, string>,
  key: string,
): Promise<T> {
  const qs = new URLSearchParams({
    method,
    user: USER,
    api_key: key,
    format: 'json',
    ...extra,
  })
  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${qs}`, {
    signal: AbortSignal.timeout(6000),
  })
  if (!res.ok) throw new Error(`lastfm ${method} ${res.status}`)
  const json = (await res.json()) as T & { error?: number }
  if (json.error) throw new Error(`lastfm ${method} error ${json.error}`)
  return json
}

export async function fetchLastfmFavorites(): Promise<LastfmFavorites | null> {
  const key = process.env.LASTFM_TOKEN
  if (!key) return null
  try {
    const period = { period: '6month', limit: '8' }
    const [info, artists, tracks, recent] = await Promise.all([
      call<{ user: { playcount: string } }>('user.getinfo', {}, key),
      call<{ topartists: { artist: Artist[] } }>(
        'user.gettopartists',
        period,
        key,
      ),
      call<{ toptracks: { track: Track[] } }>('user.gettoptracks', period, key),
      call<{ recenttracks: { track: Recent[] } }>(
        'user.getrecenttracks',
        { limit: '5' },
        key,
      ),
    ])
    return {
      scrobbles: Number(info.user.playcount),
      topArtists: artists.topartists.artist.map((a) => ({
        name: a.name,
        plays: Number(a.playcount),
        url: a.url,
      })),
      topTracks: tracks.toptracks.track.map((t) => ({
        name: t.name,
        artist: t.artist.name,
        plays: Number(t.playcount),
        url: t.url,
      })),
      recent: recent.recenttracks.track.slice(0, 5).map((t) => ({
        name: t.name,
        artist: t.artist['#text'],
        nowPlaying: t['@attr']?.nowplaying === 'true',
        at: t.date ? new Date(Number(t.date.uts) * 1000).toISOString() : null,
      })),
    }
  } catch {
    return null
  }
}
