import { createHmac } from 'node:crypto'

import alchemy from 'alchemy'
import {
  DurableObjectNamespace,
  Images,
  Nextjs,
  R2Bucket,
  Self,
} from 'alchemy/cloudflare'

const app = await alchemy('kzn-sh')
const isProd = app.stage === 'production'

const SECRET_ENV = [
  'LASTFM_TOKEN',
  'GITHUB_TOKEN',
  'CAL_TOKEN',
  'HARDCOVER_TOKEN',
  'TRAKT_CLIENT_ID',
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
] as const

function secretBindings():
  Record<string, ReturnType<typeof alchemy.secret>> | undefined {
  const entries: (readonly [string, ReturnType<typeof alchemy.secret>])[] =
    SECRET_ENV.flatMap((key) => {
      const value = process.env[key]
      return value ? [[key, alchemy.secret(value)] as const] : []
    })
  // The Worker calls itself to refresh the homepage snapshots (see
  // src/lib/snapshots); this shared secret is how that route knows it is the
  // Worker and not a stranger. Derived from the state password, so there is no
  // extra value to keep.
  const password = process.env.ALCHEMY_PASSWORD
  if (password) {
    entries.push([
      'REFRESH_SECRET',
      alchemy.secret(
        createHmac('sha256', password).update('kzn-sh refresh').digest('hex'),
      ),
    ] as const)
  }
  return entries.length ? Object.fromEntries(entries) : undefined
}

// OpenNext's incremental cache: rendered pages and the fetch data cache live here
// (see open-next.config.ts).
const cache = await R2Bucket('cache', {
  name: isProd ? 'kzn-sh-cache' : `kzn-sh-cache-${app.stage}`,
  adopt: true,
})

export const website = await Nextjs('website', {
  name: isProd ? 'kzn-sh' : `kzn-sh-${app.stage}`,
  adopt: true,
  wrangler: {
    // Alchemy writes the images binding into wrangler.jsonc as `remote: true`, so
    // every local tool that reads it (next dev, and the build step of a deploy)
    // opens a remote session that needs a Cloudflare API token. Resize locally
    // instead; the deployed Worker is not affected.
    transform: (spec) =>
      spec.images
        ? { ...spec, images: { binding: spec.images.binding } }
        : spec,
  },
  bindings: {
    ...secretBindings(),
    // The names below are the ones OpenNext looks for.
    NEXT_INC_CACHE_R2_BUCKET: cache,
    // Lets the Worker call itself, which the cache uses to revalidate a page.
    WORKER_SELF_REFERENCE: Self,
    // Background re-render queue, backed by a Durable Object the adapter exports.
    NEXT_CACHE_DO_QUEUE: DurableObjectNamespace('queue', {
      className: 'DOQueueHandler',
      sqlite: true,
    }),
    // next/image resizes through this; without it /_next/image sends the original.
    IMAGES: Images(),
  },
  domains: isProd ? [{ domainName: 'kzn.sh', adopt: true }] : undefined,
})

console.log({
  url: website.url,
})

await app.finalize()
