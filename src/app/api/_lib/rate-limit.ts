export const LIMIT = 60
const WINDOW_MS = 60_000
const MAX_TRACKED = 5_000

type Slot = { count: number; resetAt: number }

// Best effort only: each server instance keeps its own counts.
const slots = new Map<string, Slot>()

export type Verdict = {
  ok: boolean
  remaining: number
  /** Seconds until the window resets. */
  reset: number
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

/** Fixed window: LIMIT requests per minute per client. */
export function hit(key: string, now = Date.now()): Verdict {
  if (slots.size > MAX_TRACKED) {
    for (const [k, v] of slots) if (v.resetAt <= now) slots.delete(k)
    if (slots.size > MAX_TRACKED) slots.clear()
  }
  let slot = slots.get(key)
  if (!slot || slot.resetAt <= now) {
    slot = { count: 0, resetAt: now + WINDOW_MS }
    slots.set(key, slot)
  }
  slot.count++
  return {
    ok: slot.count <= LIMIT,
    remaining: Math.max(0, LIMIT - slot.count),
    reset: Math.ceil((slot.resetAt - now) / 1000),
  }
}
