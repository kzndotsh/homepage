import Link from 'next/link'

import s from '../home.module.css'
import { PaletteTrigger } from './PaletteTrigger'

const SECTIONS = [
  ['projects', 'Projects'],
  ['music', 'Playlists'],
  ['experience', 'Resume'],
  ['schedule-a-call', 'Schedule a call'],
  ['contact', 'Socials'],
] as const

export function SiteNav() {
  return (
    <header className={s.nav}>
      <div className={s.navIn}>
        <Link href="/" className={s.brand} aria-label="kzn.sh, back to the top">
          kzn.sh
        </Link>
        <nav aria-label="Sections" className={s.navlinks}>
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <PaletteTrigger />
      </div>
    </header>
  )
}
