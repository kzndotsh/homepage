import type { HardcoverBook, HardcoverLibrary } from '@/lib/integrations/types'

const STATUS: Record<number, HardcoverBook['status']> = {
  1: 'want',
  2: 'reading',
  3: 'read',
  4: 'paused',
  5: 'dnf',
}

// Titles kept off the public page even though they are on the shelf.
const HIDDEN = [/your brain on porn/i]

const QUERY = `{
  me {
    username
    books_count
    user_books(order_by: { updated_at: desc }, limit: 100) {
      status_id
      rating
      date_added
      last_read_date
      book {
        id
        title
        slug
        pages
        release_year
        image { url }
        editions(
          where: { image_id: { _is_null: false } }
          limit: 1
          order_by: { users_count: desc }
        ) {
          image { url }
        }
        contributions { author { name } }
      }
    }
  }
}`

type Row = {
  status_id: number
  rating: number | null
  date_added: string | null
  last_read_date: string | null
  book: {
    id: number
    title: string
    slug: string | null
    pages: number | null
    release_year: number | null
    image: { url: string } | null
    editions: { image: { url: string } | null }[]
    contributions: { author: { name: string } | null }[]
  }
}

type Response = {
  data?: {
    me?: { username: string; books_count: number; user_books: Row[] }[]
  }
}

const clean = (s: string) => s.replaceAll(/\s+/g, ' ').trim()

// "Atomic habits: An Easy & Proven Way..." -> "Atomic habits"
const shortTitle = (t: string) => clean(t.split(/[:(]/)[0] ?? t) || clean(t)

export async function fetchHardcoverLibrary(): Promise<HardcoverLibrary | null> {
  const token = process.env.HARDCOVER_TOKEN
  if (!token) {
    console.error('[hardcover] HARDCOVER_TOKEN is not set')
    return null
  }
  try {
    const res = await fetch('https://api.hardcover.app/v1/graphql', {
      method: 'POST',
      headers: {
        authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      console.error(`[hardcover] request failed: HTTP ${res.status}`)
      return null
    }
    const body = (await res.json()) as Response
    const me = body.data?.me?.[0]
    if (!me) {
      console.error(
        '[hardcover] response had no user:',
        JSON.stringify(body).slice(0, 300),
      )
      return null
    }

    const seen = new Set<string>()
    const books: HardcoverBook[] = []
    for (const r of me.user_books) {
      if (HIDDEN.some((h) => h.test(r.book.title))) continue
      const title = shortTitle(r.book.title)
      // A second edition of the same book is not a second book.
      const key = title.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      const author = r.book.contributions[0]?.author?.name
      books.push({
        id: r.book.id,
        title,
        author: author ? clean(author) : 'Unknown',
        year: r.book.release_year,
        pages: r.book.pages,
        rating: r.rating,
        status: STATUS[r.status_id] ?? 'read',
        // Some books have no default cover but one of their editions does.
        cover: r.book.image?.url ?? r.book.editions[0]?.image?.url ?? null,
        url: r.book.slug
          ? `https://hardcover.app/books/${r.book.slug}`
          : 'https://hardcover.app',
        addedAt: r.date_added ?? '',
        readAt: r.last_read_date,
      })
    }
    // Most recently finished first; books with no read date fall back to the
    // day they were added.
    const when = (b: HardcoverBook) => b.readAt ?? b.addedAt.slice(0, 10)
    books.sort((a, b) => when(b).localeCompare(when(a)))
    return {
      username: me.username,
      total: me.books_count,
      fetchedAt: new Date().toISOString(),
      books,
    }
  } catch (error) {
    console.error('[hardcover] fetch failed:', error)
    return null
  }
}
