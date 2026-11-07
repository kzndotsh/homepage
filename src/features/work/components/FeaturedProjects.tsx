import type { WorkEntry } from '@/content'

import { ArchThumb } from './ArchThumb'

import s from '../work.module.css'

export type Featured = { entry: WorkEntry; blurb: string }

/** A few stand-out projects, large: the diagram, what it is and where the code is. */
export function FeaturedProjects({ items }: { items: Featured[] }) {
  return (
    <ul className={s.fpGrid}>
      {items.map(({ entry: e, blurb }) => (
        <li key={e.id}>
          <a
            className={s.fpCard}
            href={e.href ?? undefined}
            target="_blank"
            rel="noreferrer"
          >
            <div className={s.fpThumb}>
              <ArchThumb spec={e.diagram} />
            </div>
            <div className={s.fpBody}>
              <h3 className={s.fpName}>{e.name}</h3>
              <p className={s.fpBlurb}>{blurb}</p>
              <ul className={s.fpTags}>
                {e.tags.slice(0, 6).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className="sr-only">
                Opens the repository in a new tab.
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
