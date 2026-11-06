'use client'

import { useState, type ReactNode } from 'react'

import { ScrollRow } from '@/components/ui/ScrollRow'
import { cx } from '@/lib/cx'

import s from '../library.module.css'

export type ShelfItem = {
  id: string | number
  href: string
  title: string
  subtitle: string
  /** Hover text for the cover; defaults to the title. */
  tooltip?: string
  /** Cover or poster URL; null renders a titled tile. */
  image: string | null
}

const PER_PAGE = 6

/**
 * The stat row, then a strip of covers with a two-column list of the same items
 * beneath. More than one page of items puts wrap-around arrows and a page count
 * on the right of the stats.
 */
export function Shelf({
  stats,
  items,
}: {
  stats: ReactNode
  items: ShelfItem[]
}) {
  const [page, setPage] = useState(0)
  // No direction until the first click, so nothing slides in on page load.
  const [dir, setDir] = useState<'next' | 'prev' | null>(null)
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const shown = items.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const go = (to: number, d: 'next' | 'prev') => {
    setDir(d)
    setPage(to)
  }

  return (
    <>
      <div className={s.libHead}>
        {stats}
        {pages > 1 && (
          <div className={s.libPager}>
            <button
              type="button"
              className={cx(s.libNav, s.libPrev)}
              aria-label="Previous page"
              onClick={() => go((page - 1 + pages) % pages, 'prev')}
            >
              <Chevron />
            </button>
            <span className={s.libPage} aria-live="polite">
              <span className="sr-only">Page </span>
              {page + 1} / {pages}
            </span>
            <button
              type="button"
              className={s.libNav}
              aria-label="Next page"
              onClick={() => go((page + 1) % pages, 'next')}
            >
              <Chevron />
            </button>
          </div>
        )}
      </div>
      <ul className={s.libStrip} key={page} data-dir={dir ?? undefined}>
        {shown.map((item) => (
          <li key={item.id}>
            <a href={item.href} title={item.tooltip ?? item.title}>
              {item.image ? (
                // Hardcover and Trakt serve their own CDNs; next/image needs no config for these.
                <img src={item.image} alt="" className={s.libArt} />
              ) : (
                <span className={cx(s.libArt, s.libNoArt)}>{item.title}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
      <ul
        className={s.libList}
        key={`list-${page}`}
        data-dir={dir ?? undefined}
      >
        {shown.map((item) => (
          <li key={item.id}>
            <a href={item.href} className={s.libRow}>
              <span className={s.libTitle}>{item.title}</span>
              <span className={s.libSub}>{item.subtitle}</span>
            </a>
          </li>
        ))}
        {/* Blank rows on a short last page keep the panel the same height. */}
        {Array.from({ length: PER_PAGE - shown.length }, (_, i) => (
          <li key={`blank-${i}`} aria-hidden="true" className={s.libBlank}>
            <span className={s.libRow}>
              <span className={s.libTitle}>&nbsp;</span>
              <span className={s.libSub}>&nbsp;</span>
            </span>
          </li>
        ))}
      </ul>
      {/* Phones get one swipeable row of every item instead of the pager. */}
      <ScrollRow className={s.libReel}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className={s.libCard}
              title={item.tooltip ?? item.title}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className={s.libArt}
                />
              ) : (
                <span className={cx(s.libArt, s.libNoArt)}>{item.title}</span>
              )}
              <span className={s.libCardTitle}>{item.title}</span>
              <span className={s.libCardSub}>{item.subtitle}</span>
            </a>
          </li>
        ))}
      </ScrollRow>
    </>
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
