import { methodGuards, text } from '@/app/api/_lib/respond'

export function GET(): Response {
  return text(
    `418 I'm a teapot

The requested entity is short and stout, and cannot brew coffee.
(RFC 2324, section 2.3.2: HTCPCP/1.0.)

            ;,'
    _o_    ;:;'
,-.'---\`.__ ;
((j\`=====',-'
 \`-\\     /
    \`-=-'`,
    { status: 418 },
  )
}

export const { POST, PUT, PATCH, DELETE } = methodGuards
