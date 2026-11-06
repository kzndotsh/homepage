const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** "2026-02" -> "Feb 2026". */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

/** "Feb 2026 - Present". */
export function rangeLabel(start: string, end: string | null): string {
  return `${monthLabel(start)} - ${end ? monthLabel(end) : 'Present'}`
}

/** Months since year 0, so ranges can be compared and drawn. */
export const monthIndex = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

/** "1y 3m", "8 mo". `now` is the "YYYY-MM" to count open roles up to. */
export function durationLabel(
  start: string,
  end: string | null,
  now: string,
): string {
  const months = monthIndex(end ?? now) - monthIndex(start) + 1
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} mo`
  return m ? `${y}y ${m}m` : `${y}y`
}
