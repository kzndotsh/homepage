'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * The logo, home. On the homepage a plain link to "/" leaves a `#section` in the
 * URL and the page where it is, so it clears the hash and scrolls to the top itself.
 */
export function BrandLink({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const pathname = usePathname()
  return (
    <Link
      href="/"
      prefetch={false}
      className={className}
      aria-label="kzn.sh, back to the top"
      onClick={(e) => {
        if (pathname !== '/') return
        e.preventDefault()
        if (window.location.hash) history.pushState(null, '', '/')
        const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' })
      }}
    >
      {children}
    </Link>
  )
}
