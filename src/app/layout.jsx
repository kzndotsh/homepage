import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata = {
  title: {
    template: '%s - kzn.sh',
    default: 'kzn.sh',
  },
  description: 'Full stack developer, linux enthusiast, and creative at heart.',
  // alternates: {
  //   types: {
  //     'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
  //   },
  // },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="dark:text-lightText text-darkText dark:bg-darkBackground bg-lightBackground flex h-full">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
