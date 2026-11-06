import { json, limited, methodGuards } from '@/app/api/_lib/respond'

function get(): Response {
  return json(
    { error: 'not_found', message: 'Nothing here. Look closer.' },
    { status: 404 },
  )
}

export const { POST, PUT, PATCH, DELETE } = methodGuards

export const GET = limited(get)
