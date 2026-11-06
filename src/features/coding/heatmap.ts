export type Day = { date: string; count: number }

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

/** Weeks as columns (Sunday first), month labels, and the activity cut-offs. */
export function buildHeatmap(calendar: Day[]) {
  const pad = new Date(`${calendar[0].date}T00:00:00Z`).getUTCDay()
  const flat: (Day | null)[] = [
    ...Array.from({ length: pad }, () => null),
    ...calendar,
  ]
  const weeks: (typeof flat)[] = []
  for (let i = 0; i < flat.length; i += 7) weeks.push(flat.slice(i, i + 7))

  const months: { x: number; label: string }[] = []
  let last = -1
  weeks.forEach((col, i) => {
    const first = col.find(Boolean)
    if (!first) return
    const m = Number(first.date.slice(5, 7)) - 1
    if (m !== last) {
      const prev = months[months.length - 1]
      if (!prev || i - prev.x >= 3) months.push({ x: i, label: MONTHS[m] })
      last = m
    }
  })

  // Quartiles of active days (as GitHub does), so one spike cannot flatten the rest.
  const active = calendar
    .map((c) => c.count)
    .filter((n) => n > 0)
    .sort((a, b) => a - b)
  const q = (p: number) =>
    active[Math.min(active.length - 1, Math.floor(active.length * p))] ?? 1

  return { weeks, months, cuts: [q(0.25), q(0.5), q(0.75)] as const }
}

/** 0 (none) to 4 (busiest), given the cut-offs from buildHeatmap. */
export const heatLevel = (
  n: number,
  cuts: readonly [number, number, number],
) => (n === 0 ? 0 : n <= cuts[0] ? 1 : n <= cuts[1] ? 2 : n <= cuts[2] ? 3 : 4)
