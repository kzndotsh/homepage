'use client'

import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { LuPlay } from 'react-icons/lu'

import type {
  TopCharts as TopChartsData,
  TopKind,
  TopPeriod,
} from '@/lib/integrations/lastfm-history-types'

import { cx } from '@/lib/cx'
import { formatNumber as nf } from '@/lib/formatNumber'

import s from '../music.module.css'
import ui from '@/components/ui/ui.module.css'
import { TIER_FILLS, tierForRank } from '../tiers'

const KINDS: { id: TopKind; label: string }[] = [
  { id: 'artists', label: 'Artists' },
  { id: 'albums', label: 'Albums' },
  { id: 'tracks', label: 'Tracks' },
]

export const PERIODS: {
  id: TopPeriod
  label: string
  /** What the button says on a phone. */
  short: string
  long: string
}[] = [
  { id: '7day', label: '7 days', short: '7d', long: 'the last 7 days' },
  { id: '1month', label: '1 month', short: '1m', long: 'the last month' },
  { id: '3month', label: '3 months', short: '3m', long: 'the last 3 months' },
  { id: '6month', label: '6 months', short: '6m', long: 'the last 6 months' },
  {
    id: '12month',
    label: '12 months',
    short: '12m',
    long: 'the last 12 months',
  },
  { id: 'overall', label: 'All time', short: 'All', long: 'all time' },
]

/** Top artists, albums or tracks for a chosen time range, from Last.fm. */
export function TopCharts({
  data,
  period,
}: {
  data: TopChartsData
  period: TopPeriod
}) {
  const [kind, setKind] = useState<TopKind>('artists')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (e: KeyboardEvent, i: number) => {
    const next =
      e.key === 'ArrowRight'
        ? (i + 1) % KINDS.length
        : e.key === 'ArrowLeft'
          ? (i - 1 + KINDS.length) % KINDS.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? KINDS.length - 1
              : -1
    if (next < 0) return
    e.preventDefault()
    setKind(KINDS[next].id)
    tabs.current[next]?.focus()
  }

  const items = data[kind][period] ?? []
  const max = Math.max(1, ...items.map((item) => item.plays))
  const range = PERIODS.find((p) => p.id === period)

  return (
    <>
      <div
        className={cx(ui.tablist, s.tabsFlush)}
        role="tablist"
        aria-label="What to rank"
      >
        {KINDS.map((k, i) => (
          <button
            key={k.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`top-tab-${k.id}`}
            aria-selected={kind === k.id}
            aria-controls="top-panel"
            tabIndex={kind === k.id ? 0 : -1}
            className={ui.tab}
            onClick={() => setKind(k.id)}
            onKeyDown={(e) => move(e, i)}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className={s.topBody}>
        <div
          id="top-panel"
          className={s.topPanel}
          role="tabpanel"
          aria-labelledby={`top-tab-${kind}`}
        >
          {items.length > 0 ? (
            <ol
              className={s.topList}
              aria-label={`Top ${kind}, ${range?.long}`}
            >
              {items.map((item, i) => (
                <li key={`${item.by ?? ''}-${item.name}`} className={s.topRow}>
                  <span className={s.topRank} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={s.topName}>
                    <a href={item.url}>{item.name}</a>
                    {item.by && <span className={s.topBy}>{item.by}</span>}
                  </span>
                  <span className={s.topPlays}>
                    {nf(item.plays)}
                    <span className={s.topPlaysWord}> plays</span>
                    <LuPlay className={s.topPlaysIcon} aria-hidden="true" />
                  </span>
                  <span className={s.topTrack} aria-hidden="true">
                    <i
                      className={s.topFill}
                      style={{
                        width: `${(item.plays / max) * 100}%`,
                        background: TIER_FILLS[tierForRank(i, items.length)],
                      }}
                    />
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={ui.quiet}>Nothing listened to in this window.</p>
          )}
        </div>
      </div>
    </>
  )
}
