'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import { person } from '@/content/person'

import s from '../home.module.css'

type Group = 'Go to' | 'Copy' | 'Open' | 'Fun'

type Cmd = {
  id: string
  group: Group
  label: string
  /** Muted text on the right. */
  hint?: string
  /** Extra words the search also matches. */
  keywords?: string
  run: () => void
}

const OPEN_EVENT = 'kzn:open-palette'
const RAIN_EVENT = 'kzn:rain-eggs'

const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function jump(id: string) {
  document.querySelector(`#${id}`)?.scrollIntoView({
    behavior: calm() ? 'auto' : 'smooth',
    block: 'start',
  })
  history.replaceState(null, '', `#${id}`)
}

const external = (href: string) => () => {
  window.open(href, '_blank', 'noreferrer')
}
const same = (href: string) => () => {
  window.location.href = href
}

/** Opens the palette from anywhere (the nav button uses this). */
export const openPalette = () => {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement &&
  (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))

/**
 * ⌘K or Ctrl+K (or "/") opens a menu that jumps to any section, copies the
 * email or Discord name, opens an account, or makes it rain eggs.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [at, setAt] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const from = useRef<HTMLElement | null>(null)
  const uid = useId()

  const copy = useCallback(
    (text: string, what: string) => () => {
      void navigator.clipboard.writeText(text).then(
        () => setToast(`Copied ${what}`),
        () => setToast('Could not copy'),
      )
    },
    [],
  )

  const cmds = useMemo<Cmd[]>(() => {
    const l = person.links
    const go = (id: string, label: string, keywords: string): Cmd => ({
      id: `go-${id}`,
      group: 'Go to',
      label,
      hint: `#${id}`,
      keywords,
      run: () => jump(id),
    })
    const link = (
      id: string,
      label: string,
      href: string,
      keywords = '',
    ): Cmd => ({
      id: `open-${id}`,
      group: 'Open',
      label,
      hint: href.replace(/^https?:\/\/(www\.)?/, ''),
      keywords,
      run: href.startsWith('/') ? same(href) : external(href),
    })
    return [
      go('projects', 'Projects', 'work what i have been working on featured'),
      go('live', 'Code activity', 'github commits shipping live work heatmap'),
      go('setup', 'Setup', 'dotfiles nixos sway desktop waybar fetch'),
      go('music', 'Playlists and listening', 'music spotify last.fm songs'),
      go('library', 'Books and watching', 'library hardcover trakt reading tv'),
      go('experience', 'Resume', 'experience timeline jobs work history'),
      go('schedule-a-call', 'Schedule a call', 'book calendar meeting cal'),
      go(
        'contact',
        'Connect with me',
        'get in touch contact email social links',
      ),
      go('api', 'The API', 'api json endpoints resume lastfm playground'),
      {
        id: 'copy-email',
        group: 'Copy',
        label: 'Copy email address',
        hint: person.email,
        keywords: 'mail',
        run: copy(person.email, 'email'),
      },
      {
        id: 'copy-discord',
        group: 'Copy',
        label: 'Copy Discord username',
        hint: person.discord,
        run: copy(person.discord, 'Discord username'),
      },
      link('resume', 'Resume (PDF)', l.resume, 'cv download'),
      link('github', 'GitHub', l.github, 'code'),
      link('linkedin', 'LinkedIn', l.linkedin, 'career'),
      link('x', 'X', l.x, 'twitter'),
      link('instagram', 'Instagram', l.instagram),
      link('spotify', 'Spotify', l.spotify),
      link('lastfm', 'Last.fm', l.lastfm, 'scrobbles'),
      link('hardcover', 'Hardcover', l.hardcover, 'books'),
      link('trakt', 'Trakt', l.trakt, 'tv movies'),
      link('cal', 'Cal.com', l.cal, 'book'),
      link('llms', 'llms.txt', '/llms.txt', 'machines agents markdown'),
      {
        id: 'fun-eggs',
        group: 'Fun',
        label: 'Make it rain eggs',
        keywords: 'easter egg surprise',
        run: () => {
          window.dispatchEvent(new Event(RAIN_EVENT))
        },
      },
    ]
  }, [copy])

  const shown = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return cmds
    const hay = (c: Cmd) =>
      `${c.label} ${c.group} ${c.keywords ?? ''} ${c.hint ?? ''}`.toLowerCase()
    const hits = cmds.filter((c) => words.every((w) => hay(c).includes(w)))
    const first = words[0]
    // Label matches that start with the query come first.
    return [
      ...hits.filter((c) => c.label.toLowerCase().startsWith(first)),
      ...hits.filter((c) => !c.label.toLowerCase().startsWith(first)),
    ]
  }, [cmds, q])

  const active = Math.min(at, Math.max(0, shown.length - 1))

  const close = useCallback(() => {
    setOpen(false)
    from.current?.focus?.()
  }, [])

  const run = (c: Cmd) => {
    setOpen(false)
    // Let the dialog unmount first so scroll and focus are not fighting it.
    requestAnimationFrame(() => c.run())
  }

  // Open and close from the keyboard, or from the nav button.
  useEffect(() => {
    const show = () => {
      const focused = document.activeElement
      from.current = focused instanceof HTMLElement ? focused : null
      setQ('')
      setAt(0)
      setOpen(true)
    }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) close()
        else show()
      } else if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !open &&
        !isTyping(e.target)
      ) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_EVENT, show)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_EVENT, show)
    }
  }, [open, close])

  // While open: focus the field, hold the page still.
  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [open])

  // Keep the highlighted row in view.
  useEffect(() => {
    list.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
    // Runs when the highlight or the filtered list changes; neither is read inside.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [active, shown])

  // The toast clears itself.
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  let lastGroup: Group | null = null

  return (
    <>
      {open && (
        // Clicking the backdrop is a mouse shortcut; Escape closes it from the keyboard.
        // oxlint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={s.cpOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the keys typed in the field bubble up to this handler */}
          <div
            className={s.cpDialog}
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault()
                close()
              } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setAt((active + 1) % Math.max(1, shown.length))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setAt((active - 1 + shown.length) % Math.max(1, shown.length))
              } else if (e.key === 'Enter' && shown[active]) {
                e.preventDefault()
                run(shown[active])
              }
            }}
          >
            <div className={s.cpBar}>
              <svg
                viewBox="0 0 16 16"
                width="15"
                height="15"
                aria-hidden="true"
              >
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
              <input
                ref={input}
                className={s.cpInput}
                value={q}
                placeholder="Go to, copy, open…"
                role="combobox"
                aria-expanded="true"
                aria-controls={`${uid}-list`}
                aria-activedescendant={
                  shown[active] ? `${uid}-${shown[active].id}` : undefined
                }
                aria-label="Search commands"
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => {
                  setQ(e.target.value)
                  setAt(0)
                }}
              />
              <kbd className={s.cpKbd}>esc</kbd>
            </div>
            <ul
              ref={list}
              id={`${uid}-list`}
              // A combobox popup: focus stays in the input, which points at the active option.
              // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="listbox"
              aria-label="Commands"
              className={s.cpList}
            >
              {shown.map((c, n) => {
                const head = c.group !== lastGroup
                lastGroup = c.group
                return (
                  <li key={c.id} role="presentation">
                    {head && <p className={s.cpGroup}>{c.group}</p>}
                    {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- options are driven from the input (aria-activedescendant), so they are not focusable */}
                    <div
                      id={`${uid}-${c.id}`}
                      role="option"
                      aria-selected={n === active}
                      className={s.cpRow}
                      onMouseMove={() => {
                        if (n !== active) setAt(n)
                      }}
                      onClick={() => run(c)}
                    >
                      <span className={s.cpLabel}>{c.label}</span>
                      {c.hint && <span className={s.cpHint}>{c.hint}</span>}
                      {n === active && <kbd className={s.cpKbd}>↵</kbd>}
                    </div>
                  </li>
                )
              })}
              {shown.length === 0 && (
                <li role="presentation" className={s.cpEmpty}>
                  Nothing matches &ldquo;{q}&rdquo;.
                </li>
              )}
            </ul>
            <div className={s.cpFoot} aria-hidden="true">
              <span>
                <kbd className={s.cpKbd}>↑</kbd>
                <kbd className={s.cpKbd}>↓</kbd> move
              </span>
              <span>
                <kbd className={s.cpKbd}>↵</kbd> choose
              </span>
            </div>
          </div>
        </div>
      )}
      <div className={s.cpToast} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}
