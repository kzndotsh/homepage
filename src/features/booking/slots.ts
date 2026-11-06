import type { Ymd } from './scheduling'

const dayFormat = (timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

const timeFormat = (timeZone: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

/** Open slots grouped by calendar day ("2026-10-15") in the given timezone. */
export function groupByDay(
  slots: number[],
  timeZone: string,
): Map<string, number[]> {
  const fmt = dayFormat(timeZone)
  const days = new Map<string, number[]>()
  for (const ms of slots) {
    const key = fmt.format(ms)
    const list = days.get(key)
    if (list) list.push(ms)
    else days.set(key, [ms])
  }
  return days
}

/** "10:30 AM" in the given timezone. */
export const timeLabel = (ms: number, timeZone: string) =>
  timeFormat(timeZone).format(ms)

/** "2026-10-15" -> { y: 2026, m: 9, d: 15 }. */
export function parseDay(key: string): Ymd {
  const [y, m, d] = key.split('-').map(Number)
  return { y, m: m - 1, d }
}

/** "2026-10-15" for one instant in a timezone. */
export const dayKeyOf = (ms: number, timeZone: string) =>
  dayFormat(timeZone).format(ms)

/** UTC offset of a timezone at an instant, in minutes (New York in summer: -240). */
export function offsetMinutes(timeZone: string, ms: number): number {
  const part = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  })
    .formatToParts(ms)
    .find((p) => p.type === 'timeZoneName')?.value
  // "GMT-04:00", or plain "GMT" for UTC.
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(part ?? '')
  if (!m) return 0
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]))
}

/** "GMT-4", "GMT+5:30". */
export function gmtLabel(timeZone: string, ms: number): string {
  const min = offsetMinutes(timeZone, ms)
  const sign = min < 0 ? '-' : '+'
  const abs = Math.abs(min)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return `GMT${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`
}

/** "EDT" where the zone has a short name, otherwise a GMT offset. */
export const zoneAbbrev = (timeZone: string, ms: number) =>
  new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
    .formatToParts(ms)
    .find((p) => p.type === 'timeZoneName')?.value ?? timeZone

/** How far the host's clock is from the viewer's: "3h behind", "same time". */
export function hostOffsetHint(
  viewer: string,
  host: string,
  ms: number,
): string {
  const diff = offsetMinutes(host, ms) - offsetMinutes(viewer, ms)
  if (diff === 0) return 'same time'
  const abs = Math.abs(diff)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const span = `${h ? `${h}h` : ''}${m ? `${h ? ' ' : ''}${m}m` : ''}`
  return `${span} ${diff < 0 ? 'behind' : 'ahead'}`
}
