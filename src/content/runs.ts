import { roles } from './roles'
import type { Run } from './types'

const slug = (v: string) =>
  v
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '')

export const runs: Run[] = roles.map((r) => {
  const running = r.end === 'Present'
  const years = Number(r.end) - Number(r.start)
  return {
    id: `run_${slug(r.org).slice(0, 12)}`,
    org: r.org,
    title: r.title,
    start: r.start,
    end: r.end,
    running,
    duration: running ? 'running' : years <= 0 ? '<1y' : `${years}y`,
    steps: r.blurb
      .replace(/\.$/, '')
      .split(/[:,]\s+/)
      .map((x) => x.trim())
      .filter(Boolean),
  }
})
