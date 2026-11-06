import type { Metadata } from 'next'

import { ResumePage } from '@/features/resume/ResumePage'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Logan Honeycutt: full-stack builder. Experience, projects, skills and a PDF download.',
  alternates: { types: { 'text/markdown': '/resume.md' } },
}

export default function Page() {
  return <ResumePage />
}
