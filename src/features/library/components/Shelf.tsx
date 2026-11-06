'use client'

import type { ReactNode } from 'react'

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

/**
 * The stat row, then every item as a cover with its title and subtitle in one
 * row you swipe (a finger or trackpad), drag (a mouse) or page with the arrows.
 */
export function Shelf({
  stats,
  items,
}: {
  stats: ReactNode
  items: ShelfItem[]
}) {
  return (
    <>
      <div className={s.libHead}>{stats}</div>
      <ScrollRow className={s.libReel} always guess={0.16}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className={s.libCard}
              title={item.tooltip ?? item.title}
              draggable={false}
            >
              {item.image ? (
                // Hardcover and Trakt serve their own CDNs; next/image needs no config for these.
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  draggable={false}
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
