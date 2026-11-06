import type { ReactNode } from 'react'

import s from '../resume.module.css'

/** One foldable entry: a summary line you can scan, details behind it. */
export function Toggle({
  title,
  subtitle,
  meta,
  open,
  children,
}: {
  title: string
  subtitle?: ReactNode
  meta?: string
  open?: boolean
  children: ReactNode
}) {
  return (
    <details className={s.toggle} open={open}>
      <summary>
        <span className={s.toggleTitle}>{title}</span>
        {subtitle && <span className={s.toggleSub}>{subtitle}</span>}
        {meta && <span className={s.toggleMeta}>{meta}</span>}
      </summary>
      <div className={s.toggleBody}>{children}</div>
    </details>
  )
}
