'use client'

import { useSyncExternalStore } from 'react'

import { openPalette } from './CommandPalette'

import s from '../home.module.css'

/** The nav button that opens the command menu. Shows ⌘K on a Mac, Ctrl K elsewhere. */
export function PaletteTrigger() {
  const mac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  )

  return (
    <button
      type="button"
      className={s.cpTrigger}
      onClick={openPalette}
      aria-label="Open the command menu"
      aria-keyshortcuts="Control+K Meta+K"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <circle
          cx="7"
          cy="7"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10.5 10.5L14 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className={s.cpTriggerText}>Search</span>
      <kbd className={s.cpKbdGroup}>
        <kbd className={s.cpKbd}>{mac ? '⌘' : 'Ctrl'}</kbd>
        <kbd className={s.cpKbd}>K</kbd>
      </kbd>
    </button>
  )
}
