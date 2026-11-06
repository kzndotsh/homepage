'use client'

import type { ReactNode } from 'react'

import { EXP_ID } from '../expId'

/**
 * Wires the timeline bars to the list below them: click a bar and that job
 * opens, scrolls into view and flashes once.
 */
export function ExperienceLinks({ children }: { children: ReactNode }) {
  return (
    <div
      onClick={(e) => {
        const bar = (e.target as Element).closest<HTMLElement>('[data-open]')
        const row = bar && document.getElementById(EXP_ID + bar.dataset.open)
        if (!bar) {
          // The summary toggles itself; the rest of the row (dates, padding) should too.
          const t = e.target as Element
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
        row.removeAttribute('data-flash')
        void row.offsetWidth
        row.dataset.flash = ''
      }}
    >
      {children}
    </div>
  )
}
