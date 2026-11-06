import { markdown } from '@/lib/llms/response'
import { resumeMarkdown } from '@/lib/llms/pages'

export const dynamic = 'force-static'

export function GET(): Response {
  return markdown(resumeMarkdown())
}
