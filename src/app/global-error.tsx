'use client'

import '@/styles/tailwind.css'

/**
 * Shown when the root layout itself throws. It replaces the layout, so it brings its
 * own <html> and <body> and the global styles.
 */
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="bg-page text-fg">
        <title>Something went wrong</title>
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-sm text-fg-muted">Error</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Something went wrong
          </h1>
          <p className="mt-4 text-fg-muted">
            The page failed to load. Trying again usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
