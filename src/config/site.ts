/** Where the site lives. Used for absolute URLs in llms.txt, sitemaps and robots. */
export const site = {
  name: 'kzn.sh',
  url: 'https://kzn.sh',
  /** Meta description and the social cards' text. */
  description: 'I build things & solve problems.',
  /** Browser UI colour (--color-tn-bg in tokens.css). */
  themeColor: '#1a1b26',
  locale: 'en_US',
  /** The handle Twitter cards credit. */
  twitter: '@kzndotsh',
  /** The site's own source, linked from the footer. */
  repo: 'https://github.com/kzndotsh/homepage',
} as const

/** "/resume" -> "https://kzn.sh/resume". */
export const absolute = (path: string) => `${site.url}${path}`
