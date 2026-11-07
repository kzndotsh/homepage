import { person } from '@/content'

export const SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '2:30 PM',
  '4:00 PM',
] as const

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export type Ymd = { y: number; m: number; d: number }
export type Month = { y: number; m: number }

/** Today's date in an IANA timezone. */
export function todayIn(timeZone: string): Ymd {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return { y: get('year'), m: get('month') - 1, d: get('day') }
}

/** Today's date in Charlotte, whatever the visitor's timezone. */
export const nyToday = () => todayIn('America/New_York')

/** Sortable number for a date. */
export const dateKey = (v: Ymd) => v.y * 10_000 + v.m * 100 + v.d

export const longDate = (v: Ymd) =>
  new Date(Date.UTC(v.y, v.m, v.d, 12)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

/** The month `offset` months after the one containing `today`. */
export function monthAt(today: Ymd, offset: number): Month {
  const t = today.y * 12 + today.m + offset
  return { y: Math.floor(t / 12), m: t % 12 }
}

export const monthLabel = (v: Month) =>
  new Date(Date.UTC(v.y, v.m, 1)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  })

/** Calendar cells for a month: leading blanks, then day numbers. */
export function monthCells(v: Month): (number | null)[] {
  const first = new Date(Date.UTC(v.y, v.m, 1)).getUTCDay()
  const count = new Date(Date.UTC(v.y, v.m + 1, 0)).getUTCDate()
  return [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: count }, (_, i) => i + 1),
  ]
}

export const proposalSubject = (day: Ymd, slot: string) =>
  `Call request: ${longDate(day)}, ${slot} ET`

/** A mailto link that proposes the chosen day and time. */
export function proposalHref(day: Ymd, slot: string): string {
  const subject = proposalSubject(day, slot)
  const body =
    'Hi Logan,\n\nI would like to propose this time (America/New_York). Here is what it is about:\n\n'
  return `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const pad = (n: number) => String(n).padStart(2, '0')

/** "2026-10-15" for a date. */
export const isoDate = (v: Ymd) => `${v.y}-${pad(v.m + 1)}-${pad(v.d)}`
