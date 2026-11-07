import { timingSafeEqual } from 'node:crypto'

import { refreshSnapshot } from '@/lib/snapshots/refresh'
import { SOURCES, type SourceName } from '@/lib/snapshots/sources'

// Called by the Worker itself (a service binding) to refresh one snapshot in its
// own invocation. It answers 404 to anyone without the shared secret.
export const dynamic = 'force-dynamic'

const same = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

const isSource = (name: string): name is SourceName => name in SOURCES

export async function POST(
  req: Request,
  { params }: { params: Promise<{ source: string }> },
) {
  const secret = process.env.REFRESH_SECRET
  const given = req.headers.get('x-refresh-secret') ?? ''
  const { source } = await params
  if (!secret || !same(given, secret) || !isSource(source)) {
    return new Response('Not found', { status: 404 })
  }
  const out = await refreshSnapshot(source)
  return Response.json(out, { headers: { 'cache-control': 'no-store' } })
}
