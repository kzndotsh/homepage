'use client'

import { useEffect, useId, useRef, useState } from 'react'

import { cx } from '@/lib/cx'

import s from '../music.module.css'

const LINE = 25
const LINES = 2

/**
 * Genre line clamped to two lines. Genres that do not fit show in a card on
 * hover (mouse), or on tap/focus (touch and keyboard); a bottom sheet on phones.
 * The "+N" sits at the end of the second line, in room the list always leaves
 * free, so showing it never adds a line.
 */
export function GenreFlow({
  genres,
  label,
  name,
}: {
  genres: string[]
  label: string
  name: string
}) {
  const [hidden, setHidden] = useState(0)
  const ul = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = ul.current
    if (!el) return
    const measure = () => {
      // Count genres that wrap past the clamped lines, relative to the list top.
      const top = el.getBoundingClientRect().top
      let n = 0
      el.querySelectorAll('li').forEach((li) => {
        if (li.getBoundingClientRect().top - top >= LINES * LINE - 1) n += 1
      })
      setHidden(n)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
    // Measure again whenever the list changes, though the measuring reads only the DOM.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [genres])

  const rest = hidden > 0 ? genres.slice(genres.length - hidden) : []
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelId = useId()

  const cancelClose = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  return (
    <div className={s.flow}>
      <div
        className={cx(s.genresClip, s.genresReserve)}
        style={{ maxHeight: LINES * LINE }}
      >
        <ul ref={ul} className={s.genres} aria-label={label}>
          {genres.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
      {rest.length > 0 && (
        <div
          role="presentation"
          className={s.morePop}
          onPointerEnter={(e) => {
            if (e.pointerType !== 'mouse') return
            cancelClose()
            setOpen(true)
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== 'mouse') return
            cancelClose()
            timer.current = setTimeout(() => setOpen(false), 150)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
          }}
        >
          <button
            type="button"
            className={s.more}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${rest.length} more ${name} genres`}
            onClick={() => setOpen((o) => !o)}
            onBlur={(e) => {
              if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
                setOpen(false)
              }
            }}
          >
            +{rest.length}
          </button>
          <div
            className={s.sheetBackdrop}
            data-open={open ? '' : undefined}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id={panelId}
            className={s.morePanel}
            data-open={open ? '' : undefined}
            role="region"
            aria-label={`More ${name} genres`}
          >
            <div className={s.morePanelHead}>
              <span>More in {name}</span>
              <button
                type="button"
                className={s.morePanelClose}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className={s.genresClip}>
              <ul className={s.genres}>
                {rest.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
