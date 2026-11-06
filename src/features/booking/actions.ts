'use server'

import { headers } from 'next/headers'

import { createCalBooking, getPublicEventTypeIds } from '@/lib/integrations'

export type BookSlotInput = {
  eventTypeId: number
  /** Slot start, epoch milliseconds. */
  start: number
  name: string
  email: string
  notes: string
  timeZone: string
  /** Honeypot: real visitors never see or fill this. */
  website: string
}

export type BookSlotResult =
  { ok: true; uid: string; pending: boolean } | { ok: false; error: string }

const FAILED = 'Could not book that time. Please try another or email me.'
const MAX_PER_HOUR = 5
const HOUR = 3_600_000
const MAX_DAYS_AHEAD = 90

// Best effort only: each server instance keeps its own counts.
const attempts = new Map<string, number[]>()

function allowed(ip: string): boolean {
  const now = Date.now()
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < HOUR)
  if (recent.length >= MAX_PER_HOUR) return false
  attempts.set(ip, [...recent, now])
  return true
}

const validZone = (zone: string) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone })
    return true
  } catch {
    return false
  }
}

/** Book a public event type. Never trusts the client: re-checks everything. */
export async function bookSlot(input: BookSlotInput): Promise<BookSlotResult> {
  const name = String(input.name ?? '').trim()
  const email = String(input.email ?? '').trim()
  const notes = String(input.notes ?? '')
    .trim()
    .slice(0, 1000)
  const now = Date.now()

  if (input.website) return { ok: false, error: FAILED }
  if (name.length < 1 || name.length > 100) {
    return { ok: false, error: 'Please enter your name.' }
  }
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  if (
    !Number.isInteger(input.start) ||
    input.start <= now ||
    input.start > now + MAX_DAYS_AHEAD * 86_400_000 ||
    !validZone(input.timeZone)
  ) {
    return { ok: false, error: FAILED }
  }

  const h = await headers()
  const ip =
    h.get('cf-connecting-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  if (!allowed(ip)) {
    return { ok: false, error: 'Too many attempts. Please try again later.' }
  }

  const publicIds = await getPublicEventTypeIds()
  if (!publicIds.includes(input.eventTypeId))
    return { ok: false, error: FAILED }

  const outcome = await createCalBooking({
    eventTypeId: input.eventTypeId,
    start: input.start,
    name,
    email,
    notes,
    timeZone: input.timeZone,
  })
  if (outcome.ok)
    return { ok: true, uid: outcome.uid, pending: outcome.pending }
  return {
    ok: false,
    error:
      outcome.reason === 'unavailable'
        ? 'That time was just taken. Please pick another.'
        : FAILED,
  }
}
