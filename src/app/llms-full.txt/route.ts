import { llmsFullTxt } from '@/lib/llms/llmsTxt'
import { markdown } from '@/lib/llms/response'

export const dynamic = 'force-static'

export function GET(): Response {
  return markdown(llmsFullTxt(), 'text/plain')
}
