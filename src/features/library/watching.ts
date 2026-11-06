import type { TraktItem } from '@/lib/integrations/types'

/** One entry per title; the Trakt history has a row per show per day. */
export const uniqueTitles = (items: TraktItem[]) => {
  const seen = new Set<string>()
  return items.filter((w) => !seen.has(w.url) && seen.add(w.url))
}

export const watchSubtitle = (w: TraktItem) =>
  w.kind === 'movie'
    ? `Movie${w.year ? ` · ${w.year}` : ''}`
    : w.count > 1
      ? `${w.count} episodes`
      : (w.last ?? 'Show')
