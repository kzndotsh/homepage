import type { Metadata } from 'next'

import { HomePage } from '@/features/home/HomePage'

export const metadata: Metadata = {
  alternates: { types: { 'text/markdown': '/index.md' } },
}

// Integrations are fetched on the server and cached for 15 minutes.
export const revalidate = 300

export default function Page() {
  return <HomePage />
}
