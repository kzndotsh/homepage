import { absolute } from '@/config/site'
import {
  cv,
  cvProjects,
  earlierWork,
  education,
  experience,
  person,
  skills,
  workEntries,
} from '@/content'
import { rangeLabel } from '@/content/cvDates'
import { DOTFILES_URL, FETCH_INFO } from '@/features/setup/data'

import { bullet, bullets, doc, h1, h2, h3, link, quote } from './md'

const CAL_URL = person.links.cal
const HARDCOVER_URL = person.links.hardcover
const TRAKT_URL = person.links.trakt

const period = (start: string, end: string | null) => rangeLabel(start, end)

/** The homepage as Markdown: what is on the page, minus live numbers. */
export function homeMarkdown(): string {
  const current = experience.find((r) => r.end === null)

  const work = workEntries.map((e) => {
    const heading =
      e.kind === 'role'
        ? `${e.name}: ${e.title}${e.contract ? ' (contract)' : ''}, ${e.period}`
        : e.name
    return doc(
      h3(heading),
      e.summary,
      `Stack: ${e.tags.join(', ')}.`,
      e.href && `Source: ${link(e.href.replace('https://', ''), e.href)}`,
    ).trimEnd()
  })

  return doc(
    h1(cv.name),
    quote(
      `${cv.name} (${cv.alias}) is a full-stack builder in ${cv.location}: ${person.tagline}.`,
    ),
    cv.summary,
    h2('Now'),
    current &&
      bullet(
        `${current.title} at ${current.org} since ${period(current.start, null).split(' - ')[0]}. ${workEntries.find((e) => e.id === current.id)?.summary ?? ''}`,
      ),
    h2('Work'),
    'Roles first, newest to oldest, then projects. Each has a small architecture diagram on the site; the text here carries the same facts.',
    ...work,
    h2('Setup'),
    `The machine behind it all, from ${link('the dotfiles', DOTFILES_URL)} (NixOS, Sway, Tokyo Night).`,
    bullets(FETCH_INFO.map(([k, v]) => `${k}: ${v}`)),
    h2('Live sections'),
    'The page also shows live data that is not repeated here. These are the sources:',
    bullets([
      `Code activity: ${link('GitHub', person.links.github)}`,
      `Listening: ${link('Last.fm', person.links.lastfm)} and ${link('Spotify playlists', person.links.spotify)}`,
      `Reading: ${link('Hardcover', HARDCOVER_URL)}`,
      `Watching: ${link('Trakt', TRAKT_URL)}`,
    ]),
    h2('Schedule a call with me'),
    `Open times are shown live on the page. You can also book 15 or 30 minutes directly on ${link('Cal.com', CAL_URL)}.`,
    h2('Contact'),
    bullets([
      `Email: ${link(person.email, person.links.email)}`,
      `GitHub: ${link('github.com/kzndotsh', person.links.github)}`,
      `LinkedIn: ${link('linkedin.com/in/kzndotsh', person.links.linkedin)}`,
      `Resume: ${link('as a page', absolute('/resume.md'))} or ${link('PDF', absolute(person.links.resume))}`,
    ]),
    h2('For machines'),
    bullets([
      `${link('llms.txt', absolute('/llms.txt'))}: index of this site for language models`,
      `${link('Resume API', absolute('/api/v1/resume'))}: JSON Resume format, read-only, no key needed`,
      link('API index', absolute('/api')),
    ]),
  )
}

/** The resume as Markdown, same content as the /resume page. */
export function resumeMarkdown(): string {
  return doc(
    h1(`${cv.name}: Resume`),
    quote(`${cv.headline}. ${cv.location}.`),
    bullets([
      ...cv.contact.map((c) => `${c.label}: ${link(c.text, c.href)}`),
      `PDF: ${link(cv.pdf.split('/').pop() ?? 'PDF', absolute(cv.pdf))}`,
    ]),
    h2('Professional Summary'),
    cv.summary,
    h2('Technical Skills'),
    bullets(skills.map((g) => `**${g.label}:** ${g.items.join(', ')}`)),
    h2('Projects'),
    bullets(
      cvProjects.map(
        (p) =>
          `**${link(p.name, p.href)}:** ${p.blurb} (${p.stack.join(', ')})`,
      ),
    ),
    h2('Professional Experience'),
    ...experience.map((r) =>
      doc(
        h3(`${r.title}${r.contract ? ' (contract)' : ''}, ${r.org}`),
        `${period(r.start, r.end)} · ${r.location}`,
        bullets(r.bullets),
      ).trimEnd(),
    ),
    doc(
      h3('Earlier & Other Work, Independent'),
      `${period(earlierWork.start, earlierWork.end)} · ${earlierWork.location}`,
      bullets(
        earlierWork.items.map((i) => `**${i.label} (${i.year}):** ${i.text}`),
      ),
    ).trimEnd(),
    h2('Education & Certifications'),
    bullets([
      `**${education.school}:** ${education.program} (${education.years})`,
      `**Certifications:** ${education.certifications.join('; ')}`,
    ]),
  )
}
