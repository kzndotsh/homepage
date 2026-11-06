import s from './ui.module.css'

/** A row of label/value stats. */
export function StatRow({
  items,
}: {
  items: readonly [label: string, value: string][]
}) {
  return (
    <dl className={s.stats}>
      {items.map(([label, value]) => (
        <div key={label} className={s.stat}>
          <dt>{label}</dt>
          <dd className={s.mono}>{value}</dd>
        </div>
      ))}
    </dl>
  )
}
