import playlists from '@/content/playlists-data'
import type { SpotifyPlaylistInfo } from '@/lib/integrations/types'

// Not tested live: no Spotify credentials were available when written.
let cached: { token: string; expires: number } | null = null

type TokenResponse = { access_token: string; expires_in: number }
type PlaylistResponse = {
  id: string
  name: string
  external_urls?: { spotify?: string }
  images?: { url: string }[]
  followers?: { total?: number }
  tracks?: { total?: number }
}

export function playlistIds(): string[] {
  return playlists
    .map(
      (p) => /open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/.exec(p.href)?.[1],
    )
    .filter((id): id is string => Boolean(id))
}

async function accessToken(id: string, secret: string): Promise<string | null> {
  if (cached && cached.expires > Date.now() + 30_000) return cached.token
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(6000),
  })
  if (!res.ok) return null
  const json = (await res.json()) as TokenResponse
  cached = {
    token: json.access_token,
    expires: Date.now() + json.expires_in * 1000,
  }
  return cached.token
}

async function one(
  id: string,
  token: string,
): Promise<SpotifyPlaylistInfo | null> {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${id}?fields=id,name,external_urls,images,followers.total,tracks.total`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(6000),
      },
    )
    if (!res.ok) return null
    const p = (await res.json()) as PlaylistResponse
    return {
      id: p.id,
      name: p.name,
      trackCount: p.tracks?.total ?? 0,
      followers: p.followers?.total ?? null,
      url:
        p.external_urls?.spotify ?? `https://open.spotify.com/playlist/${p.id}`,
      image: p.images?.[0]?.url ?? null,
    }
  } catch {
    return null
  }
}

export async function fetchSpotifyPlaylists(): Promise<Record<
  string,
  SpotifyPlaylistInfo
> | null> {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  if (!id || !secret) return null
  try {
    const token = await accessToken(id, secret)
    if (!token) return null
    const results = await Promise.all(
      playlistIds().map(async (pid) => one(pid, token)),
    )
    const out: Record<string, SpotifyPlaylistInfo> = {}
    for (const r of results) if (r) out[r.id] = r
    return Object.keys(out).length ? out : null
  } catch {
    return null
  }
}

type SearchResponse = {
  tracks?: {
    items?: {
      name: string
      artists: { name: string }[]
      album: { name: string; images: { url: string; width: number }[] }
    }[]
  }
}

const norm = (v: string) =>
  v
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
const artCache = new Map<
  string,
  Promise<{ image: string; album: string } | null>
>()

/**
 * Album art for a track Last.fm has no cover for. Only accepts a result whose
 * artist matches, so a wrong cover is never shown for an obscure track.
 */
export async function findAlbumArt(
  track: string,
  artist: string,
): Promise<{ image: string; album: string } | null> {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  if (!id || !secret) return Promise.resolve(null)
  const key = `${norm(artist)}|${norm(track)}`
  const hit = artCache.get(key)
  if (hit) return hit
  const p = (async () => {
    try {
      const token = await accessToken(id, secret)
      if (!token) return null
      const q = `track:${track.replaceAll('"', '')} artist:${artist.replaceAll('"', '')}`
      const res = await fetch(
        `https://api.spotify.com/v1/search?${new URLSearchParams({ q, type: 'track', limit: '5' })}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(6000),
        },
      )
      if (!res.ok) return null
      const items = ((await res.json()) as SearchResponse).tracks?.items ?? []
      const wanted = norm(artist)
      const match = items.find((i) =>
        i.artists.some((a) => {
          const got = norm(a.name)
          return got === wanted || got.includes(wanted) || wanted.includes(got)
        }),
      )
      const images = match?.album.images ?? []
      const img = images.find((i) => i.width === 300) ?? images[0]
      return match && img ? { image: img.url, album: match.album.name } : null
    } catch {
      return null
    }
  })()
  artCache.set(key, p)
  // Do not remember failures (rate limits, timeouts) forever.
  void p.then((v) => {
    if (v === null) artCache.delete(key)
  })
  return p
}
