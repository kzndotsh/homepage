import { earlierWork, experience } from '@/content'
import { rangeLabel } from '@/content/cvDates'

import { ExpandControls } from '../components/ExpandControls'
import { Toggle } from '../components/Toggle'
import s from '../resume.module.css'

export function ExperienceSection() {
  return (
    <section aria-labelledby="resume-exp" id="experience">
      <div className={s.sectionHead}>
        <h2 id="resume-exp" className={s.h2}>
          Experience
        </h2>
        <ExpandControls scope="#experience" />
      </div>
      {experience.map((r, i) => (
        <Toggle
          key={r.id}
          open={i === 0}
          title={r.org}
          subtitle={
            <>
              {r.title}
              {r.contract && ' (contract)'}
            </>
          }
          meta={rangeLabel(r.start, r.end)}
        >
          <p className={s.where}>{r.location}</p>
          <ul className={s.bullets}>
            {r.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Toggle>
      ))}
      <Toggle
        title="Earlier & other work"
        subtitle="Independent"
        meta={rangeLabel(earlierWork.start, earlierWork.end)}
      >
        <p className={s.where}>{earlierWork.location}</p>
        <ul className={s.bullets}>
          {earlierWork.items.map((i) => (
            <li key={i.label}>
              <b>
                {i.label} ({i.year}):
              </b>{' '}
              {i.text}
            </li>
          ))}
        </ul>
      </Toggle>
    </section>
  )
}
