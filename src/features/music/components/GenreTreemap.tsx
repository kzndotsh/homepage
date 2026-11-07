'use client'

import { useMemo, useState } from 'react'
import type { PointerEvent } from 'react'

import { useElementSize } from '@/hooks/useElementSize'
import type { GenreMap } from '@/lib/integrations/lastfm-history-types'

import { TIER_FILLS } from '../tiers'
import { LEADING, PAD, fitLabel, squarify, type Item } from '../treemap'

import s from '../music.module.css'
import ui from '@/components/ui/ui.module.css'

// Size for the first (server) render only. The map stays invisible until the
// real box has been measured, so the guess is never seen.
const DEFAULT = { w: 600, h: 440 }
const GAP = 3
const MIN_TILES = 6
// Tile area follows weight^0.6 so a dominant genre does not squeeze the rest
// below label size; the hover label always shows the real percentage.
const AREA_POWER = 0.6

// Placeholder tiles shown until the real map is measured: a squarified layout of
// typical weights (one big genre, a few mid, a tail), as percentages of the box.
const SKELETON = squarify(
  [22, 11, 9, 7, 6, 5, 4.5, 4, 3.5, 3, 2.5, 2.2, 2, 1.8].map((w, i) => ({
    name: String(i),
    weight: w ** AREA_POWER,
  })),
  { x: 0, y: 0, w: 100, h: 70 },
).map((r, i) => ({
  key: r.name,
  tier: i < 2 ? 0 : i < 6 ? 1 : i < 14 ? 2 : 3,
  left: `${r.x}%`,
  top: `${(r.y / 70) * 100}%`,
  width: `${r.w}%`,
  height: `${(r.h / 70) * 100}%`,
}))
type Hover = { name: string; weight: number; x: number; y: number }

/** The genres I listen to most, sized by how much of my listening they cover. */
export function GenreTreemap({ data }: { data: GenreMap | null }) {
  const [box, size] = useElementSize<HTMLDivElement>(DEFAULT)
  const [hover, setHover] = useState<Hover | null>(null)
  // The hook holds DEFAULT itself until it measures, then swaps in a new object.
  const measured = size !== DEFAULT

  const all = useMemo(
    () =>
      data?.tags
        .filter((t) => t.weight > 0)
        .sort((x, y) => y.weight - x.weight)
        .slice(0, 24),
    [data],
  )

  // Use as many tiles as can each carry a readable label; the rest are listed
  // under the map instead of sitting there as empty boxes.
  const layout = useMemo(() => {
    if (!all || all.length === 0) return null
    const box = { x: 0, y: 0, w: size.w, h: size.h }
    const items: Item[] = all.map((t) => ({
      name: t.name,
      weight: t.weight ** AREA_POWER,
      share: t.weight,
    }))
    let shown = all.length
    for (; shown > MIN_TILES; shown--) {
      const rects = squarify(items.slice(0, shown), box)
      if (rects.every((r) => fitLabel(r.name, r.w - GAP, r.h - GAP))) break
    }
    const tiles = squarify(items.slice(0, shown), box).map((r) => ({
      ...r,
      label: fitLabel(r.name, r.w - GAP, r.h - GAP),
    }))
    return { tiles, rest: all.slice(shown) }
  }, [all, size.w, size.h])

  if (!all || !layout) {
    return <p className={ui.quiet}>Genre data is not available right now.</p>
  }

  const track = (
    e: PointerEvent<SVGGElement>,
    name: string,
    weight: number,
  ) => {
    const b = box.current?.getBoundingClientRect()
    if (!b) return
    setHover({ name, weight, x: e.clientX - b.left, y: e.clientY - b.top })
  }

  return (
    <div className={s.treeWrap}>
      <div
        ref={box}
        className={s.treeBox}
        data-ready={measured ? '' : undefined}
        onPointerLeave={() => setHover(null)}
      >
        <div className={s.treeSkel} aria-hidden="true">
          {SKELETON.map((k) => (
            <span
              key={k.key}
              className={s.treeSkelTile}
              style={{
                left: k.left,
                top: k.top,
                width: k.width,
                height: k.height,
              }}
            >
              <i style={{ background: TIER_FILLS[k.tier] }} />
            </span>
          ))}
        </div>
        <svg
          className={s.tree}
          data-ready={measured ? '' : undefined}
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          role="img"
          aria-label={`Top genres: ${all
            .slice(0, 5)
            .map((t) => t.name)
            .join(', ')} and more`}
        >
          {layout.tiles.map((r, idx) => {
            const tier = idx < 2 ? 0 : idx < 6 ? 1 : idx < 14 ? 2 : 3
            const active = hover?.name === r.name
            return (
              <g
                key={r.name}
                onPointerEnter={(e) => track(e, r.name, r.share ?? r.weight)}
                onPointerMove={(e) => track(e, r.name, r.share ?? r.weight)}
              >
                <rect
                  x={r.x + GAP / 2}
                  y={r.y + GAP / 2}
                  width={Math.max(0, r.w - GAP)}
                  height={Math.max(0, r.h - GAP)}
                  rx={7}
                  style={{
                    fill: TIER_FILLS[tier],
                    stroke: active ? 'var(--color-fg)' : 'none',
                    strokeWidth: 1.5,
                  }}
                />
                {r.label && (
                  <text
                    fontSize={r.label.fs}
                    fontWeight={600}
                    style={{
                      fill:
                        tier === 0
                          ? 'var(--color-on-accent)'
                          : 'var(--color-fg)',
                      pointerEvents: 'none',
                    }}
                  >
                    {r.label.lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={r.x + PAD + GAP / 2}
                        y={
                          r.y +
                          PAD +
                          r.label!.fs * 0.9 +
                          i * r.label!.fs * LEADING
                        }
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        {hover && (
          <div
            className={s.treeTip}
            role="presentation"
            style={{
              left: Math.min(hover.x + 14, size.w - 12),
              top: Math.max(hover.y - 12, 0),
              transform:
                hover.x > size.w * 0.6
                  ? 'translateX(calc(-100% - 28px))'
                  : 'none',
            }}
          >
            <b>{hover.name}</b>
            <span>{hover.weight.toFixed(1)}% of my listening</span>
          </div>
        )}
      </div>
      <p className={s.treeAlso}>
        {layout.rest.length > 0 && (
          <>Also: {layout.rest.map((t) => t.name).join(', ')}</>
        )}
      </p>
    </div>
  )
}
