import alchemy from 'alchemy'
import { Nextjs } from 'alchemy/cloudflare'

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
  const entries = SECRET_ENV.flatMap((key) => {
    const value = process.env[key]
    return value ? [[key, alchemy.secret(value)] as const] : []
  })
  return entries.length ? Object.fromEntries(entries) : undefined
}

export const website = await Nextjs('website', {
  name: isProd ? 'kzn-sh' : `kzn-sh-${app.stage}`,
  adopt: true,
  bindings: secretBindings(),
  domains: isProd ? [{ domainName: 'kzn.sh', adopt: true }] : undefined,
})

console.log({
  url: website.url,
})

await app.finalize()
