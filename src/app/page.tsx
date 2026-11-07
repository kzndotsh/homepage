import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { HomePage } from '@/features/home/HomePage'
import { homeJsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: { 'text/markdown': '/index.md' },
  },
}

// Integrations are fetched on the server and cached for 15 minutes.
export const revalidate = 300

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HomePage />
    </>
  )
}
