// Pure layout for the genre map: squarified tiles and label fitting.

export type Rect = { x: number; y: number; w: number; h: number }
export type Item = { name: string; weight: number; share?: number }

function worst(row: number[], side: number): number {
  const sum = row.reduce((a, b) => a + b, 0)
  const mx = Math.max(...row)
  const mn = Math.min(...row)
  return Math.max(
    (side * side * mx) / (sum * sum),
    (sum * sum) / (side * side * mn),
  )
}

// Squarified treemap; items must be sorted descending.
export function squarify(items: Item[], box: Rect): (Item & Rect)[] {
  const total = items.reduce((a, b) => a + b.weight, 0)
  const scale = (box.w * box.h) / total
  const areas = items.map((i) => i.weight * scale)
  const out: (Item & Rect)[] = []
  let { x, y, w, h } = box
  let i = 0
  while (i < items.length) {
    const side = Math.min(w, h)
    let j = i + 1
    while (
      j < items.length &&
      worst(areas.slice(i, j + 1), side) <= worst(areas.slice(i, j), side)
    ) {
      j++
    }
    const row = areas.slice(i, j)
    const rs = row.reduce((a, b) => a + b, 0)
    if (w >= h) {
      const rw = rs / h
      let cy = y
      for (const [k, a] of row.entries()) {
        out.push({ ...items[i + k], x, y: cy, w: rw, h: a / rw })
        cy += a / rw
      }
      x += rw
      w -= rw
    } else {
      const rh = rs / w
      let cx = x
      for (const [k, a] of row.entries()) {
        out.push({ ...items[i + k], x: cx, y, w: a / rh, h: rh })
        cx += a / rh
      }
      y += rh
      h -= rh
    }
    i = j
  }
  return out
}

export const PAD = 9
const CHAR = 0.58 // average glyph width as a fraction of the font size
export const LEADING = 1.18

// Break a label into lines of at most `max` characters, at spaces and hyphens
// only. Returns null when a single word is wider than the tile, so the caller
// tries a smaller font or drops the tile (the genre then goes in the "Also" line).
function wrap(name: string, max: number): string[] | null {
  const words = name.split(/(?<=[-\s])/).map((w) => w.trimEnd())
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if (word.length > max) return null
    // Hyphenated words rejoin without a space ('post-' + 'hardcore').
    const joined = line
      ? line.endsWith('-')
        ? `${line}${word}`
        : `${line} ${word}`
      : word
    if (joined.length <= max || !line) {
      line = joined
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

// Label size follows the tile's size, so tiles of similar size get similar type
// (a name that wraps easily does not get bigger text than one that cannot).
// The target is about 0.17 x the tile's average side, between 11 and 19px; the
// label then shrinks only as far as needed to fit whole words.
const SIZE_PER_SIDE = 0.17

export function fitLabel(
  name: string,
  w: number,
  h: number,
): { fs: number; lines: string[] } | null {
  const target = Math.min(
    19,
    Math.max(11, Math.round(Math.sqrt(w * h) * SIZE_PER_SIDE)),
  )
  for (let fs = target; fs >= 10; fs -= 1) {
    const max = Math.floor((w - PAD * 2) / (fs * CHAR))
    if (max < 2) continue
    const lines = wrap(name, max)
    if (lines && lines.length * fs * LEADING + PAD * 2 <= h) {
      return { fs, lines }
    }
  }
  return null
}
