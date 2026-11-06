import Image from 'next/image'
import type { ReactNode } from 'react'

import avatar from '@/images/photos/avatar.png'

import s from '../booking.module.css'

const ICONS = {
  clock: 'M12 6v6l4 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  video:
    'M3 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm12 3 6-3v10l-6-3',
  mail: 'M3 7l9 6 9-6M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  globe:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z',
} as const

export type MetaItem = {
  icon: keyof typeof ICONS
  /** Plain text, or a control such as a select. */
  text: ReactNode
}

/** Who, what and where: host, title, optional controls, a few facts with icons, then a note. */
export function SchedulerIntro({
  host,
  title,
  meta,
  note,
  footer,
  children,
}: {
  host: string
  title: string
  meta: MetaItem[]
  note?: string
  /** Pinned to the bottom of the column, e.g. a timezone picker. */
  footer?: ReactNode
  children?: ReactNode
}) {
  return (
    <>
      <Image
        src={avatar}
        alt=""
        width={40}
        height={40}
        sizes="40px"
        className={s.hostAvatar}
      />
      <p className={s.host}>{host}</p>
      <h3>{title}</h3>
      {children}
      <ul className={s.meta}>
        {meta.map((m) => (
          <li key={m.icon} className={s.metaRow}>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={ICONS[m.icon]} />
            </svg>
            {m.text}
          </li>
        ))}
      </ul>
      {note && <p className={s.introNote}>{note}</p>}
      {footer && <div className={s.introFoot}>{footer}</div>}
    </>
  )
}
