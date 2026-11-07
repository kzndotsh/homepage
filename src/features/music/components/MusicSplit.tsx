'use client'

import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { cx } from '@/lib/cx'
import type {
  GenresByPeriod,
  TopCharts as TopChartsData,
  TopKind,
  TopPeriod,
} from '@/lib/integrations/lastfm-history-types'

import { GenreTreemap } from './GenreTreemap'
import { KINDS, PERIODS, TopCharts } from './TopCharts'

import s from '../music.module.css'
import ui from '@/components/ui/ui.module.css'

/** Top charts on the left, the genre map for the same time range on the right. */
export function MusicSplit({
  charts,
  genres,
}: {
  charts: TopChartsData
  genres: GenresByPeriod | null
}) {
  const [period, setPeriod] = useState<TopPeriod>('6month')
  const [kind, setKind] = useState<TopKind>('artists')
  // Side by side on a wide screen. Stacked, the rankings and the genre map share
  // one slot and these tabs pick which shows.
  const [view, setView] = useState<'charts' | 'genres'>('charts')
  const range = PERIODS.find((p) => p.id === period)

  const STACK = [
    ...KINDS.map((k) => ({ id: k.id as string, label: k.label })),
    { id: 'genres', label: 'Genres' },
  ]
  const active = view === 'genres' ? 'genres' : kind
  const stackTabs = useRef<(HTMLButtonElement | null)[]>([])
  const pick = (id: string) => {
    if (id === 'genres') setView('genres')
    else {
      const next = KINDS.find((k) => k.id === id)
      if (next) setKind(next.id)
      setView('charts')
    }
  }
  const move = (e: KeyboardEvent, i: number) => {
    const next =
      e.key === 'ArrowRight'
        ? (i + 1) % STACK.length
        : e.key === 'ArrowLeft'
          ? (i - 1 + STACK.length) % STACK.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? STACK.length - 1
              : -1
    if (next < 0) return
    e.preventDefault()
    pick(STACK[next].id)
    stackTabs.current[next]?.focus()
  }

  return (
    <div className={s.musicPanel}>
      <div className={s.musicBar}>
        <div
          className={ui.filtersMin}
          role="group"
          aria-label="Time range for charts and genres"
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={ui.filterMin}
              aria-pressed={period === p.id}
              aria-label={`${p.short}, ${p.label}`}
              onClick={() => setPeriod(p.id)}
            >
              <span className={s.periodFull}>{p.label}</span>
              <span className={s.periodShort} aria-hidden="true">
                {p.short}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className={s.stackBar} role="tablist" aria-label="What to show">
        {STACK.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              stackTabs.current[i] = el
            }}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            tabIndex={active === tab.id ? 0 : -1}
            className={s.stackTab}
            onClick={() => pick(tab.id)}
            onKeyDown={(e) => move(e, i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={s.musicSplit} data-view={view}>
        <div className={s.musicLeft}>
          <TopCharts
            data={charts}
            period={period}
            kind={kind}
            onKind={setKind}
          />
        </div>
        <div className={s.musicRight}>
          <h4 className={cx(ui.tablist, s.tabsFlush, s.genresHead)}>
            <span className={ui.tab}>
              Top genres<span className="sr-only">, {range?.long}</span>
            </span>
          </h4>
          <div key={period} className={s.treeIn}>
            <GenreTreemap data={genres?.[period] ?? null} />
          </div>
        </div>
      </div>
    </div>
  )
}
