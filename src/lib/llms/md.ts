/** Small helpers for writing Markdown without string soup. */

export const h1 = (text: string) => `# ${text}`
export const h2 = (text: string) => `## ${text}`
export const h3 = (text: string) => `### ${text}`
export const quote = (text: string) => `> ${text}`
export const link = (text: string, url: string) => `[${text}](${url})`
export const bullet = (text: string) => `- ${text}`
export const bullets = (items: readonly string[]) =>
  items.map(bullet).join('\n')

/** Join blocks with a blank line between them, skipping empty ones. */
export const doc = (...blocks: (string | false | null | undefined)[]) =>
  `${blocks.filter(Boolean).join('\n\n')}\n`
