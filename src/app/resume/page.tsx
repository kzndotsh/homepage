import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { person } from '@/content'
import { ResumePage } from '@/features/resume/ResumePage'
import { resumeJsonLd } from '@/lib/structured-data'

const description =
  'Logan Honeycutt: full-stack builder. Experience, projects, skills and a PDF download.'

export const metadata: Metadata = {
  title: 'Resume',
  description,
  alternates: {
    canonical: '/resume',
    types: { 'text/markdown': '/resume.md' },
  },
  openGraph: {
    type: 'profile',
    url: '/resume',
    title: `Resume - ${person.name}`,
    description,
  },
}

export default function Page() {
  return (
    <>
      <JsonLd data={resumeJsonLd} />
      <ResumePage />
    </>
  )
}
