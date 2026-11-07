'use client'

import { useNow } from '@/hooks/useNow'

import s from '../home.module.css'

const OPTS: Intl.DateTimeFormatOptions = {
  timeZone: 'America/New_York',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}
const fmt = new Intl.DateTimeFormat('en-US', OPTS)

function face(d: Date) {
  const p: Record<string, string> = {}
  for (const x of fmt.formatToParts(d)) p[x.type] = x.value
  return {
    digits: `${p.hour}:${p.minute}`,
    period: p.dayPeriod,
    date: `${p.weekday}, ${p.month} ${p.day}`,
  }
}

// Runs as the page streams in, right after the elements, so the real time is on
// screen before first paint. Hydration keeps it, then useNow takes over.
const SET_NOW = `(function(){var r=document.currentScript.parentElement,p={};new Intl.DateTimeFormat('en-US',${JSON.stringify(OPTS)}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});var v={digits:p.hour+':'+p.minute,period:p.dayPeriod,date:p.weekday+', '+p.month+' '+p.day};Object.keys(v).forEach(function(k){var e=r.querySelector('[data-clock='+k+']');if(e)e.textContent=v[k]})})()`

/** "It's 11:44 pm in Charlotte." as a small card, with the date underneath. */
export function Clock() {
  const now = useNow(15_000)
  // The page may be cached, so the server render is only a guess for visitors without scripts.
  // oxlint-disable-next-line react/purity
  const f = face(now === null ? new Date() : new Date(now))

  return (
    <div className={s.callout}>
      <div className={s.leader} aria-hidden>
        <i className={s.tail} />
      </div>
      <div className={s.heroClock}>
        <p>
          It&rsquo;s{' '}
          <time aria-label="Local time in Charlotte">
            <span data-clock="digits" suppressHydrationWarning>
              {f.digits}
            </span>{' '}
            <span
              className={s.clockPeriod}
              data-clock="period"
              suppressHydrationWarning
            >
              {f.period}
            </span>
          </time>{' '}
          in Charlotte.
        </p>
        <div className={s.clockMeta}>
          <small data-clock="date" suppressHydrationWarning>
            {f.date}
          </small>
          <small className={s.coords}>
            <i className={s.blink} aria-hidden />
            <span className={s.coordsText}>35.23°N 80.84°W</span>
          </small>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SET_NOW }} />
    </div>
  )
}
