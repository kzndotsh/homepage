import type { SpotifyPlaylistInfo } from '@/lib/integrations/types'

/** Match a curated playlist to its Spotify record by name, exact first. */
export function findPlaylistInfo(
  all: Record<string, SpotifyPlaylistInfo> | null,
  name: string,
): SpotifyPlaylistInfo | null {
  if (!all) return null
  const lower = name.toLowerCase()
  return (
    all[name] ??
    Object.values(all).find((i) => i.name.toLowerCase() === lower) ??
    Object.values(all).find((i) => i.name.toLowerCase().includes(lower)) ??
    null
  )
}
