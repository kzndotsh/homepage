import { skills } from '@/content'

import s from '../resume.module.css'

export function SkillsSection() {
  return (
    <section aria-labelledby="resume-skills">
      <h2 id="resume-skills" className={s.h2}>
        Technical skills
      </h2>
      <div className={s.skills}>
        {skills.map((g) => (
          <div key={g.label}>
            <h3 className={s.h3}>{g.label}</h3>
            <ul className={s.chips}>
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
