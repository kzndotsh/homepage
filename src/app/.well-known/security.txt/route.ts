import { methodGuards, text } from '@/app/api/_lib/respond'

export function GET(): Response {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  return text(
    `Contact: mailto:admin@kzn.sh
Expires: ${expires}T00:00:00.000Z
Preferred-Languages: en
Canonical: https://kzn.sh/.well-known/security.txt
`,
  )
}

export const { POST, PUT, PATCH, DELETE } = methodGuards
