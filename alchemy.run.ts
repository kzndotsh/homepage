import alchemy from 'alchemy'
import { Nextjs } from 'alchemy/cloudflare'

const app = await alchemy('kzn-sh')
const isProd = app.stage === 'production'

export const website = await Nextjs('website', {
  name: isProd ? 'kzn-sh' : `kzn-sh-${app.stage}`,
  adopt: true,
  domains: isProd
    ? [{ domainName: 'kzn.sh', adopt: true }]
    : undefined,
})

console.log({
  url: website.url,
})

await app.finalize()
