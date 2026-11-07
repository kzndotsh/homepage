'use client'

import { useMemo, useState, useTransition, type FormEvent } from 'react'

import { person } from '@/content'
import { useMounted } from '@/hooks/useMounted'
import type { CalAvailability } from '@/lib/integrations/types'
import ui from '@/components/ui/ui.module.css'

import { bookSlot } from '../actions'
import s from '../booking.module.css'
import { isoDate, longDate, monthAt, todayIn } from '../scheduling'
import {
  dayKeyOf,
  groupByDay,
  hostOffsetHint,
  parseDay,
  timeLabel,
  zoneAbbrev,
} from '../slots'
import { MonthGrid, MonthNav } from './MonthGrid'
import { DetailsColumn, PickColumns, SchedulerFrame } from './SchedulerFrame'
import { SchedulerIntro } from './SchedulerIntro'
import { TimeZoneField } from './TimeZoneField'

// Keep password managers from offering to sign in or fill on a booking form:
// 1Password, LastPass and Bitwarden each read their own attribute.
const NO_PASSWORD_MANAGER = {
  'data-1p-ignore': true,
  'data-lpignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other',
} as const

/** Real open times from Cal.com, in the visitor's timezone. */
export function Booker({ availability }: { availability: CalAvailability }) {
  const mounted = useMounted()
  const hostZone = availability.ownerTimeZone
  const detected = mounted
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : hostZone
  // The visitor can view the times in any timezone; the default is their own.
  const [chosenZone, setChosenZone] = useState<string | null>(null)
  const timeZone = chosenZone ?? detected

  const { eventTypes } = availability
  const [typeId, setTypeId] = useState(
    (eventTypes.find((t) => t.minutes === 30) ?? eventTypes[0]).id,
  )
  const type = eventTypes.find((t) => t.id === typeId) ?? eventTypes[0]

  const days = useMemo(
    () => groupByDay(type.slots, timeZone),
    [type.slots, timeZone],
  )
  const keys = useMemo(() => [...days.keys()].sort(), [days])
  const first = parseDay(keys[0])
  const last = parseDay(keys[keys.length - 1])
  const lastOffset = last.y * 12 + last.m - (first.y * 12 + first.m)

  const [offset, setOffset] = useState(0)
  const [pickedDay, setPickedDay] = useState<string | null>(null)
  const [pickedSlot, setPickedSlot] = useState<number | null>(null)

  // A choice made for one meeting length may not exist for another.
  const dayKey = pickedDay && days.has(pickedDay) ? pickedDay : null
  const times = dayKey ? (days.get(dayKey) ?? []) : []
  const slot =
    pickedSlot !== null && times.includes(pickedSlot) ? pickedSlot : null

  // An instant to read UTC offsets at: the chosen time, else the day's first.
  const refMs = slot ?? times[0] ?? type.slots[0]

  function changeZone(zone: string) {
    setChosenZone(zone)
    // Keep a chosen time selected: the same moment, on whichever day it falls now.
    const next = groupByDay(type.slots, zone)
    const nextKeys = [...next.keys()].sort()
    const nextFirst = parseDay(nextKeys[0])
    const target = slot !== null ? parseDay(dayKeyOf(slot, zone)) : nextFirst
    setPickedDay(slot !== null ? dayKeyOf(slot, zone) : null)
    setOffset(target.y * 12 + target.m - (nextFirst.y * 12 + nextFirst.m))
  }

  const [step, setStep] = useState<'pick' | 'details'>('pick')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [booked, setBooked] = useState<{
    uid: string
    email: string
    pending: boolean
  } | null>(null)

  // The month depends only on the slots, so it renders on the server too:
  // no skeleton, and nothing moves when the page hydrates.
  const view = monthAt(first, offset)
  const today = mounted ? todayIn(timeZone) : null

  const calUrl = dayKey
    ? `${type.url}?date=${dayKey}&month=${dayKey.slice(0, 7)}`
    : null

  // The details step needs a chosen time; without one, fall back to picking.
  const onDetails = step === 'details' && dayKey !== null && slot !== null

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (slot === null) return
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '')
    setError(null)
    startTransition(async () => {
      const result = await bookSlot({
        eventTypeId: type.id,
        start: slot,
        name: String(form.get('name') ?? ''),
        email,
        notes: String(form.get('notes') ?? ''),
        timeZone,
        website: String(form.get('website') ?? ''),
      })
      if (result.ok) {
        setBooked({ uid: result.uid, email, pending: result.pending })
      } else setError(result.error)
    })
  }

  if (booked && dayKey && slot !== null) {
    return (
      <div className={s.booked} role="status">
        <h3>{booked.pending ? 'Request sent' : "You're booked"}</h3>
        <p>
          {longDate(parseDay(dayKey))}, {timeLabel(slot, timeZone)} (
          {timeZone.replace('_', ' ')}), {type.minutes} minutes.
        </p>
        <p>
          {booked.pending
            ? `I will confirm by email at ${booked.email}.`
            : `A confirmation is on its way to ${booked.email}.`}
        </p>
        <a
          className={s.bookedLink}
          href={`https://cal.com/booking/${booked.uid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View, reschedule or cancel
        </a>
      </div>
    )
  }

  return (
    <SchedulerFrame
      intro={
        <SchedulerIntro
          host={person.name}
          title="Let's talk!"
          meta={[
            ...(onDetails
              ? [{ icon: 'clock' as const, text: `${type.minutes} min` }]
              : []),
            ...(type.location
              ? [{ icon: 'video' as const, text: type.location }]
              : []),
          ]}
          footer={
            <>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
              </svg>
              <TimeZoneField
                value={timeZone}
                host={hostZone}
                detected={detected}
                ready={mounted}
                at={refMs}
                onChange={changeZone}
              />
            </>
          }
        >
          {!onDetails && eventTypes.length > 1 && (
            <div className={s.slots} role="group" aria-label="Meeting length">
              {eventTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={t.id === type.id}
                  className={s.slot}
                  onClick={() => {
                    setTypeId(t.id)
                    setPickedSlot(null)
                  }}
                >
                  {t.minutes} min
                </button>
              ))}
            </div>
          )}
        </SchedulerIntro>
      }
      footer={
        onDetails ? undefined : slot === null || dayKey === null ? (
          <p aria-live="polite">Choose a day and a time.</p>
        ) : (
          <p aria-live="polite">
            {longDate(parseDay(dayKey))}, {timeLabel(slot, timeZone)}
            {timeZone !== hostZone && (
              <span className={s.inlineHint}>
                {timeLabel(slot, hostZone)} {zoneAbbrev(hostZone, slot)} for me
              </span>
            )}
          </p>
        )
      }
    >
      {onDetails ? (
        <DetailsColumn>
          <button
            type="button"
            className={s.backLink}
            onClick={() => {
              setError(null)
              setStep('pick')
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Change time
          </button>
          <p className={s.stepEyebrow}>Step 2 of 2</p>
          <h3 className={s.detailsTitle}>Your details</h3>
          <p className={s.summary} aria-live="polite">
            {longDate(parseDay(dayKey))}, {timeLabel(slot, timeZone)}
            <span className={s.hostHint}>
              {(timeZone.split('/').pop() ?? timeZone).replace(/_/g, ' ')},{' '}
              {type.minutes} min
              {timeZone !== hostZone &&
                ` · ${timeLabel(slot, hostZone)} ${zoneAbbrev(hostZone, slot)} for me`}
            </span>
          </p>
          <form
            className={s.bookForm}
            onSubmit={submit}
            {...NO_PASSWORD_MANAGER}
          >
            <input
              name="name"
              {...NO_PASSWORD_MANAGER}
              className={s.field}
              placeholder="Your name"
              autoComplete="name"
              autoFocus
              required
              maxLength={100}
              aria-label="Your name"
            />
            <input
              name="email"
              {...NO_PASSWORD_MANAGER}
              type="email"
              className={s.field}
              placeholder="Email"
              autoComplete="email"
              required
              maxLength={200}
              aria-label="Email"
            />
            <textarea
              name="notes"
              {...NO_PASSWORD_MANAGER}
              className={`${s.field} ${s.fieldWide} ${s.notes}`}
              placeholder="What is it about? (optional)"
              maxLength={1000}
              rows={4}
              aria-label="What is it about"
            />
            {/* Honeypot: hidden from people, tempting to bots. */}
            <input
              name="website"
              {...NO_PASSWORD_MANAGER}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className={s.hp}
            />
            <button
              type="submit"
              disabled={pending}
              className={`${ui.btn} ${ui.btnPrimary} ${s.bookSubmit}`}
            >
              {pending ? 'Booking…' : 'Book this time'}
            </button>
          </form>
          {error && (
            <p className={s.formError} role="alert">
              {error}
            </p>
          )}
          {calUrl && (
            <a
              className={s.bookedLink}
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Or finish on cal.com
            </a>
          )}
        </DetailsColumn>
      ) : (
        <PickColumns
          calendar={
            <>
              <MonthNav
                view={view}
                canPrev={offset > 0}
                canNext={offset < lastOffset}
                onPrev={() => setOffset((o) => Math.max(0, o - 1))}
                onNext={() => setOffset((o) => Math.min(lastOffset, o + 1))}
              />
              <MonthGrid
                view={view}
                today={today}
                selected={dayKey ? parseDay(dayKey) : null}
                isDisabled={(d) => !days.has(isoDate(d))}
                onPick={(d) => {
                  setPickedDay(isoDate(d))
                  // A time belongs to one day; do not carry it to the next.
                  setPickedSlot(null)
                }}
              />
            </>
          }
          slotHead={
            dayKey
              ? longDate(parseDay(dayKey)).replace(/^\w+, /, '')
              : 'Pick a day'
          }
          slotSub={
            timeZone !== hostZone && (
              <>
                Host {zoneAbbrev(hostZone, refMs)}:{' '}
                {hostOffsetHint(timeZone, hostZone, refMs)}
              </>
            )
          }
          slots={
            times.length === 0 ? (
              <p className={`${s.slotSub} ${ui.mono}`}>No day selected.</p>
            ) : (
              times.map((ms) =>
                slot === ms ? (
                  <div key={ms} className={s.slotPair}>
                    <button
                      type="button"
                      aria-pressed="true"
                      className={s.slot}
                      onClick={() => setPickedSlot(null)}
                    >
                      {timeLabel(ms, timeZone)}
                    </button>
                    <button
                      type="button"
                      className={s.slotNext}
                      onClick={() => setStep('details')}
                    >
                      Next
                    </button>
                  </div>
                ) : (
                  <button
                    key={ms}
                    type="button"
                    className={s.slot}
                    onClick={() => setPickedSlot(ms)}
                  >
                    {timeLabel(ms, timeZone)}
                  </button>
                ),
              )
            )
          }
        />
      )}
    </SchedulerFrame>
  )
}
