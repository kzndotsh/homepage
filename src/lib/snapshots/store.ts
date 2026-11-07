import 'server-only'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/** One stored result: when it was made, and whether more rounds are still due. */
export type Stored<T> = { at: number; partial?: boolean; data: T }

// Just the parts of the Cloudflare bindings used here.
type Bucket = {
  get: (key: string) => Promise<{ json: () => Promise<unknown> } | null>
  put: (
    key: string,
    value: string,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>
}
type Env = {
  NEXT_INC_CACHE_R2_BUCKET?: Bucket
  WORKER_SELF_REFERENCE?: { fetch: (req: Request) => Promise<Response> }
}

/** The Cloudflare bindings, or null when not running on Workers (or in `next dev`). */
export function bindings(): Env | null {
  try {
    return getCloudflareContext().env
  } catch {
    return null
  }
}

const keyFor = (name: string) => `snapshots/${name}.json`

export async function readStored<T>(name: string): Promise<Stored<T> | null> {
  const bucket = bindings()?.NEXT_INC_CACHE_R2_BUCKET
  if (!bucket) return null
  try {
    const obj = await bucket.get(keyFor(name))
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the stored value was written by this module as Stored<T>
    return obj ? ((await obj.json()) as Stored<T>) : null
  } catch (error) {
    console.error(`[snapshots] read ${name} failed:`, error)
    return null
  }
}

export async function writeStored<T>(
  name: string,
  value: Stored<T>,
): Promise<void> {
  const bucket = bindings()?.NEXT_INC_CACHE_R2_BUCKET
  if (!bucket) return
  try {
    await bucket.put(keyFor(name), JSON.stringify(value), {
      httpMetadata: { contentType: 'application/json' },
    })
  } catch (error) {
    console.error(`[snapshots] write ${name} failed:`, error)
  }
}
