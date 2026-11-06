import { education } from '@/content'

import s from '../resume.module.css'

export function EducationSection() {
  return (
    <section aria-labelledby="resume-edu">
      <h2 id="resume-edu" className={s.h2}>
        Education &amp; certifications
      </h2>
      <p className={s.text}>
        <b>{education.school}:</b> {education.program} ({education.years})
      </p>
      <ul className={s.bullets}>
        {education.certifications.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  )
}
