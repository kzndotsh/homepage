import { BrandLink } from './BrandLink'
import { PaletteTrigger } from './PaletteTrigger'

import s from '../home.module.css'

/** [id, label, shorter label for a phone]. */
const SECTIONS = [
  ['projects', 'Projects'],
  ['music', 'Playlists'],
  ['experience', 'Resume'],
  ['schedule-a-call', 'Schedule a call', 'Call'],
  ['contact', 'Socials'],
] as const

export function SiteNav() {
  return (
    <header className={s.nav}>
      <div className={s.navIn}>
        <BrandLink className={s.brand}>kzn.sh</BrandLink>
        <nav aria-label="Sections" className={s.navlinks}>
          {SECTIONS.map((section) => {
            const [id, label] = section
            const short = section.length === 3 ? section[2] : null
            return (
              <a key={id} href={`#${id}`}>
                {short ? (
                  <>
                    <span className={s.navFull}>{label}</span>
                    <span className={s.navShort}>{short}</span>
                  </>
                ) : (
                  label
                )}
              </a>
            )
          })}
        </nav>
        <PaletteTrigger />
      </div>
    </header>
  )
}
