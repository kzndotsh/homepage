'use client'

import { type ReactNode, useEffect, useRef } from 'react'

import { cx } from '@/lib/cx'

import s from './ui.module.css'

/**
 * A list that scrolls sideways on phones (the layout comes from `className`).
 * It says so two ways: the edges fade while there is more that way, and a thin
 * track under the row shows where you are. Wider screens get neither.
 */
export function ScrollRow({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const box = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const root = box.current
    const el = list.current
    if (!root || !el) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = el.scrollWidth - el.clientWidth
      const fits = max <= 1
      const thumb = el.scrollWidth
        ? Math.min(1, el.clientWidth / el.scrollWidth)
        : 1
      const at = fits ? 0 : el.scrollLeft / max
      root.style.setProperty('--tw', `${thumb * 100}%`)
      root.style.setProperty('--tx', `${at * (1 - thumb) * 100}%`)
      el.style.setProperty('--fl', !fits && el.scrollLeft > 4 ? '28px' : '0px')
      el.style.setProperty(
        '--fr',
        !fits && max - el.scrollLeft > 4 ? '28px' : '0px',
      )
      root.toggleAttribute('data-fit', fits)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', schedule, { passive: true })
    const resize = new ResizeObserver(schedule)
    resize.observe(el)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('scroll', schedule)
      resize.disconnect()
    }
  }, [])

  return (
    <div ref={box} className={s.scrollRow}>
      <ul ref={list} className={cx(className, s.scrollMask)}>
        {children}
      </ul>
      <div className={s.scrollTrack} aria-hidden="true">
        <i />
      </div>
    </div>
  )
}
