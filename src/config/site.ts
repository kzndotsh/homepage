/** Where the site lives. Used for absolute URLs in llms.txt, sitemaps and robots. */
export const site = {
  name: 'kzn.sh',
  url: 'https://kzn.sh',
} as const

/** "/resume" -> "https://kzn.sh/resume". */
export const absolute = (path: string) => `${site.url}${path}`
