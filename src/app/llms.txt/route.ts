import { llmsTxt } from '@/lib/llms/llmsTxt'
import { markdown } from '@/lib/llms/response'

export const dynamic = 'force-static'

export function GET(): Response {
  return markdown(llmsTxt(), 'text/plain')
}
