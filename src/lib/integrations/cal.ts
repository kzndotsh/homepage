import type { CalAvailability, CalEventType } from '@/lib/integrations/types'

const API = 'https://api.cal.com/v2'
// Cal.com versions each endpoint family separately.
const V_ME = '2024-08-13'
const V_EVENT_TYPES = '2026-06-12'
const V_SLOTS = '2024-09-04'
const V_BOOKINGS = '2026-02-25'
const WINDOW_DAYS = 45
const DAY = 86_400_000

type EventTypeResponse = {
  id: number
  slug: string
  title: string
  lengthInMinutes: number
  hidden?: boolean
  bookingUrl: string
  locations?: { type: string; integration?: string }[]
}
type SlotsResponse = Record<string, { start: string }[]>

const INTEGRATIONS: Record<string, string> = {
  'cal-video': 'Cal Video',
  'google-meet': 'Google Meet',
  zoom: 'Zoom',
  'daily-video': 'Daily Video',
}

// "cal-video" -> "Cal Video"; other location kinds read as a plain label.
function locationLabel(t: EventTypeResponse): string | null {
  const loc = t.locations?.[0]
  if (!loc) return null
  if (loc.integration) {
    return (
      INTEGRATIONS[loc.integration] ??
      loc.integration
        .replaceAll(/[-_]/g, ' ')
        .replaceAll(/\b\w/g, (c) => c.toUpperCase())
    )
  }
  return (
    { link: 'Online meeting', phone: 'Phone call', address: 'In person' }[
      loc.type
    ] ?? null
  )
}

const ymd = (ms: number, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ms)

async function calGet<T>(path: string, version: string): Promise<T | null> {
  const token = process.env.CAL_TOKEN
  if (!token) return null
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'cal-api-version': version },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) return null
  return ((await res.json()) as { data: T }).data
}

export async function fetchCalAvailability(): Promise<CalAvailability | null> {
  const get = calGet
  if (!process.env.CAL_TOKEN) return null

  try {
    const [me, types] = await Promise.all([
      get<{ timeZone: string }>('/me', V_ME),
      get<EventTypeResponse[]>('/event-types', V_EVENT_TYPES),
    ])
    const publicTypes = (types ?? []).filter((t) => !t.hidden)
    if (!me || publicTypes.length === 0) return null

    const now = Date.now()
    const start = ymd(now, me.timeZone)
    const end = ymd(now + WINDOW_DAYS * DAY, me.timeZone)

    const eventTypes = (
      await Promise.all(
        publicTypes.map(async (t): Promise<CalEventType | null> => {
          const days = await get<SlotsResponse>(
            `/slots?eventTypeId=${t.id}&start=${start}&end=${end}&timeZone=${encodeURIComponent(me.timeZone)}&format=range`,
            V_SLOTS,
          )
          if (!days) return null
          const slots = Object.values(days)
            .flat()
            .map((s) => Date.parse(s.start))
            .filter((ms) => Number.isFinite(ms))
            .sort((a, b) => a - b)
          return {
            id: t.id,
            slug: t.slug,
            title: t.title,
            minutes: t.lengthInMinutes,
            url: t.bookingUrl,
            location: locationLabel(t),
            slots,
          }
        }),
      )
    )
      .filter((t): t is CalEventType => t !== null && t.slots.length > 0)
      .sort((a, b) => a.minutes - b.minutes)

    if (eventTypes.length === 0) return null
    return {
      ownerTimeZone: me.timeZone,
      fetchedAt: new Date().toISOString(),
      eventTypes,
    }
  } catch {
    return null
  }
}

/** Ids of the public event types; hidden ones must never be bookable. */
export async function fetchPublicEventTypeIds(): Promise<number[]> {
  const types = await calGet<EventTypeResponse[]>('/event-types', V_EVENT_TYPES)
  return (types ?? []).filter((t) => !t.hidden).map((t) => t.id)
}

export type BookingRequest = {
  eventTypeId: number
  /** Slot start, epoch milliseconds. */
  start: number
  name: string
  email: string
  notes: string
  timeZone: string
}

export type BookingOutcome =
  // pending: the host must confirm first (an event type can require it).
  | { ok: true; uid: string; start: string; pending: boolean }
  | { ok: false; reason: 'unavailable' | 'failed' }

/** Create a booking on the owner's calendar. Cal.com sends the emails. */
export async function createCalBooking(
  req: BookingRequest,
): Promise<BookingOutcome> {
  const token = process.env.CAL_TOKEN
  if (!token) return { ok: false, reason: 'failed' }
  try {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'cal-api-version': V_BOOKINGS,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        start: new Date(req.start).toISOString(),
        eventTypeId: req.eventTypeId,
        attendee: {
          name: req.name,
          email: req.email,
          timeZone: req.timeZone,
          language: 'en',
        },
        bookingFieldsResponses: req.notes ? { notes: req.notes } : undefined,
      }),
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    })
    const json = (await res.json().catch(() => null)) as {
      status?: string
      data?: { uid?: string; start?: string; status?: string }
      error?: { message?: string } | string
      message?: string
    } | null

    if (res.ok && json?.status === 'success' && json.data?.uid) {
      return {
        ok: true,
        uid: json.data.uid,
        start: json.data.start ?? '',
        pending: json.data.status !== 'accepted',
      }
    }
    const message = JSON.stringify(json?.error ?? json?.message ?? '')
    // A slot taken since the page loaded comes back as a 4xx about availability.
    const taken =
      res.status < 500 && /available|booked|conflict|busy/i.test(message)
    return { ok: false, reason: taken ? 'unavailable' : 'failed' }
  } catch {
    return { ok: false, reason: 'failed' }
  }
}
