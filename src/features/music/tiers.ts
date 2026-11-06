// One blue ramp shared by the genre map tiles and the chart bars, brightest first.
export const TIER_FILLS = [
  'var(--color-tn-blue)',
  'var(--color-tn-blue-dim)',
  'color-mix(in srgb, var(--color-tn-blue-dim) 68%, var(--color-tn-bg-deep))',
  'color-mix(in srgb, var(--color-tn-blue-dim) 46%, var(--color-tn-bg-deep))',
] as const

/** Tier for an item by rank percentile: top 20%, next 40%, next 30%, the rest. */
export function tierForRank(rank: number, count: number): 0 | 1 | 2 | 3 {
  const p = (rank + 1) / count
  return p <= 0.2 ? 0 : p <= 0.6 ? 1 : p <= 0.9 ? 2 : 3
}
