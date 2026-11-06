export type Role = {
  title: string
  org: string
  start: string
  end: string
  blurb: string
}

/** A role reshaped as a run: a job rendered like a pipeline run. */
export type Run = {
  id: string
  org: string
  title: string
  start: string
  end: string
  running: boolean
  duration: string
  steps: string[]
}

export type Stack = {
  id: string
  tab: string
  title: string
  where: string
  tiers: { label: string; nodes: string[]; hot?: boolean }[]
  bullets: string[]
}
