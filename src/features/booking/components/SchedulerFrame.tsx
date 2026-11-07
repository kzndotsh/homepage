import type { ReactNode } from 'react'

import s from '../booking.module.css'
import ui from '@/components/ui/ui.module.css'

/** The intro column on the left, whatever is being asked on the right, and a footer line. */
export function SchedulerFrame({
  intro,
  children,
  footer,
}: {
  intro: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div>
      <div className={s.sched}>
        <div className={s.schedSide}>{intro}</div>
        {children}
      </div>
      {footer && (
        <div className={s.schedFoot} style={{ marginTop: 16 }}>
          {footer}
        </div>
      )}
    </div>
  )
}

/** Step one: a calendar, and the times for the chosen day beside it. */
export function PickColumns({
  calendar,
  slotHead,
  slotSub,
  slots,
}: {
  calendar: ReactNode
  slotHead: string
  /** Optional small line under the date, e.g. how far the host's clock is. */
  slotSub?: ReactNode
  slots: ReactNode
}) {
  return (
    <>
      <div className={s.schedMid}>{calendar}</div>
      <div className={s.schedSlots}>
        <p className={s.slotHead}>{slotHead}</p>
        {/* Always rendered, so the times never jump when it appears. */}
        <p className={`${s.slotSub} ${ui.mono}`}>{slotSub || null}</p>
        <div
          className={`${s.slots} ${s.times}`}
          role="group"
          aria-label="Time slots"
        >
          {slots}
        </div>
      </div>
    </>
  )
}

/** Step two: one wide panel in place of the calendar and times. */
export function DetailsColumn({ children }: { children: ReactNode }) {
  return <div className={s.details}>{children}</div>
}
