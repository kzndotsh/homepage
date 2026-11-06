import { cv, experience } from '@/content'
import { cx } from '@/lib/cx'

import { DownloadButton } from '../components/DownloadButton'
import s from '../resume.module.css'

const STACK = [
  'TypeScript',
  'React',
  'Next.js',
  'Python',
  'PostgreSQL',
  'Docker',
  'Linux',
]

/** Title, a properties table, and the summary in a callout. */
export function Intro() {
  const current = experience.find((r) => r.end === null)

  return (
    <section aria-labelledby="resume-title">
      <div className={s.titleRow}>
        <h1 id="resume-title" className={s.title}>
          {cv.name}
        </h1>
        <DownloadButton />
      </div>
      <dl className={s.props}>
        <div>
          <dt>Role</dt>
          <dd>{cv.headline}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{cv.location}</dd>
        </div>
        {current && (
          <div>
            <dt>Now</dt>
            <dd>
              {current.title}, {current.org}
            </dd>
          </div>
        )}
        <div>
          <dt>Contact</dt>
          <dd>
            {cv.contact.map((c, i) => (
              <span key={c.label}>
                {i > 0 && ' · '}
                <a href={c.href}>{c.label}</a>
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>
            <ul className={s.chips}>
              {STACK.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <p className={cx(s.callout)}>{cv.summary}</p>
    </section>
  )
}
