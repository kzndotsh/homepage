import type { HardcoverBook } from '@/lib/integrations/types'

export function libraryStats(books: HardcoverBook[]) {
  const pages = books.reduce((n, b) => n + (b.pages ?? 0), 0)
  const withPages = books.filter((b) => b.pages)
  return {
    count: books.length,
    pages,
    // Averaged over books that report a page count.
    avgPages: withPages.length ? Math.round(pages / withPages.length) : null,
    authors: new Set(books.map((b) => b.author.toLowerCase())).size,
  }
}
