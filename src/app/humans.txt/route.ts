import { methodGuards, text } from '@/app/api/_lib/respond'

export function GET(): Response {
  return text(`/* THANK YOU */

Thank you for poking around. You found the quiet corner.

To everyone who ships FOSS, and the people who file good bug reports:
this site stands on your work.

Built with Next.js, React, TypeScript and Tailwind CSS.
Hosted on Cloudflare Workers. Written on NixOS.
Standards: valid, mostly.
`)
}

export const { POST, PUT, PATCH, DELETE } = methodGuards
