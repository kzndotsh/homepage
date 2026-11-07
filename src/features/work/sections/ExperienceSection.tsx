import { LuDownload, LuFileText } from 'react-icons/lu'

import { Panel } from '@/components/ui/Panel'
import { PanelHeader, PanelLink } from '@/components/ui/PanelHeader'
import { earlierWork, experience, person } from '@/content'
import { rangeLabel } from '@/content/cvDates'
import { cx } from '@/lib/cx'

import { ExperienceLinks } from '../components/ExperienceLinks'
import { Timeline } from '../components/Timeline'
import { EXP_ID } from '../expId'

import s from '../work.module.css'
import ui from '@/components/ui/ui.module.css'

export function ExperienceSection() {
  return (
    <Panel id="experience" labelledBy="exp">
      <PanelHeader
        id="exp"
        title="Experience"
        aside={
          <PanelLink
            href={person.links.resume}
            icon={<LuFileText aria-hidden />}
          >
            via Resume
          </PanelLink>
        }
      />
      <ExperienceLinks>
        <Timeline />
        <ol className={s.xl}>
          {experience.map((r, i) => (
            <li key={r.id} id={EXP_ID + r.id} className={s.xlItem}>
              <p className={cx(s.xlDates, ui.mono)}>
                {rangeLabel(r.start, r.end)}
              </p>
              <details className={s.xlBody} open={i === 0}>
                <summary>
                  <h3 className={s.xlOrg}>{r.org}</h3>
                  <p className={s.xlRole}>
                    {r.title}
                    {r.contract ? ' (contract)' : ''}
                  </p>
                </summary>
                <ul className={s.xlBullets}>
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <ul className={s.xlTags}>
                  {r.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
          <li id={`${EXP_ID}earlier`} className={s.xlItem}>
            <p className={cx(s.xlDates, ui.mono)}>
              {rangeLabel(earlierWork.start, earlierWork.end)}
            </p>
            <details className={s.xlBody}>
              <summary>
                <h3 className={s.xlOrg}>Earlier and other work</h3>
                <p className={s.xlRole}>Founder, consultant and organiser</p>
              </summary>
              <ul className={s.xlBullets}>
                {earlierWork.items.map((i) => (
                  <li key={i.label}>
                    {i.label} ({i.year}): {i.text}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ol>
      </ExperienceLinks>
      <div className={s.xlDl}>
        <div>
          <h3 className={s.xlDlTitle}>Want the full resume?</h3>
          <p className={s.xlDlText}>Everything above, as a PDF you can keep.</p>
        </div>
        <a className={ui.btn} href={person.links.resume} download>
          <LuDownload aria-hidden />
          Download resume
        </a>
      </div>
    </Panel>
  )
}
