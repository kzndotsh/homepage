'use client'

import { type ReactNode, useEffect, useRef } from 'react'

import { cssVars } from '@/lib/cssVars'
import { cx } from '@/lib/cx'

import s from './ui.module.css'

// Runs as the row streams in, right after it, so the thumb already has its real
// length on the first paint (the length depends on the screen width and the
// number of items); React sets the rest once the page is interactive.
const MEASURE =
  "(function(){var r=document.currentScript.parentElement,u=r.querySelector('ul');if(!u)return;if(u.scrollWidth-u.clientWidth<=1)return;r.style.setProperty('--tw',Math.min(1,u.clientWidth/u.scrollWidth)*100+'%')})()"

/**
 * A list that scrolls sideways when it does not fit (the layout comes from
 * `className`). It says so with edge fades while there is more that way, and a
 * thin track under the row shows where you are. A finger or trackpad swipes it,
 * a mouse drags it, and on a wide screen the arrows beside the track page it.
 * When everything fits it is just the list.
 */
export function ScrollRow({
  className,
  always = false,
  guess = 0.3,
  children,
}: {
  className: string
  /**
   * The list always overflows (a long row of cards), so the track and arrows are
   * in the page from the first paint instead of appearing once the script runs.
   */
  always?: boolean
  /** Before the script measures, the track's thumb is drawn this share of the track. */
  guess?: number
  children: ReactNode
}) {
  const box = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const prev = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)

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
      const more = (left: number) => (!fits && left > 4 ? '24px' : '0px')
      root.style.setProperty('--tw', `${thumb * 100}%`)
      root.style.setProperty('--tx', `${at * (1 - thumb) * 100}%`)
      el.style.setProperty('--fl', more(el.scrollLeft))
      el.style.setProperty('--fr', more(max - el.scrollLeft))
      if (prev.current) prev.current.disabled = fits || el.scrollLeft <= 4
      if (next.current) next.current.disabled = fits || max - el.scrollLeft <= 4
      root.toggleAttribute('data-fit', fits)
      root.dataset.ready = ''
      el.toggleAttribute('data-scroll', !fits)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', schedule, { passive: true })
    const resize = new ResizeObserver(schedule)
    resize.observe(el)

    // After a drag, glide to the nearest card with a small overshoot, carrying the
    // speed of the let-go, instead of jumping the instant snapping comes back.
    let glide = 0
    const stopGlide = () => {
      if (!glide) return
      cancelAnimationFrame(glide)
      glide = 0
      el.style.scrollSnapType = ''
    }
    const settle = (speed: number) => {
      const max = el.scrollWidth - el.clientWidth
      const pad = Number.parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
      const base = el.getBoundingClientRect().left
      const stops = [...el.children].map((c) =>
        Math.min(
          max,
          Math.max(
            0,
            c.getBoundingClientRect().left - base + el.scrollLeft - pad,
          ),
        ),
      )
      const aim = el.scrollLeft + speed * 220
      const target = stops.reduce(
        (best, x) => (Math.abs(x - aim) < Math.abs(best - aim) ? x : best),
        stops[0] ?? 0,
      )
      const start = el.scrollLeft
      const dist = target - start
      const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
      if (calm || Math.abs(dist) < 1) {
        el.style.scrollSnapType = ''
        el.scrollLeft = target
        return
      }
      const duration = Math.min(700, 360 + Math.abs(dist) * 0.7)
      const t0 = performance.now()
      // ease-out-back: runs a little past the card, then settles back onto it
      const ease = (k: number) => 1 + 2.4 * (k - 1) ** 3 + 1.4 * (k - 1) ** 2
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / duration)
        // the overshoot is capped at 16px so a long throw does not swing far past
        const raw = start + dist * ease(k)
        el.scrollLeft =
          dist > 0 ? Math.min(raw, target + 16) : Math.max(raw, target - 16)
        if (k < 1) glide = requestAnimationFrame(step)
        else {
          glide = 0
          el.scrollLeft = target
          el.style.scrollSnapType = ''
        }
      }
      glide = requestAnimationFrame(step)
    }

    // A mouse drags the row (touch and trackpads already scroll it).
    let from: { x: number; left: number } | null = null
    let moved = false
    let suppress = false
    let speed = 0
    let last = { left: 0, at: 0 }
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if (el.scrollWidth - el.clientWidth <= 1) return
      stopGlide()
      from = { x: e.clientX, left: el.scrollLeft }
      moved = false
      speed = 0
      last = { left: el.scrollLeft, at: performance.now() }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    }
    const move = (e: PointerEvent) => {
      if (!from) return
      const dx = e.clientX - from.x
      if (!moved && Math.abs(dx) < 5) return
      if (!moved) {
        moved = true
        el.dataset.drag = 'true'
        el.style.scrollSnapType = 'none'
      }
      el.scrollLeft = from.left - dx
      // px per ms, smoothed so one jittery event does not decide the throw
      const now = performance.now()
      if (now > last.at) {
        speed =
          speed * 0.7 + ((el.scrollLeft - last.left) / (now - last.at)) * 0.3
        last = { left: el.scrollLeft, at: now }
      }
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      if (from && moved) {
        // Let go and it glides onto a card; a drag is not a click.
        delete el.dataset.drag
        // a pause before letting go means no throw
        settle(performance.now() - last.at > 90 ? 0 : speed)
        suppress = true
        setTimeout(() => {
          suppress = false
        }, 60)
      }
      from = null
    }
    const click = (e: MouseEvent) => {
      if (!suppress) return
      e.preventDefault()
      e.stopPropagation()
    }
    const noGhost = (e: Event) => e.preventDefault()
    el.addEventListener('wheel', stopGlide, { passive: true })
    el.addEventListener('touchstart', stopGlide, { passive: true })
    el.addEventListener('pointerdown', down)
    el.addEventListener('click', click, true)
    el.addEventListener('dragstart', noGhost)

    // Native listeners, not React's onClick: React reads `disabled` from the JSX
    // (always true for the back arrow), so it would drop clicks even after the
    // script above enables the button.
    const page = (dir: 1 | -1) => () => {
      const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollBy({
        left: dir * el.clientWidth * 0.85,
        behavior: calm ? 'auto' : 'smooth',
      })
    }
    const back = page(-1)
    const forward = page(1)
    const prevBtn = prev.current
    const nextBtn = next.current
    prevBtn?.addEventListener('click', back)
    nextBtn?.addEventListener('click', forward)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('scroll', schedule)
      resize.disconnect()
      prevBtn?.removeEventListener('click', back)
      nextBtn?.removeEventListener('click', forward)
      stopGlide()
      el.removeEventListener('wheel', stopGlide)
      el.removeEventListener('touchstart', stopGlide)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('click', click, true)
      el.removeEventListener('dragstart', noGhost)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <div
      ref={box}
      className={s.scrollRow}
      data-always={always ? '' : undefined}
      style={cssVars({ '--tw': `${guess * 100}%` })}
      suppressHydrationWarning
    >
      <ul ref={list} className={cx(className, s.scrollMask)}>
        {children}
      </ul>
      <div className={s.scrollFoot}>
        <div className={s.scrollTrack} aria-hidden="true">
          <i />
        </div>
        <div className={s.scrollArrows}>
          <button
            ref={prev}
            type="button"
            className={cx(s.scrollArrow, s.scrollPrev)}
            disabled
            aria-label="Scroll left"
          >
            <Chevron />
          </button>
          <button
            ref={next}
            type="button"
            className={s.scrollArrow}
            aria-label="Scroll right"
          >
            <Chevron />
          </button>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: MEASURE }} />
    </div>
  )
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
