'use client'

import { useEffect } from 'react'

/** A section counts as the current one once its top has passed this share of the viewport. */
const LINE = 0.35
/** How long the page must stop scrolling before the hash follows it again. */
const SETTLE = 150

/**
 * Keeps the URL's #section in step with the section being read, for every section
 * of the page, and clears it back at the hero. It replaces the history entry, so
 * scrolling does not fill the Back button. While a jump is in flight (a nav click,
 * or a page opened on a #section) the hash is left alone until the scroll settles.
 */
export function ScrollSpy() {
  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>('main > section[id]'),
    ]
    let frame = 0
    let pinned = true
    let settle = 0

    const hold = () => {
      pinned = true
      clearTimeout(settle)
      settle = window.setTimeout(() => {
        pinned = false
      }, SETTLE)
    }

    const sync = () => {
      frame = 0
      let current = ''
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= innerHeight * LINE) {
          current = section.id
        }
      }
      const hash = current ? `#${current}` : ''
      if (hash === window.location.hash) return
      history.replaceState(
        history.state,
        '',
        `${window.location.pathname}${window.location.search}${hash}`,
      )
    }

    const onScroll = () => {
      if (pinned) {
        hold()
        return
      }
      if (!frame) frame = requestAnimationFrame(sync)
    }
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a[href^="#"]'))
        hold()
    }

    hold()
    addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      clearTimeout(settle)
      removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
