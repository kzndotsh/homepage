'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { scrollToTop } from '../scrollToTop'

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
        scrollToTop()
      }}
    >
      {children}
    </Link>
  )
}
