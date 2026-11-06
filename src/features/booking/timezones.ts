import { gmtLabel, offsetMinutes } from './slots'

/**
 * The zones people actually pick, in priority order, each with the cities it
 * stands for. Zones that keep the same UTC offset all year are interchangeable,
 * so they share one entry in the picker (see buildZoneOptions).
 */
const MAIN_ZONES: [zone: string, cities: string][] = [
  ['Pacific/Honolulu', 'Honolulu'],
  ['America/Anchorage', 'Anchorage'],
  ['America/Los_Angeles', 'Los Angeles, Vancouver, Seattle'],
  ['America/Phoenix', 'Phoenix'],
  ['America/Denver', 'Denver, Calgary'],
  ['America/Chicago', 'Chicago, Dallas, Winnipeg'],
  ['America/Mexico_City', 'Mexico City'],
  ['America/New_York', 'New York, Toronto, Miami'],
  ['America/Bogota', 'Bogotá, Lima, Quito'],
  ['America/Halifax', 'Halifax'],
  ['America/St_Johns', "St. John's"],
  ['America/Sao_Paulo', 'São Paulo'],
  ['America/Argentina/Buenos_Aires', 'Buenos Aires'],
  ['Atlantic/Azores', 'Azores'],
  ['UTC', 'UTC, Reykjavík'],
  ['Europe/London', 'London, Dublin, Lisbon'],
  ['Africa/Lagos', 'Lagos, Kinshasa'],
  ['Europe/Paris', 'Paris, Berlin, Madrid, Rome'],
  ['Africa/Cairo', 'Cairo'],
  ['Africa/Johannesburg', 'Johannesburg'],
  ['Europe/Athens', 'Athens, Helsinki, Kyiv'],
  ['Europe/Istanbul', 'Istanbul, Moscow, Nairobi, Riyadh'],
  ['Asia/Tehran', 'Tehran'],
  ['Asia/Dubai', 'Dubai'],
  ['Asia/Karachi', 'Karachi, Tashkent'],
  ['Asia/Kolkata', 'Mumbai, Delhi, Kolkata'],
  ['Asia/Kathmandu', 'Kathmandu'],
  ['Asia/Dhaka', 'Dhaka'],
  ['Asia/Bangkok', 'Bangkok, Jakarta, Hanoi'],
  ['Asia/Singapore', 'Singapore, Kuala Lumpur, Perth'],
  ['Asia/Shanghai', 'Beijing, Shanghai, Hong Kong, Taipei'],
  ['Asia/Tokyo', 'Tokyo, Seoul'],
  ['Australia/Adelaide', 'Adelaide'],
  ['Australia/Brisbane', 'Brisbane'],
  ['Australia/Sydney', 'Sydney, Melbourne'],
  ['Pacific/Auckland', 'Auckland'],
]

export type ZoneOption = {
  /** IANA zone to use when this entry is picked. */
  value: string
  label: string
  /** Lowercase text the search box matches against. */
  search: string
}

const city = (zone: string) =>
  (zone.split('/').pop() ?? zone).replace(/_/g, ' ')

/** UTC offsets in January and July: equal signatures mean the same clock all year. */
const signature = (zone: string, year: number) =>
  `${offsetMinutes(zone, Date.UTC(year, 0, 15))}|${offsetMinutes(zone, Date.UTC(year, 6, 15))}`

/**
 * One picker entry per distinct clock, not per zone: Istanbul, Moscow and
 * Nairobi are all UTC+3 year-round, so listing them separately only adds
 * noise. Zones that observe daylight saving differently stay separate.
 * The visitor's own zone and the host's come first.
 */
export function buildZoneOptions({
  detected,
  host,
  value,
  at,
}: {
  detected: string
  host: string
  value: string
  /** An instant to read UTC offsets at. */
  at: number
}): ZoneOption[] {
  const year = new Date(at).getUTCFullYear()
  const known = new Map(MAIN_ZONES)

  type Group = { rep: string; zones: string[]; cities: string[] }
  const groups = new Map<string, Group>()
  const add = (zone: string, cities: string) => {
    const key = signature(zone, year)
    const g = groups.get(key)
    const names = cities.split(', ')
    if (g) {
      g.zones.push(zone)
      for (const n of names) if (!g.cities.includes(n)) g.cities.push(n)
    } else {
      groups.set(key, { rep: zone, zones: [zone], cities: names })
    }
  }

  // The visitor's and host's zones lead, so they represent their group.
  for (const z of [detected, host]) add(z, known.get(z) ?? city(z))
  for (const [z, cities] of MAIN_ZONES) add(z, cities)
  if (!groups.has(signature(value, year))) add(value, city(value))

  const first = [signature(detected, year), signature(host, year)]
  const order = [...groups.entries()].sort(([ka, a], [kb, b]) => {
    const pa = first.indexOf(ka)
    const pb = first.indexOf(kb)
    if (pa !== -1 || pb !== -1) {
      return (pa === -1 ? 9 : pa) - (pb === -1 ? 9 : pb)
    }
    return offsetMinutes(a.rep, at) - offsetMinutes(b.rep, at)
  })

  return order.map(([, g]) => {
    const you = g.zones.includes(detected)
    const hosts = g.zones.includes(host)
    const tag =
      you && hosts ? ' (you, host)' : you ? ' (you)' : hosts ? ' (host)' : ''
    const shown = g.cities.slice(0, 3).join(', ')
    return {
      value: g.rep,
      label: `${gmtLabel(g.rep, at)} ${shown}${tag}`,
      search:
        `${g.cities.join(' ')} ${g.zones.join(' ')} ${gmtLabel(g.rep, at)}`
          .toLowerCase()
          .replace(/_/g, ' '),
    }
  })
}
