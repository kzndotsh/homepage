import { cv, person } from '@/content'
import { absolute, site } from '@/config/site'

import { bullets, doc, h1, h2, link, quote } from './md'
import { homeMarkdown, resumeMarkdown } from './pages'

const entry = (text: string, path: string, note: string) =>
  `- ${link(text, absolute(path))}: ${note}`

/**
 * The index, in the llmstxt.org format: an H1, a blockquote, plain notes, then
 * H2 sections of links. `## Optional` holds what a short context can skip.
 */
export function llmsTxt(): string {
  return doc(
    h1(`${cv.name} (${site.name})`),
    quote(
      `Personal site of ${cv.name} (${cv.alias}), a full-stack builder in ${cv.location}. TypeScript, React, Next.js, Python, Linux, self-hosting, LLM tooling. This is a single-page site plus a resume; everything on it is also available here as Markdown.`,
    ),
    bullets([
      `Append ".md" to a page URL for its Markdown, or send "Accept: text/markdown" to the page itself.`,
      `Facts come from the owner's resume. Live sections of the homepage (code activity, music, books, TV) are not repeated in the Markdown; the sources are linked from it.`,
      `Contact: ${person.email}`,
    ]),
    h2('Pages'),
    [
      entry(
        'Home',
        '/index.md',
        'who I am, what I have built and run, my setup, how to reach me',
      ),
      entry(
        'Resume',
        '/resume.md',
        'full resume: summary, skills, projects, experience, education',
      ),
      entry('Resume (PDF)', cv.pdf, 'the same resume as a PDF'),
    ].join('\n'),
    h2('Data'),
    [
      entry(
        'Resume (JSON)',
        '/api/v1/resume',
        'JSON Resume format: work, education, skills',
      ),
      entry('API index', '/api', 'all read-only endpoints, no key needed'),
    ].join('\n'),
    h2('Elsewhere'),
    [
      `- ${link('GitHub', person.links.github)}: code and open source`,
      `- ${link('LinkedIn', person.links.linkedin)}: professional profile`,
      `- ${link('Dotfiles', 'https://github.com/kzndotsh/dotfiles')}: the NixOS and Sway setup behind the machine`,
      `- ${link('Cal.com', person.links.cal)}: book a 15 or 30 minute call`,
    ].join('\n'),
    h2('Optional'),
    [
      entry(
        'Everything in one file',
        '/llms-full.txt',
        'the home page and resume as one Markdown document',
      ),
      entry('Sitemap', '/sitemap.xml', 'all pages'),
    ].join('\n'),
  )
}

/** Both pages end to end, for agents that want one fetch. */
export function llmsFullTxt(): string {
  return `${homeMarkdown()}\n---\n\n${resumeMarkdown()}`
}
