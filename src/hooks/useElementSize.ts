'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

export type Size = { w: number; h: number }

/** Track an element's rendered size. Zero-sized reports are ignored. */
export function useElementSize<T extends HTMLElement>(
  initial: Size,
): [RefObject<T | null>, Size] {
  const ref = useRef<T>(null)
  const [size, setSize] = useState(initial)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        setSize({ w: Math.round(width), h: Math.round(height) })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, size]
}
