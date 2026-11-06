import { json, limited, methodGuards } from '@/app/api/_lib/respond'
import { playlists, playlistsIntro } from '@/content'
import { getSpotifyPlaylists } from '@/lib/integrations'

async function get(): Promise<Response> {
  const spotify = await getSpotifyPlaylists()
  return json({
    note: playlistsIntro,
    spotifyStats: spotify !== null,
    playlists: playlists.map((p) => {
      const id = /playlist\/([A-Za-z0-9]+)/.exec(p.href)?.[1]
      const info = id && spotify ? spotify[id] : undefined
      return {
        name: p.name,
        genres: p.genres,
        href: p.href,
        ...(info
          ? { trackCount: info.trackCount, followers: info.followers }
          : {}),
      }
    }),
  })
}

export const { POST, PUT, PATCH, DELETE } = methodGuards

export const GET = limited(get)
