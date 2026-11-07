import type { ArchSpec } from '@/content'

import {
  describe,
  layoutTall,
  layoutWide,
  type DiagramModel,
} from '../archLayout'

import s from '../arch.module.css'

const HEAD = 6

function head({
  x,
  y,
  dir,
}: {
  x: number
  y: number
  dir: 'r' | 'l' | 'u' | 'd'
}) {
  const pts: Record<string, string> = {
    r: `${x},${y} ${x - HEAD * 1.5},${y - HEAD} ${x - HEAD * 1.5},${y + HEAD}`,
    l: `${x},${y} ${x + HEAD * 1.5},${y - HEAD} ${x + HEAD * 1.5},${y + HEAD}`,
    d: `${x},${y} ${x - HEAD},${y - HEAD * 1.5} ${x + HEAD},${y - HEAD * 1.5}`,
    u: `${x},${y} ${x - HEAD},${y + HEAD * 1.5} ${x + HEAD},${y + HEAD * 1.5}`,
  }
  return pts[dir]
}

function Svg({
  model,
  label,
  className,
}: {
  model: DiagramModel
  label: string
  className: string
}) {
  return (
    <svg
      className={className}
      style={{ maxWidth: model.width }}
      viewBox={`0 0 ${model.width} ${model.height}`}
      role="img"
      aria-label={label}
    >
      {model.group && (
        <rect
          className={s.dGroup}
          x={model.group.x}
          y={model.group.y}
          width={model.group.w}
          height={model.group.h}
          rx={12}
        />
      )}
      {model.arrows.map((a, i) => (
        <g key={i} className={a.hot ? s.dHotLine : s.dLine}>
          <polyline
            points={a.line.map((p) => p.join(',')).join(' ')}
            fill="none"
          />
          <polygon points={head(a.head)} />
        </g>
      ))}
      {model.boxes.map((b, i) => (
        <g key={i}>
          <rect
            className={b.hot ? s.dNodeHot : s.dNode}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={9}
          />
          <text
            className={s.dTitle}
            x={b.x + b.w / 2}
            y={b.y + (b.sub ? b.h / 2 - 3 : b.h / 2 + 5)}
            fontSize={14 * b.scale.title}
          >
            {b.title}
          </text>
          {b.sub && (
            <text
              className={s.dSub}
              x={b.x + b.w / 2}
              y={b.y + b.h / 2 + 15}
              fontSize={11 * b.scale.sub}
            >
              {b.sub}
            </text>
          )}
        </g>
      ))}
      {model.group && (
        <text className={s.dMono} x={model.group.x + 14} y={model.group.y + 20}>
          {model.group.label}
        </text>
      )}
      {model.labels.map((l, i) => (
        <text key={i} className={s.dMono} x={l.x} y={l.y} textAnchor={l.anchor}>
          {l.text}
        </text>
      ))}
    </svg>
  )
}

/**
 * A small architecture diagram for one piece of work. Wide on desktop, stacked
 * on phones, drawn from the same spec.
 */
export function ArchDiagram({ name, spec }: { name: string; spec: ArchSpec }) {
  const label = describe(name, spec)
  return (
    <div className={s.diagram}>
      <Svg model={layoutWide(spec)} label={label} className={s.dWide} />
      <Svg model={layoutTall(spec)} label={label} className={s.dTall} />
    </div>
  )
}
