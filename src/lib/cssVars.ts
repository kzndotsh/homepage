import type { CSSProperties } from 'react'

/** Inline style for custom properties (`--name`), which CSSProperties does not list. */
export function cssVars(vars: Record<`--${string}`, string>): CSSProperties {
  return vars
}
