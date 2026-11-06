'use client'

import { useNow } from '@/hooks/useNow'

const OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: 'America/New_York',
  weekday: 'short',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}
const fmt = new Intl.DateTimeFormat('en-US', OPTIONS)

// Same shape as waybar's clock format "{:%a %b %d  %I:%M %p}".
const format = (ms: number) => {
  const p = Object.fromEntries(
    fmt.formatToParts(ms).map((x) => [x.type, x.value]),
  )
  return `${p.weekday} ${p.month} ${p.day}  ${p.hour}:${p.minute} ${p.dayPeriod}`
}

// Runs as the page streams in, right after the <time>, so the real time is on
// screen before first paint (the same trick as the home page clock). Keep the
// string in step with `format`.
const SET_NOW = `(function(){var t=document.currentScript.previousElementSibling,p={};new Intl.DateTimeFormat('en-US',${JSON.stringify(OPTIONS)}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});t.textContent=p.weekday+' '+p.month+' '+p.day+'  '+p.hour+':'+p.minute+' '+p.dayPeriod})()`

// Server render: a best guess for visitors without scripts. The page may be cached.
const guess = () => format(Date.now())

export function WaybarClock() {
  const now = useNow(1000)

  return (
    <>
      <time style={{ whiteSpace: 'pre' }} suppressHydrationWarning>
        {now === null ? guess() : format(now)}
      </time>
      <script dangerouslySetInnerHTML={{ __html: SET_NOW }} />
    </>
  )
}
