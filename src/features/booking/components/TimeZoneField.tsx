'use client'

import {
  type ComponentProps,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react'

import { gmtLabel } from '../slots'

import s from '../booking.module.css'

const TimeZoneSelect = lazy(async () =>
  import('./TimeZoneSelect').then((m) => ({ default: m.TimeZoneSelect })),
)

type Props = ComponentProps<typeof TimeZoneSelect>

const pretty = (zone: string) => zone.replaceAll('_', ' ')

/** How far below the screen the field may be before its picker starts loading. */
const LOAD_MARGIN = '400px'

/** A read-only field the size of the picker, shown until the picker arrives. */
function Placeholder({
  label,
  ref,
}: {
  label: string
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div ref={ref} className={s.zoneBox}>
      <input
        className={s.zone}
        aria-label={`Timezone, ${label}`}
        placeholder={label}
        readOnly
        tabIndex={-1}
      />
    </div>
  )
}

/**
 * The timezone picker without Headless UI in the first bundle: a field of the
 * same size shows until the booking form is about to scroll into view, and only
 * then does the picker's chunk download and take its place.
 */
export function TimeZoneField(props: Props) {
  const label = `${gmtLabel(props.value, props.at)} ${pretty(props.value.split('/').pop() ?? props.value)}`
  const [near, setNear] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el || near) return
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true)
      },
      { rootMargin: LOAD_MARGIN },
    )
    watch.observe(el)
    return () => watch.disconnect()
  }, [near])

  if (!near) return <Placeholder ref={box} label={label} />
  return (
    <Suspense fallback={<Placeholder label={label} />}>
      <TimeZoneSelect {...props} />
    </Suspense>
  )
}
