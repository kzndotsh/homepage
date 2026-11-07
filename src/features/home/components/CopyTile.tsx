'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import s from '../home.module.css'

/** A contact row for something with no link: click to copy the value. */
export function CopyTile({
  icon,
  name,
  note,
  text,
  brand,
}: {
  icon: ReactNode
  name: string
  note: string
  text: string
  brand: string
}) {
  const [done, setDone] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setDone(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setDone(false), 1600)
  }

  return (
    <button type="button" className={s.sign} onClick={copy}>
      <span
        className={s.signIcon}
        style={{
          background: `var(--brand-${brand}-bg)`,
          color: `var(--brand-${brand}-fg)`,
        }}
      >
        {icon}
      </span>
      <span className={s.signName}>{name}</span>
      <span className={s.signNote}>{done ? 'Copied' : note}</span>
      {!done && <span className="sr-only">, click to copy</span>}
      <svg
        className={s.signCopy}
        data-done={done}
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
      >
        {done ? (
          <path d="M3 8.5l3.2 3.2L13 4.5" />
        ) : (
          <>
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5V9A1.5 1.5 0 0 0 4 10.5h1.5" />
          </>
        )}
      </svg>
    </button>
  )
}
