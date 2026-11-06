import { earlierWork, experience } from '@/content'
import { monthIndex, monthLabel, rangeLabel } from '@/content/cvDates'

import s from '../work.module.css'

const FIRST_YEAR = 2013

/** Every role as a bar on one shared time axis, so overlaps and the long arc show at a glance. */
export function Timeline() {
  const now = new Date().toISOString().slice(0, 7)
  const rows = [
    ...experience.map((r) => ({
      id: r.id,
      label: r.org,
      start: r.start,
      end: r.end ?? now,
      live: r.end === null,
      faint: false,
      title: `${r.title}: ${rangeLabel(r.start, r.end)}`,
    })),
    {
      id: 'earlier',
      label: 'Earlier & other work',
      start: earlierWork.start,
      end: earlierWork.end,
      live: false,
      faint: true,
      title: `Earlier & other work: ${monthLabel(earlierWork.start)} - ${monthLabel(earlierWork.end)}`,
    },
  ]

  const from = monthIndex(`${FIRST_YEAR}-01`)
  const to = monthIndex(now) + 3
  const span = to - from
  const lastYear = Number(now.slice(0, 4))
  const years = Array.from(
    { length: lastYear - FIRST_YEAR + 1 },
    (_, i) => FIRST_YEAR + i,
  )
  const x = (ym: string) => ((monthIndex(ym) - from) / span) * 100

  const bar = (r: (typeof rows)[number]) => (
    <>
      <span className={s.ganttLabel}>{r.label}</span>
      <span className={s.ganttTrack}>
        <i
          title={r.title}
          data-live={r.live}
          data-faint={r.faint}
          style={{
            left: `${x(r.start)}%`,
            width: `${Math.max(x(r.end) - x(r.start), 1.2)}%`,
          }}
        />
      </span>
    </>
  )

  return (
    <div
      className={s.gantt}
      style={{ '--yr': `${(12 / span) * 100}%` } as React.CSSProperties}
    >
      <div className={s.ganttAxis} aria-hidden="true">
        {years.map((y) => (
          <span key={y} style={{ left: `${x(`${y}-01`)}%` }}>
            {y % 2 === 1 ? `'${String(y).slice(2)}` : ''}
          </span>
        ))}
      </div>
      <ul className={s.ganttList}>
        {rows.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              className={s.ganttRow}
              data-open={r.id}
              aria-label={`Show ${r.label}: ${r.title}`}
            >
              {bar(r)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
