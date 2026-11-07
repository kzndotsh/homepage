'use client'

import { useEffect, useRef } from 'react'

import type { WorkEntry } from '@/content'

import { ArchThumb } from './ArchThumb'
import s from '../work.module.css'

const MAX_TAGS = 3

function Tags({ items }: { items: string[] }) {
  const shown = items.slice(0, MAX_TAGS)
  const rest = items.length - shown.length
  return (
    <ul className={s.pmTags}>
      {shown.map((t) => (
        <li key={t}>{t}</li>
      ))}
      {rest > 0 && <li className={s.pmMore}>+{rest}</li>}
    </ul>
  )
}

function Card({ e, dup }: { e: WorkEntry; dup: boolean }) {
  const body = (
    <>
      <div className={s.pmThumb}>
        <ArchThumb spec={e.diagram} />
      </div>
      <div className={s.pmBody}>
        <h3 className={s.pmName}>{e.name}</h3>
        <p className={s.pmTitle}>{e.title}</p>
        <Tags items={e.tags} />
      </div>
    </>
  )
  return (
    <a
      className={s.pmCard}
      href={e.href ?? undefined}
      target="_blank"
      rel="noreferrer"
      data-link="true"
      draggable={false}
      tabIndex={dup ? -1 : undefined}
    >
      {body}
    </a>
  )
}

/** Pixels per second at full speed. */
const SPEED = 32
/** How fast the speed eases between paused and moving, per second. */
const EASE = 5

/**
 * 11. A logo wall for work: the cards drift sideways forever, ease to a stop
 * while you hover or focus, and pick up again when you leave. Drag with a
 * mouse or swipe on a touch screen to move it yourself. It draws three copies
 * and keeps the scroll position in the middle one so it never runs out.
 */
export function ProjectMarquee({ entries }: { entries: WorkEntry[] }) {
  const track = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return

    const copy = () => {
      const a = el.children[0] as HTMLElement | undefined
      const b = el.children[entries.length] as HTMLElement | undefined
      return a && b ? b.offsetLeft - a.offsetLeft : 0
    }

    // Measured on resize only: reading offsetLeft every frame forced a layout.
    let width = copy()
    let pos = width
    el.scrollLeft = pos
    let rate = 1
    let hover = false
    let held = false
    let visible = true
    let last = performance.now()
    let raf = 0
    let resume = 0
    // Coasting after a drag is let go, in px/s along scrollLeft.
    let fling = 0
    let samples: { t: number; left: number }[] = []

    const wrap = (width: number) => {
      if (!width) return
      if (el.scrollLeft >= width * 2) {
        el.scrollLeft -= width
        pos = el.scrollLeft
      } else if (el.scrollLeft < width) {
        el.scrollLeft += width
        pos = el.scrollLeft
      }
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // Something else moved it (drag, swipe, wheel): follow it.
      if (Math.abs(el.scrollLeft - pos) > 3) pos = el.scrollLeft
      if (Math.abs(fling) > 8) {
        pos += fling * dt
        el.scrollLeft = pos
        fling *= Math.exp(-dt * 2.6)
      } else {
        fling = 0
      }
      const target = hover || held || !visible || fling !== 0 ? 0 : 1
      rate += (target - rate) * Math.min(1, dt * EASE)
      if (rate > 0.002) {
        pos += SPEED * rate * dt
        el.scrollLeft = pos
      }
      wrap(width)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const over = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    over.observe(el)

    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = true
    }
    const leave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = false
    }
    const focusIn = () => {
      hover = true
    }
    const focusOut = () => {
      hover = false
    }

    // Mouse drag. Touch already scrolls natively.
    let drag: { x: number; left: number; moved: boolean } | null = null
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        if (e.button !== 0) return
        drag = { x: e.clientX, left: el.scrollLeft, moved: false }
        el.style.userSelect = 'none'
        fling = 0
        samples = [{ t: performance.now(), left: el.scrollLeft }]
      } else {
        held = true
        clearTimeout(resume)
      }
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!drag.moved && Math.abs(dx) < 4) return
      drag.moved = true
      el.setPointerCapture(e.pointerId)
      el.dataset.drag = 'true'
      el.scrollLeft = drag.left - dx
      const now = performance.now()
      samples.push({ t: now, left: el.scrollLeft })
      samples = samples.filter((s) => now - s.t < 120)
    }
    const up = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        clearTimeout(resume)
        resume = window.setTimeout(() => {
          held = false
        }, 1200)
        return
      }
      if (drag?.moved) {
        const now = performance.now()
        const recent = samples.filter((s) => now - s.t < 120)
        const first = recent[0]
        const lastS = recent[recent.length - 1]
        if (first && lastS && lastS.t > first.t && now - lastS.t < 80) {
          const v = ((lastS.left - first.left) / (lastS.t - first.t)) * 1000
          fling = Math.max(-3000, Math.min(3000, v))
        }
        // Swallow the click that ends a drag so it does not open a card.
        const stop = (c: Event) => c.stopPropagation()
        el.addEventListener('click', stop, { capture: true, once: true })
        setTimeout(() => el.removeEventListener('click', stop, true), 0)
      }
      drag = null
      delete el.dataset.drag
      el.style.userSelect = ''
    }
    const wheel = () => {
      held = true
      clearTimeout(resume)
      resume = window.setTimeout(() => {
        held = false
      }, 900)
    }

    const noNativeDrag = (e: Event) => e.preventDefault()
    el.addEventListener('dragstart', noNativeDrag)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('focusin', focusIn)
    el.addEventListener('focusout', focusOut)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: true })
    const onResize = () => {
      width = copy()
      pos = width + (el.scrollLeft % (width || 1))
    }
    const resize = new ResizeObserver(onResize)
    resize.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resume)
      over.disconnect()
      el.removeEventListener('dragstart', noNativeDrag)
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('focusin', focusIn)
      el.removeEventListener('focusout', focusOut)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
      resize.disconnect()
    }
  }, [entries.length])

  return (
    <ul
      ref={track}
      className={s.pmTrack}
      aria-label="Projects, scrolls on its own"
    >
      {[0, 1, 2].flatMap((copyIndex) =>
        entries.map((e) => (
          <li
            key={`${copyIndex}-${e.id}`}
            className={s.pmItem}
            aria-hidden={copyIndex !== 1 || undefined}
          >
            <Card e={e} dup={copyIndex !== 1} />
          </li>
        )),
      )}
    </ul>
  )
}
