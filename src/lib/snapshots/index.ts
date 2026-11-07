import 'server-only'
import { refreshSnapshot } from './refresh'
import { SOURCES, type SnapshotData, type SourceName } from './sources'
import { bindings, readStored } from './store'

// A Worker may make about 50 outgoing requests per invocation (the Free plan
// limit), and the homepage would need ~180 if one render fetched everything.
// So the page reads stored snapshots and, for any that are stale, asks the
// Worker to refresh it through its own service binding. That runs as a separate
// invocation with its own budget, and the page waits for the answer.

/** Rounds of refreshing one source may take in a render (the genre map needs a few). */
const MAX_ROUNDS = 4

type Round<N extends SourceName> = {
  data: SnapshotData<N> | null
  partial: boolean
} | null

async function refreshOnce<N extends SourceName>(name: N): Promise<Round<N>> {
  const self = bindings()?.WORKER_SELF_REFERENCE
  const secret = process.env.REFRESH_SECRET
  if (self && secret) {
    try {
      const res = await self.fetch(
        new Request(`https://self.internal/api/internal/refresh/${name}`, {
          method: 'POST',
          headers: { 'x-refresh-secret': secret },
        }),
      )
      if (!res.ok) {
        console.error(`[snapshots] refresh ${name} answered ${res.status}`)
        return null
      }
      return (await res.json()) as Round<N>
    } catch (error) {
      console.error(`[snapshots] refresh ${name} failed:`, error)
      return null
    }
  }
  // On Workers never fetch in the render itself: it would use up its budget.
  if (self && process.env.NODE_ENV === 'production') return null
  // `next dev` and plain Node have no budget to protect.
  return await refreshSnapshot(name)
}

/**
 * The latest data for a source: the stored snapshot while it is fresh,
 * otherwise a refreshed one, falling back to the last stored copy.
 */
export async function snapshot<N extends SourceName>(
  name: N,
): Promise<SnapshotData<N> | null> {
  // The build has no stored data and no budget issue worth caring about; the
  // first live render fills everything in.
  if (process.env.NEXT_PHASE === 'phase-production-build') return null

  const stored = await readStored<SnapshotData<N>>(name)
  const ttl = SOURCES[name].ttl
  if (stored && !stored.partial && Date.now() - stored.at < ttl) {
    return stored.data
  }

  let latest = stored?.data ?? null
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const out = await refreshOnce(name)
    if (!out) break
    if (out.data !== null) latest = out.data
    if (!out.partial) break
  }
  return latest
}

export type { SnapshotData, SourceName }
