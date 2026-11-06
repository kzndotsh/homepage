import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-fg-muted">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-fg-muted">
        Sorry, there is nothing at this address.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Go back home
      </Link>
    </main>
  )
}
