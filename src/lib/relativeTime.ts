type Instant = string | number | Date

/** Short elapsed time between two instants: "5m", "3h", "2d". */
export function relativeTime(from: Instant, to: Instant): string {
  const diff = Math.max(0, new Date(to).getTime() - new Date(from).getTime())
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${Math.max(1, minutes)}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}
