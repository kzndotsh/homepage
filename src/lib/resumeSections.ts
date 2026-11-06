/** Top-level JSON Resume sections that `?section=` can select. */
export const RESUME_SECTIONS = [
  'basics',
  'work',
  'education',
  'certificates',
  'skills',
] as const

export type ResumeSection = (typeof RESUME_SECTIONS)[number]

export const isResumeSection = (v: string): v is ResumeSection =>
  (RESUME_SECTIONS as readonly string[]).includes(v)
