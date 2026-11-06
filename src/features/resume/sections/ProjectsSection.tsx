import { cvProjects } from '@/content'

import { Toggle } from '../components/Toggle'
import s from '../resume.module.css'

export function ProjectsSection() {
  return (
    <section aria-labelledby="resume-projects" id="projects">
      <h2 id="resume-projects" className={s.h2}>
        Projects
      </h2>
      {cvProjects.map((p) => (
        <Toggle key={p.name} title={p.name} subtitle={p.stack.join(', ')}>
          <p className={s.text}>{p.blurb}</p>
          <a className={s.link} href={p.href}>
            {p.href.replace('https://', '')}
          </a>
        </Toggle>
      ))}
    </section>
  )
}
