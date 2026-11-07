'use client'

import { useEffect, useState } from 'react'

import { scrollToTop } from '../scrollToTop'

import s from '../home.module.css'

/** The button shows once the hero is a screen behind you. */
const SHOW_AFTER = 0.8

/** A round button in the bottom right corner that takes you back to the top. */
export function ToTop() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setShown(scrollY > innerHeight * SHOW_AFTER)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <button
      type="button"
      className={s.toTop}
      data-shown={shown ? '' : undefined}
      onClick={scrollToTop}
      aria-label="Back to the top"
      tabIndex={shown ? undefined : -1}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path
          d="M3.5 9.5 8 5l4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
