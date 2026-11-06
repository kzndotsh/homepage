import type { ReactNode } from 'react'

import s from './ui.module.css'

/** Title row of a panel: heading on the left, a link or note on the right. */
export function PanelHeader({
  id,
  title,
  as: Heading = 'h2',
  aside,
}: {
  id: string
  title: ReactNode
  as?: 'h2' | 'h3'
  aside?: ReactNode
}) {
  return (
    <div className={s.secHead}>
      <Heading id={id} className={s.h2}>
        {title}
      </Heading>
      {aside}
    </div>
  )
}

/** Small muted link, optionally led by a brand icon. */
export function PanelLink({
  href,
  icon,
  children,
}: {
  href: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <a className={s.secLink} href={href}>
      {icon}
      {children}
    </a>
  )
}

/** Muted one-line note for the right of a panel title. */
export function PanelNote({ children }: { children: ReactNode }) {
  return <p className={s.secNote}>{children}</p>
}
