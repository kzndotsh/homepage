'use client'

import { useEffect } from 'react'

import s from '../resume.module.css'

const toggles = (scope: string) =>
  document.querySelectorAll<HTMLDetailsElement>(`${scope} details`)

/** Open or close every role at once. Everything opens when the page is printed. */
export function ExpandControls({ scope }: { scope: string }) {
  useEffect(() => {
    const open = () => toggles(scope).forEach((d) => (d.open = true))
    window.addEventListener('beforeprint', open)
    return () => window.removeEventListener('beforeprint', open)
  }, [scope])

  const set = (value: boolean) =>
    toggles(scope).forEach((d) => (d.open = value))

  return (
    <div className={s.expand}>
      <button type="button" onClick={() => set(true)}>
        Expand all
      </button>
      <button type="button" onClick={() => set(false)}>
        Collapse all
      </button>
    </div>
  )
}
