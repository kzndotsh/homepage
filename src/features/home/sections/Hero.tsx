import Image from 'next/image'

import { Panel } from '@/components/ui/Panel'
import { person } from '@/content'
import { SkylineBackdrop } from '@/features/skyline/components/SkylineBackdrop'
import avatar from '@/images/photos/avatar.png'
import { cx } from '@/lib/cx'

import { Clock } from '../components/Clock'

import s from '../home.module.css'
import ui from '@/components/ui/ui.module.css'

export function Hero() {
  return (
    <Panel labelledBy="who" className={cx(s.rise, s.hero)}>
      <SkylineBackdrop />
      <div className={s.heroText}>
        <h1 id="who" className={s.h1}>
          <span>
            Hi, I&rsquo;m Logan
            <Image
              src={avatar}
              alt="Portrait of Logan"
              width={96}
              height={96}
              className={s.avatar}
              priority
            />
          </span>
          <span className={s.tagline}>
            I build things &amp; solve problems.
          </span>
        </h1>
        <div className={s.actions}>
          <a className={ui.btn} href={person.links.github}>
            GitHub
          </a>
          <a className={ui.btn} href={person.links.linkedin}>
            LinkedIn
          </a>
          <a className={ui.btn} href={person.links.resume}>
            Resume
          </a>
        </div>
        <p className={s.heroAlt}>
          or <a href="#schedule-a-call">schedule a call with me</a>
        </p>
      </div>
      <Clock />
    </Panel>
  )
}
