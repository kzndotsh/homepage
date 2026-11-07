import { clientIp, hit, LIMIT } from './rate-limit'

export const CACHE = 'public, s-maxage=300, stale-while-revalidate=3600'

const base: Record<string, string> = {
  'Cache-Control': CACHE,
  'Access-Control-Allow-Origin': '*',
  'x-built-on': 'NixOS',
}

export function json(
  data: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    status: init.status ?? 200,
    headers: {
      ...base,
      'Content-Type': 'application/json; charset=utf-8',
      ...init.headers,
    },
  })
}

export function text(
  body: string,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return new Response(body.endsWith('\n') ? body : `${body}\n`, {
    status: init.status ?? 200,
    headers: {
      ...base,
      'Content-Type': 'text/plain; charset=utf-8',
      ...init.headers,
    },
  })
}

function notAllowed(): Response {
  return json(
    {
      error: 'method_not_allowed',
      message: 'This API is read-only. GET only.',
    },
    { status: 405, headers: { Allow: 'GET' } },
  )
}

// Spread into a route module: export const { POST, PUT, PATCH, DELETE } = methodGuards
export const methodGuards = {
  POST: notAllowed,
  PUT: notAllowed,
  PATCH: notAllowed,
  DELETE: notAllowed,
}

type Handler = (request: Request) => Response | Promise<Response>

/** Wraps a GET handler with a per-client rate limit and RateLimit headers. */
export function limited(handler: Handler): Handler {
  return async (request) => {
    const verdict = hit(clientIp(request))
    const meta = {
      'X-RateLimit-Limit': String(LIMIT),
      'X-RateLimit-Remaining': String(verdict.remaining),
      'X-RateLimit-Reset': String(verdict.reset),
    }
    if (!verdict.ok) {
      return json(
        {
          error: 'rate_limited',
          message: `Slow down: ${LIMIT} requests per minute. Try again in ${verdict.reset}s.`,
        },
        {
          status: 429,
          headers: {
            ...meta,
            'Retry-After': String(verdict.reset),
            'Cache-Control': 'no-store',
          },
        },
      )
    }
    const res = await handler(request)
    for (const [k, v] of Object.entries(meta)) res.headers.set(k, v)
    return res
  }
}
