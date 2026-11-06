import type { ArchSpec } from '@/content'

export type Box = {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub?: string
  hot: boolean
  /** Font scale so long text still fits the box. */
  scale: { title: number; sub: number }
}

export type Arrow = {
  /** Polyline points. */
  line: [number, number][]
  /** Arrowhead tip and direction. */
  head: { x: number; y: number; dir: 'r' | 'l' | 'u' | 'd' }
  hot: boolean
}

export type Label = {
  x: number
  y: number
  text: string
  anchor: 'start' | 'middle'
}

export type DiagramModel = {
  width: number
  height: number
  boxes: Box[]
  arrows: Arrow[]
  group: { x: number; y: number; w: number; h: number; label: string } | null
  labels: Label[]
}

const TITLE_CHAR = 7.9 // px per character at 14px semibold
const SUB_CHAR = 6.7 // px per character at 11px mono

function scales(title: string, sub: string | undefined, w: number) {
  const avail = w - 20
  const t = Math.min(1, avail / (title.length * TITLE_CHAR))
  const s = sub ? Math.min(1, avail / (sub.length * SUB_CHAR)) : 1
  return { title: Math.max(t, 0.72), sub: Math.max(s, 0.78) }
}

const PAD = 20
const SIDE_GAP = 54
const SIDE_H = 46
const G_TOP = 32
const G_BOT = 18
const NOTE_LINE = 15
const CHAR = 6.3 // px per character of the 11px mono label

/** Break a note into lines of at most `max` characters, at spaces. */
function wrapLines(text: string, max: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line)
      line = word
    } else line = line ? `${line} ${word}` : word
  }
  if (line) lines.push(line)
  return lines
}

const noteHeight = (lines: number) => (lines ? lines * NOTE_LINE + 18 : 0)

/** Main row left to right, side nodes above and below, group as a dashed box. */
export function layoutWide(spec: ArchSpec): DiagramModel {
  const NW = 164
  const NH = 66
  const GAP = 58
  const SW = 204
  const n = spec.path.length
  const xStart = PAD + 14
  const xs = spec.path.map((_, i) => xStart + i * (NW + GAP))
  const width = xs[n - 1] + NW + PAD + 14
  const noteLines = spec.note
    ? wrapLines(spec.note, Math.floor((width - PAD * 2) / CHAR))
    : []

  const g = spec.group ?? null
  const yAbove = PAD
  const yGroupTop = spec.above ? yAbove + SIDE_H + SIDE_GAP : PAD
  const yPath = g ? yGroupTop + G_TOP : yGroupTop
  const yGroupBottom = yPath + NH + G_BOT
  const rowBottom = g ? yGroupBottom : yPath + NH
  const yBelow = rowBottom + SIDE_GAP
  const height =
    (spec.below ? yBelow + SIDE_H : rowBottom) +
    noteHeight(noteLines.length) +
    PAD

  const boxes: Box[] = spec.path.map((nd, i) => ({
    x: xs[i],
    y: yPath,
    w: NW,
    h: NH,
    title: nd.title,
    sub: nd.sub,
    hot: !!nd.hot,
    scale: scales(nd.title, nd.sub, NW),
  }))
  const arrows: Arrow[] = []
  const labels: Label[] = []

  if (spec.flow !== false) {
    for (let i = 0; i < n - 1; i++) {
      const hot = !!(spec.path[i].hot && spec.path[i + 1].hot)
      const x1 = xs[i] + NW
      const x2 = xs[i + 1]
      arrows.push({
        line: [
          [x1, yPath + NH / 2],
          [x2 - 1, yPath + NH / 2],
        ],
        head: { x: x2, y: yPath + NH / 2, dir: 'r' },
        hot,
      })
    }
  }

  const groupBox = g
    ? {
        x: xs[g.from] - 14,
        y: yGroupTop,
        w: xs[g.to] + NW + 14 - (xs[g.from] - 14),
        h: yGroupBottom - yGroupTop,
        label: g.label,
      }
    : null

  const side = (which: 'above' | 'below') => {
    const sd = spec[which]
    if (!sd) return
    const cx = xs[sd.at] + NW / 2
    const sx = Math.min(Math.max(cx - SW / 2, 6), width - SW - 6)
    const sy = which === 'above' ? yAbove : yBelow
    boxes.push({
      x: sx,
      y: sy,
      w: SW,
      h: SIDE_H,
      title: sd.title,
      sub: sd.sub,
      hot: false,
      scale: scales(sd.title, sd.sub, SW),
    })
    const targetY =
      which === 'above'
        ? groupBox
          ? yGroupTop
          : yPath
        : groupBox
          ? yGroupBottom
          : yPath + NH
    const sideEdge = which === 'above' ? sy + SIDE_H : sy
    const pointsAtMain = sd.dir !== 'out'
    const up = which === 'below'
    arrows.push({
      line: [
        [cx, sideEdge],
        [cx, targetY],
      ],
      head: pointsAtMain
        ? { x: cx, y: targetY, dir: up ? 'u' : 'd' }
        : { x: cx, y: sideEdge, dir: up ? 'd' : 'u' },
      hot: false,
    })
    if (sd.label) {
      labels.push({
        x: cx + 10,
        y: (sideEdge + targetY) / 2 + 4,
        text: sd.label,
        anchor: 'start',
      })
    }
  }
  side('above')
  side('below')

  noteLines.forEach((text, i) => {
    labels.push({
      x: PAD,
      y: height - PAD - (noteLines.length - 1 - i) * NOTE_LINE - 2,
      text,
      anchor: 'start',
    })
  })
  return { width, height, boxes, arrows, group: groupBox, labels }
}

/** The same diagram stacked top to bottom for narrow screens. */
export function layoutTall(spec: ArchSpec): DiagramModel {
  const NW = 176
  const NH = 58
  const GAP = 40
  const SW = 150
  const SH = 50
  const n = spec.path.length
  const xMain = 12
  const xSide = xMain + NW + 44
  const width = xSide + SW + 8
  const noteLines = spec.note
    ? wrapLines(spec.note, Math.floor((width - PAD * 2 + 8) / CHAR))
    : []
  const g = spec.group ?? null

  const groupPadTop = g ? G_TOP : 0
  const ys: number[] = []
  let y = PAD
  spec.path.forEach((_, i) => {
    if (g && i === g.from) y += groupPadTop
    ys.push(y)
    y += NH
    if (g && i === g.to) y += G_BOT
    y += GAP
  })
  const bottom = y - GAP
  const height =
    bottom + noteHeight(noteLines.length) + (noteLines.length ? 14 : 0) + PAD

  const boxes: Box[] = spec.path.map((nd, i) => ({
    x: xMain,
    y: ys[i],
    w: NW,
    h: NH,
    title: nd.title,
    sub: nd.sub,
    hot: !!nd.hot,
    scale: scales(nd.title, nd.sub, NW),
  }))
  const arrows: Arrow[] = []
  const labels: Label[] = []

  if (spec.flow !== false) {
    for (let i = 0; i < n - 1; i++) {
      const hot = !!(spec.path[i].hot && spec.path[i + 1].hot)
      const cx = xMain + NW / 2
      const y1 = ys[i] + NH
      const y2 = ys[i + 1]
      arrows.push({
        line: [
          [cx, y1],
          [cx, y2 - 1],
        ],
        head: { x: cx, y: y2, dir: 'd' },
        hot,
      })
    }
  }

  const groupBox = g
    ? {
        x: xMain - 8,
        y: ys[g.from] - G_TOP,
        w: NW + 16,
        h: ys[g.to] + NH + G_BOT - (ys[g.from] - G_TOP),
        label: g.label,
      }
    : null

  ;(['above', 'below'] as const).forEach((which) => {
    const sd = spec[which]
    if (!sd) return
    // Side nodes sit to the right of their target, above or below its midline.
    const ty = ys[sd.at] + NH / 2
    // Two side nodes on one main node leave room between them for their words.
    const sy = which === 'above' ? ty - SH - 16 : ty + 16
    const sameRow = spec.above && spec.below && spec.above.at === spec.below.at
    const syFinal = sameRow ? sy : ty - SH / 2
    boxes.push({
      x: xSide,
      y: syFinal,
      w: SW,
      h: SH,
      title: sd.title,
      sub: sd.sub,
      hot: false,
      scale: scales(sd.title, sd.sub, SW),
    })
    const lineY = syFinal + SH / 2
    const x1 = xSide
    const x2 = xMain + NW
    const pointsAtMain = sd.dir !== 'out'
    arrows.push({
      line: [
        [x1, lineY],
        [x2 + 1, lineY],
      ],
      head: pointsAtMain
        ? { x: x2, y: lineY, dir: 'l' }
        : { x: x1, y: lineY, dir: 'r' },
      hot: false,
    })
    // The word sits above the side node, clear of the arrow and the group box.
    if (sd.label) {
      labels.push({
        x: xSide + SW / 2,
        y: syFinal - 6,
        text: sd.label,
        anchor: 'middle',
      })
    }
  })

  noteLines.forEach((text, i) => {
    labels.push({
      x: PAD - 8,
      y: height - PAD - (noteLines.length - 1 - i) * NOTE_LINE - 2,
      text,
      anchor: 'start',
    })
  })
  return { width, height, boxes, arrows, group: groupBox, labels }
}

/** A sentence for screen readers. */
export function describe(name: string, spec: ArchSpec): string {
  const parts = spec.path.map((p) => p.title).join(', then ')
  const extra = [spec.above, spec.below]
    .filter((x): x is NonNullable<typeof x> => !!x)
    .map((x) => `${x.title}${x.label ? ` (${x.label})` : ''}`)
    .join(' and ')
  return `Architecture for ${name}: ${parts}.${extra ? ` Also ${extra}.` : ''}${spec.note ? ` ${spec.note}` : ''}`
}
