import {
  WEEKDAYS,
  dateKey,
  longDate,
  monthCells,
  monthLabel,
  type Month,
  type Ymd,
} from '../scheduling'

import s from '../booking.module.css'
import ui from '@/components/ui/ui.module.css'

const Chev = ({ d }: { d: string }) => (
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
    <path d={d} />
  </svg>
)

/** Month label with previous and next buttons. */
export function MonthNav({
  view,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  view: Month | null
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className={s.monthRow}>
      <span aria-live="polite">{view ? monthLabel(view) : '\u00A0'}</span>
      <span style={{ display: 'flex', gap: 6 }}>
        <button
          type="button"
          className={s.iconBtn}
          disabled={!canPrev}
          onClick={onPrev}
          aria-label="Previous month"
        >
          <Chev d="M15 6l-6 6 6 6" />
        </button>
        <button
          type="button"
          className={s.iconBtn}
          disabled={!canNext}
          onClick={onNext}
          aria-label="Next month"
        >
          <Chev d="M9 6l6 6-6 6" />
        </button>
      </span>
    </div>
  )
}

/** A month of day buttons. Renders a skeleton until `view` is known. */
export function MonthGrid({
  view,
  today,
  selected,
  isDisabled,
  onPick,
}: {
  view: Month | null
  today: Ymd | null
  selected: Ymd | null
  isDisabled: (day: Ymd) => boolean
  onPick: (day: Ymd) => void
}) {
  const cells = view ? monthCells(view) : []

  return (
    <div className={`${s.cal} ${ui.mono}`}>
      {WEEKDAYS.map((d) => (
        <span key={d} className={s.dow}>
          {d}
        </span>
      ))}
      {cells.map((n, i) => {
        if (n === null || !view) return <span key={`b${i}`} />
        const day = { y: view.y, m: view.m, d: n }
        const isToday = !!today && dateKey(day) === dateKey(today)
        return (
          <button
            key={n}
            type="button"
            disabled={isDisabled(day)}
            aria-pressed={!!selected && dateKey(selected) === dateKey(day)}
            aria-label={longDate(day)}
            className={`${s.day} ${isToday ? s.today : ''}`}
            onClick={() => onPick(day)}
          >
            {n}
          </button>
        )
      })}
      {!view &&
        Array.from({ length: 35 }, (_, i) => (
          <span key={i} className={s.skel} />
        ))}
    </div>
  )
}
