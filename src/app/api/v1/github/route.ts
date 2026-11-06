import { json, limited, methodGuards } from '@/app/api/_lib/respond'
import { getGithubActivity } from '@/lib/integrations'

async function get(): Promise<Response> {
  return json((await getGithubActivity()) ?? { available: false })
}

export const { POST, PUT, PATCH, DELETE } = methodGuards

export const GET = limited(get)
