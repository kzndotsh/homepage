'use client'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { useMemo, useRef, useState } from 'react'

import { gmtLabel } from '../slots'
import { buildZoneOptions } from '../timezones'

import s from '../booking.module.css'

const pretty = (zone: string) => zone.replaceAll('_', ' ')

/** A searchable timezone picker: the visitor's and the host's first, then the main zones by offset. */
export function TimeZoneSelect({
  value,
  host,
  detected,
  ready,
  at,
  onChange,
}: {
  value: string
  host: string
  /** The visitor's browser timezone. */
  detected: string
  /** False until mounted; the full list is built in the browser only. */
  ready: boolean
  /** An instant to read UTC offsets at (daylight saving changes them). */
  at: number
  onChange: (zone: string) => void
}) {
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)

  const options = useMemo(
    () => (ready ? buildZoneOptions({ detected, host, value, at }) : []),
    [ready, detected, host, value, at],
  )

  // The closed field is narrow, so show the city and offset only.
  const label = `${gmtLabel(value, at)} ${pretty(value.split('/').pop() ?? value)}`
  const needle = query.trim().toLowerCase().replaceAll('_', ' ')
  const shown = needle
    ? options.filter((o) => o.search.includes(needle))
    : options

  return (
    <Combobox
      value={value}
      immediate
      onChange={(zone: string | null) => {
        if (!zone) return
        onChange(zone)
        // Picked: leave the field, so it stops looking focused or selected.
        // Headless UI hands focus back to the field as it closes, so wait for that.
        setTimeout(() => {
          input.current?.blur()
          window.getSelection()?.removeAllRanges()
        }, 80)
      }}
      onClose={() => setQuery('')}
    >
      <div className={s.zoneBox}>
        <ComboboxInput
          ref={input}
          className={s.zone}
          aria-label={`Timezone, ${label}`}
          // The current zone shows as the placeholder, so the box is empty to
          // type into: no text to select or edit around.
          placeholder={label}
          data-1p-ignore
          data-lpignore="true"
          data-bwignore="true"
          autoComplete="off"
          displayValue={() => ''}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ComboboxButton className={s.zoneToggle} aria-label="Show timezones">
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
            <path d="m6 9 6 6 6-6" />
          </svg>
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor={{ to: 'bottom start', gap: 6 }}
        className={s.zoneList}
      >
        {shown.length === 0 ? (
          <div className={s.zoneEmpty}>No timezone matches.</div>
        ) : (
          shown.map((o) => (
            <ComboboxOption
              key={o.value}
              value={o.value}
              className={s.zoneOption}
            >
              {o.label}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  )
}
