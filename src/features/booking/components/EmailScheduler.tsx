'use client'

import { useState } from 'react'

import { person } from '@/content'
import { useMounted } from '@/hooks/useMounted'

import {
  SLOTS,
  dateKey,
  longDate,
  monthAt,
  nyToday,
  proposalHref,
  proposalSubject,
  type Ymd,
} from '../scheduling'
import { MonthGrid, MonthNav } from './MonthGrid'
import { PickColumns, SchedulerFrame } from './SchedulerFrame'
import { SchedulerIntro } from './SchedulerIntro'

import s from '../booking.module.css'
import ui from '@/components/ui/ui.module.css'

/** Fallback when live availability is unavailable: propose a time by email. */
export function EmailScheduler() {
  const mounted = useMounted()
  const today = mounted ? nyToday() : null
  const [offset, setOffset] = useState(0)
  const [day, setDay] = useState<Ymd | null>(null)
  const [slot, setSlot] = useState<string | null>(null)

  const view = today ? monthAt(today, offset) : null
  const ready = day && slot
  const subject = ready ? proposalSubject(day, slot) : ''
  const href = ready ? proposalHref(day, slot) : undefined

  return (
    <SchedulerFrame
      intro={
        <SchedulerIntro
          host={person.name}
          title="Let's talk!"
          meta={[
            { icon: 'clock', text: '30 min' },
            { icon: 'mail', text: 'Reply by email' },
            { icon: 'globe', text: 'America/New York' },
          ]}
          note="Not a live calendar. Pick a day and time and your email app opens with it filled in. I reply to confirm or suggest another."
        />
      }
      footer={
        <>
          <p aria-live="polite">
            {subject || 'Choose a day and a time to propose.'}
          </p>
          {href ? (
            <a href={href} className={`${ui.btn} ${ui.btnPrimary}`}>
              Email to propose a time
            </a>
          ) : (
            <span
              aria-disabled="true"
              className={ui.btn}
              style={{ color: 'var(--color-fg-faint)', cursor: 'not-allowed' }}
            >
              Email to propose a time
            </span>
          )}
        </>
      }
    >
      <PickColumns
        calendar={
          <>
            <MonthNav
              view={view}
              canPrev={offset > 0}
              canNext
              onPrev={() => setOffset((o) => Math.max(0, o - 1))}
              onNext={() => setOffset((o) => o + 1)}
            />
            <MonthGrid
              view={view}
              today={today}
              selected={day}
              isDisabled={(d) => {
                const dow = new Date(Date.UTC(d.y, d.m, d.d)).getUTCDay()
                return (
                  !today ||
                  dateKey(d) <= dateKey(today) ||
                  dow === 0 ||
                  dow === 6
                )
              }}
              onPick={(d) => {
                setDay(d)
                setSlot(null)
              }}
            />
          </>
        }
        slotHead={day ? longDate(day).replace(/^\w+, /, '') : 'Pick a day'}
        slots={SLOTS.map((t) => (
          <button
            key={t}
            type="button"
            disabled={!day}
            aria-pressed={slot === t}
            className={s.slot}
            onClick={() => setSlot(t)}
          >
            {t}
          </button>
        ))}
      />
    </SchedulerFrame>
  )
}
