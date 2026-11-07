'use client'

import type { ReactNode } from 'react'

import { EXP_ID } from '../expId'

/**
 * Wires the timeline bars to the list below them: click a bar and that job
 * opens, scrolls into view and flashes once.
 */
export function ExperienceLinks({ children }: { children: ReactNode }) {
  return (
    // One delegated click handler; every row is already keyboard-operable through its <summary>.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={(e) => {
        if (!(e.target instanceof Element)) return
        const bar = e.target.closest<HTMLElement>('[data-open]')
        const row = bar && document.getElementById(EXP_ID + bar.dataset.open)
        if (!bar) {
          // The summary toggles itself; the rest of the row (dates, padding) should too.
          const t = e.target
          const item = t.closest<HTMLElement>(`li[id^="${EXP_ID}"]`)
          if (!item || t.closest('summary, ul, a, button')) return
          item.querySelector('details')?.toggleAttribute('open')
          return
        }
        if (!row) return
        row.querySelector('details')?.setAttribute('open', '')
        const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
        row.scrollIntoView({
          behavior: calm ? 'auto' : 'smooth',
          block: 'center',
        })
        delete row.dataset.flash
        void row.offsetWidth
        row.dataset.flash = ''
      }}
    >
      {children}
    </div>
  )
}
