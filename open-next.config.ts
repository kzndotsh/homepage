import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache'
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue'

/**
 * Without an incremental cache the Worker renders every request from scratch and
 * ignores `revalidate`, so each visit would re-fetch every integration. The
 * bindings below (NEXT_INC_CACHE_R2_BUCKET, NEXT_CACHE_DO_QUEUE,
 * WORKER_SELF_REFERENCE) are declared in alchemy.run.ts.
 *
 * - R2 holds the rendered pages and the fetch data cache.
 * - The regional cache keeps recent entries in each data centre's Cache API, so
 *   a hit does not wait on R2.
 * - A Durable Object queue runs the background re-render when `revalidate` is up.
 * - There is no tag cache: nothing here calls revalidateTag or revalidatePath.
 */
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: 'long-lived',
  }),
  queue: doQueue,
})
