import type { CSSProperties, ReactNode } from 'react'

import { cx } from '@/lib/cx'

import s from './ui.module.css'

const SPAN = {
  4: s.c4,
  5: s.c5,
  6: s.c6,
  7: s.c7,
  8: s.c8,
  12: s.c12,
} as const

export type PanelSpan = keyof typeof SPAN

/** A card in the 12-column home grid. */
export function Panel({
  id,
  labelledBy,
  span = 12,
  className,
  style,
  children,
}: {
  id?: string
  labelledBy: string
  span?: PanelSpan
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cx(s.card, SPAN[span], className)}
      style={style}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  )
}
