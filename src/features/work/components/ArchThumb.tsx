import type { ArchSpec } from '@/content'

import { layoutWide } from '../archLayout'

import s from '../arch.module.css'

/**
 * The diagram with the words taken out: boxes, arrows and the dashed group.
 * Small enough for a card, and still recognisable as that project's shape.
 */
export function ArchThumb({ spec }: { spec: ArchSpec }) {
  const m = layoutWide(spec)
  const lines = m.arrows.map((a) => ({
    key: a.line.map((p) => p.join(',')).join(' '),
    hot: a.hot,
  }))
  return (
    <svg
      className={s.thumb}
      viewBox={`0 0 ${m.width} ${m.height}`}
      aria-hidden="true"
      focusable="false"
    >
      {m.group && (
        <rect
          className={s.dGroup}
          x={m.group.x}
          y={m.group.y}
          width={m.group.w}
          height={m.group.h}
          rx={12}
        />
      )}
      {lines.map((l) => (
        <polyline
          key={l.key}
          className={l.hot ? s.thumbHotLine : s.thumbLine}
          points={l.key}
          fill="none"
        />
      ))}
      {m.boxes.map((b, i) => (
        <rect
          key={i}
          className={b.hot ? s.dNodeHot : s.dNode}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={9}
        />
      ))}
    </svg>
  )
}
