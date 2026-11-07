'use client'

import { lazy, Suspense, type ComponentProps } from 'react'

import { gmtLabel } from '../slots'

import s from '../booking.module.css'

const TimeZoneSelect = lazy(async () =>
  import('./TimeZoneSelect').then((m) => ({ default: m.TimeZoneSelect })),
)

type Props = ComponentProps<typeof TimeZoneSelect>

const pretty = (zone: string) => zone.replaceAll('_', ' ')

/**
 * The timezone picker without Headless UI in the first bundle: a field of the
 * same size shows until the picker's chunk arrives, then it takes its place.
 */
export function TimeZoneField(props: Props) {
  const label = `${gmtLabel(props.value, props.at)} ${pretty(props.value.split('/').pop() ?? props.value)}`
  return (
    <Suspense
      fallback={
        <div className={s.zoneBox}>
          <input
            className={s.zone}
            aria-label={`Timezone, ${label}`}
            placeholder={label}
            readOnly
            tabIndex={-1}
          />
        </div>
      }
    >
      <TimeZoneSelect {...props} />
    </Suspense>
  )
}
