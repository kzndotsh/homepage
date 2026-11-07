import Link from 'next/link'

import { fontVariables } from '@/config/fonts'
import { cx } from '@/lib/cx'

import { DownloadButton } from './components/DownloadButton'
import { EducationSection } from './sections/EducationSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { Intro } from './sections/Intro'
import { ProjectsSection } from './sections/ProjectsSection'
import { SkillsSection } from './sections/SkillsSection'

import s from './resume.module.css'

/** The resume as a page: scan it, fold open what you care about, or download the PDF. */
export function ResumePage() {
  return (
    <div className={cx(s.root, fontVariables)}>
      <header className={s.bar}>
        <div className={s.barIn}>
          <Link href="/" className={s.home}>
            kzn.sh
          </Link>
        </div>
      </header>
      <main className={s.page}>
        <Intro />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <footer className={s.foot}>
          <DownloadButton />
          <Link href="/" className={s.back}>
            Back to kzn.sh
          </Link>
        </footer>
      </main>
    </div>
  )
}
