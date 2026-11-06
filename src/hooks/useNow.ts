'use client'

import { useEffect, useState } from 'react'

/**
 * The current time in ms, refreshed on an interval.
 * Null until mounted, so server and first client render match.
 */
export function useNow(intervalMs: number): number | null {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0)
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [intervalMs])

  return now
}
