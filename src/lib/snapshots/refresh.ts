import 'server-only'

import { SOURCES, type SourceName } from './sources'
import { writeStored } from './store'

/**
 * Fetch one source from its upstream API and keep the result. A failed fetch
 * does not overwrite what is stored, so the last good copy keeps being served.
 */
export async function refreshSnapshot(name: SourceName) {
  const out = await SOURCES[name].compute()
  if (out.data !== null && out.data !== undefined) {
    await writeStored(name, {
      at: Date.now(),
      partial: out.partial,
      data: out.data,
    })
  }
  return { data: out.data ?? null, partial: out.partial ?? false }
}
