import { homeMarkdown } from '@/lib/llms/pages'
import { markdown } from '@/lib/llms/response'

export const dynamic = 'force-static'

export function GET(): Response {
  return markdown(homeMarkdown())
}
