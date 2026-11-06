'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { formatNumber as nf } from '@/lib/formatNumber'
import type { GithubActivity, GithubEventKind } from '@/lib/integrations/types'
import { relativeTime } from '@/lib/relativeTime'

import s from '../coding.module.css'
import { KIND } from '../eventKinds'
import { buildHeatmap, heatLevel } from '../heatmap'
import ui from '@/components/ui/ui.module.css'

function Heatmap({
  calendar,
}: {
  calendar: { date: string; count: number }[]
}) {
  const { weeks, months, cuts } = useMemo(
    () => buildHeatmap(calendar),
    [calendar],
  )

  const step = 14
  const total = calendar.reduce((a, c) => a + c.count, 0)

  // On a narrow screen the calendar scrolls; start at the newest weeks.
  const wrap = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = wrap.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  return (
    <div ref={wrap} className={s.heatWrap}>
      <svg
        className={s.heat}
        viewBox={`0 0 ${weeks.length * step + 4} ${7 * step + 18}`}
        role="img"
        aria-label={`Contribution calendar: ${nf(total)} contributions over the past year`}
      >
        {months.map((m) => (
          <text key={`${m.label}${m.x}`} x={m.x * step} y={9}>
            {m.label}
          </text>
        ))}
        {weeks.map((col, x) =>
          col.map((c, y) =>
            c ? (
              <rect
                key={c.date}
                x={x * step}
                y={18 + y * step}
                width={11}
                height={11}
                rx={2}
                className={s[`hc${heatLevel(c.count, cuts)}`]}
              >
                <title>{`${c.count} on ${c.date}`}</title>
              </rect>
            ) : null,
          ),
        )}
        {/* The rest of this week: days that have not happened yet. */}
        {Array.from({ length: 7 - weeks[weeks.length - 1].length }, (_, i) => (
          <rect
            key={`future-${i}`}
            x={(weeks.length - 1) * step + 0.5}
            y={18 + (weeks[weeks.length - 1].length + i) * step + 0.5}
            width={10}
            height={10}
            rx={2}
            className={s.hcFuture}
            aria-hidden="true"
          />
        ))}
      </svg>
    </div>
  )
}

export function GithubLive({ data }: { data: GithubActivity }) {
  const [kind, setKind] = useState<GithubEventKind | 'all'>('all')
  const counts = useMemo(() => {
    const m = new Map<GithubEventKind, number>()
    for (const e of data.events) m.set(e.kind, (m.get(e.kind) ?? 0) + 1)
    return m
  }, [data.events])
  const shown = data.events
    .filter((e) => kind === 'all' || e.kind === kind)
    .slice(0, 8)
  const t = data.totals

  return (
    <>
      <div className={s.liveTop}>
        <dl className={ui.stats}>
          <div className={ui.stat}>
            <dt>Public repos</dt>
            <dd className={ui.mono}>{nf(t.publicRepos)}</dd>
          </div>
          <div className={ui.stat}>
            <dt>Followers</dt>
            <dd className={ui.mono}>{nf(t.followers)}</dd>
          </div>
          {t.starsEarned !== null && (
            <div className={ui.stat}>
              <dt>Stars earned</dt>
              <dd className={ui.mono}>{nf(t.starsEarned)}</dd>
            </div>
          )}
          {t.starsGiven !== null && (
            <div className={ui.stat}>
              <dt>Stars given</dt>
              <dd className={ui.mono}>{nf(t.starsGiven)}</dd>
            </div>
          )}
          {t.contributionsLastYear !== null && (
            <div className={ui.stat}>
              <dt>Contributions, past year</dt>
              <dd className={ui.mono}>{nf(t.contributionsLastYear)}</dd>
            </div>
          )}
        </dl>
      </div>

      {data.calendar && data.calendar.length > 0 ? (
        <div>
          <Heatmap calendar={data.calendar} />
          <div className={s.heatLegend} aria-hidden="true">
            less <i className={s.l0} /> <i className={s.l1} />{' '}
            <i className={s.l2} /> <i className={s.l3} /> <i className={s.l4} />{' '}
            more
          </div>
        </div>
      ) : (
        <p className={ui.quiet}>
          Public events only. The contribution calendar needs an authenticated
          fetch.
        </p>
      )}

      {data.events.length > 0 ? (
        <div>
          <div
            className={ui.filtersMin}
            role="group"
            aria-label="Filter by kind"
            style={{ marginBottom: 8 }}
          >
            <button
              type="button"
              className={ui.filterMin}
              aria-pressed={kind === 'all'}
              onClick={() => setKind('all')}
            >
              All<span className={s.filterCount}>{data.events.length}</span>
            </button>
            {[...counts.entries()].map(([k, n]) => (
              <button
                key={k}
                type="button"
                className={ui.filterMin}
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
              >
                {KIND[k].label}
                <span className={s.filterCount}>{n}</span>
              </button>
            ))}
          </div>
          <ul className={s.feed}>
            {shown.map((e) => (
              <li key={e.id} className={s.ev}>
                <span className={s.evIcon} aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={KIND[e.kind].d} />
                  </svg>
                </span>
                <span className={s.evTitle}>
                  {e.action && (
                    <span className={s.evAction}>
                      {e.action}
                      <span aria-hidden="true"> /</span>{' '}
                    </span>
                  )}
                  <a href={e.url}>{e.title}</a>
                </span>
                <span className={`${s.evTime} ${ui.mono}`}>
                  {relativeTime(e.at, data.fetchedAt)}
                </span>
                <span className={s.evMeta}>
                  <a className={s.evRepo} href={`https://github.com/${e.repo}`}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                    {e.repo}
                  </a>
                  {e.diff && (
                    <span className={`${s.evDiff} ${ui.mono}`}>
                      <span className={s.evAdd}>+{nf(e.diff.additions)}</span>{' '}
                      <span className={s.evDel}>
                        &minus;{nf(e.diff.deletions)}
                      </span>
                      {e.diff.files > 0 && (
                        <span className={s.evFiles}>
                          {' '}
                          {e.diff.files} {e.diff.files === 1 ? 'file' : 'files'}
                        </span>
                      )}
                    </span>
                  )}
                  {e.sha && (
                    <a
                      className={`${s.evSha} ${ui.mono}`}
                      href={`https://github.com/${e.repo}/commit/${e.sha}`}
                    >
                      {e.sha}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={ui.quiet}>No recent public events.</p>
      )}
    </>
  )
}
