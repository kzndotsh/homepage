import type { Metadata } from 'next'

import { Providers } from '@/app/providers'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - kzn.sh',
    default: 'kzn.sh',
  },
  description: 'Full stack developer, linux enthusiast, and creative at heart.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <body className="bg-page text-fg">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
