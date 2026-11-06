import { json, limited, methodGuards } from '@/app/api/_lib/respond'
import { snapshot } from '@/lib/snapshots'

async function get(): Promise<Response> {
  return json((await snapshot('github')) ?? { available: false })
}

export const { POST, PUT, PATCH, DELETE } = methodGuards

export const GET = limited(get)
