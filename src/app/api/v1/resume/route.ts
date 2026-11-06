import { json, limited, methodGuards } from '@/app/api/_lib/respond'
import { jsonResume } from '@/lib/jsonResume'
import { isResumeSection, RESUME_SECTIONS } from '@/lib/resumeSections'

function get(request: Request): Response {
  const section = new URL(request.url).searchParams.get('section')
  const resume = jsonResume()
  if (section === null || section === '') return json(resume)
  if (!isResumeSection(section)) {
    return json(
      {
        error: 'unknown_section',
        message: `section must be one of: ${RESUME_SECTIONS.join(', ')}`,
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }
  return json({ [section]: resume[section] })
}

export const { POST, PUT, PATCH, DELETE } = methodGuards

export const GET = limited(get)
