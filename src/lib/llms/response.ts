/** Static, cacheable plain responses for llms.txt and the Markdown pages. */
const CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'

export function markdown(
  body: string,
  type: 'text/markdown' | 'text/plain' = 'text/markdown',
): Response {
  return new Response(body, {
    headers: {
      'Content-Type': `${type}; charset=utf-8`,
      'Cache-Control': CACHE,
      'Access-Control-Allow-Origin': '*',
      // Models read this file as text, so keep browsers from guessing.
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Accept',
    },
  })
}
