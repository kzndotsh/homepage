import type { Metadata, Viewport } from 'next'

import { site } from '@/config/site'
import { person } from '@/content'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s - ${person.name}`,
    default: person.name,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: person.name, url: site.url }],
  creator: person.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: '/',
    title: person.name,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    creator: site.twitter,
    title: person.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="bg-page text-fg">{children}</body>
    </html>
  )
}
