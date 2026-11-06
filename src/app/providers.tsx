'use client'

import { ThemeProvider } from 'next-themes'

// The site is dark only; the theme is forced so nothing flashes light.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
