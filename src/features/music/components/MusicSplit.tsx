'use client'

import { useState } from 'react'

import type {
  GenresByPeriod,
  TopCharts as TopChartsData,
  TopPeriod,
} from '@/lib/integrations/lastfm-history-types'

import { cx } from '@/lib/cx'

import s from '../music.module.css'
import ui from '@/components/ui/ui.module.css'
import { GenreTreemap } from './GenreTreemap'
import { PERIODS, TopCharts } from './TopCharts'

/** Top charts on the left, the genre map for the same time range on the right. */
export function MusicSplit({
  charts,
  genres,
}: {
  charts: TopChartsData
  genres: GenresByPeriod | null
}) {
  const [period, setPeriod] = useState<TopPeriod>('6month')
  const range = PERIODS.find((p) => p.id === period)

  return (
    <div className={s.musicPanel}>
      <div className={s.musicBar}>
        <div
          className={ui.filters}
          role="group"
          aria-label="Time range for charts and genres"
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={ui.filter}
              aria-pressed={period === p.id}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className={s.musicSplit}>
        <div className={s.musicLeft}>
          <TopCharts data={charts} period={period} />
        </div>
        <div className={s.musicRight}>
          <h4 className={cx(ui.tablist, s.tabsFlush)}>
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
