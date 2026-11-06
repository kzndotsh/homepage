'use client'

import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

import { cx } from '@/lib/cx'
import {
  MUSIC_KINDS,
  MUSIC_LIMITS,
  MUSIC_PERIODS,
  MUSIC_SECTIONS,
} from '@/lib/musicSections'
import { RESUME_SECTIONS } from '@/lib/resumeSections'

import s from '../home.module.css'
import ui from '@/components/ui/ui.module.css'

type Param = { key: string; options: readonly string[] }
type Endpoint = {
  path: string
  about: string
  params?: readonly Param[]
}

const ENDPOINTS: readonly Endpoint[] = [
  { path: '/api', about: 'index' },
  {
    path: '/api/v1/resume',
    about: 'who, where, what: JSON Resume',
    params: [{ key: 'section', options: RESUME_SECTIONS }],
  },
  { path: '/api/v1/playlists', about: 'always shuffle' },
  {
    path: '/api/v1/lastfm',
    about: 'last.fm: favorites, now playing, charts',
    params: [
      { key: 'section', options: MUSIC_SECTIONS },
      { key: 'period', options: MUSIC_PERIODS },
      { key: 'kind', options: MUSIC_KINDS },
      { key: 'limit', options: MUSIC_LIMITS },
    ],
  },
  { path: '/api/v1/github', about: 'recent activity' },
]

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const
type Method = (typeof METHODS)[number]

type Query = Record<string, { on: boolean; value: string }>

const initialQuery = (e: Endpoint): Query =>
  Object.fromEntries(
    (e.params ?? []).map((p) => [p.key, { on: false, value: p.options[0] }]),
  )

/** "?section=work" for the enabled params, or "". */
const queryString = (q: Query) => {
  const parts = Object.entries(q)
    .filter(([, v]) => v.on)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.value)}`)
  return parts.length ? `?${parts.join('&')}` : ''
}

const ORIGIN = 'https://kzn.sh'
const MAX_LINES = 300

const LANGS = [
  {
    id: 'curl',
    label: 'curl',
    code: (m: Method, u: string) =>
      m === 'GET' ? `curl ${u}` : `curl -X ${m} ${u}`,
  },
  {
    id: 'ts',
    label: 'TypeScript',
    code: (m: Method, u: string) =>
      m === 'GET'
        ? `const res = await fetch('${u}')
const data = await res.json()`
        : `const res = await fetch('${u}', { method: '${m}' })
const data = await res.json()`,
  },
  {
    id: 'py',
    label: 'Python',
    code: (m: Method, u: string) =>
      `import requests
data = requests.${m.toLowerCase()}("${u}").json()`,
  },
] as const

type Result = {
  status: number
  ok: boolean
  ms: number
  bytes: number
  body: string
}

/** Pretty-prints JSON when the body is JSON, otherwise returns it as is. */
function pretty(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2)
  } catch {
    return body
  }
}

function Json({ text }: { text: string }) {
  const lines = text.split('\n')
  const shown = lines.slice(0, MAX_LINES)
  return (
    <>
      {shown.map((line, i) => {
        const m = /^(\s*)("[^"]*")(: )(.*)$/.exec(line)
        return (
          <span key={i}>
            {m ? (
              <>
                {m[1]}
                <span className={s.k}>{m[2]}</span>
                {m[3]}
                {m[4]}
              </>
            ) : (
              line
            )}
            {'\n'}
          </span>
        )
      })}
      {lines.length > MAX_LINES && (
        <span className={s.apiMore}>
          {`… ${lines.length - MAX_LINES} more lines`}
        </span>
      )}
    </>
  )
}

const size = (n: number) =>
  n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} kB`

/** Icon button that copies text and shows a check for a moment. */
function CopyButton({
  text,
  label,
  className,
}: {
  text: string
  label: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      className={cx(s.apiCopy, className)}
      onClick={copy}
      aria-label={copied ? 'Copied' : `Copy ${label}`}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8.5l3.2 3.2L13 4.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
          <path d="M10.5 5.5v-2a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5V9A1.5 1.5 0 0 0 4 10.5h1.5" />
        </svg>
      )}
    </button>
  )
}

/** Pick an endpoint, read the request in three languages, send it for real. */
export function ApiPlayground() {
  const [sel, setSel] = useState(1)
  const [lang, setLang] = useState(0)
  const [busy, setBusy] = useState(false)
  const [method, setMethod] = useState<Method>('GET')
  const [query, setQuery] = useState<Query>(() => initialQuery(ENDPOINTS[1]))
  const [results, setResults] = useState<Record<string, Result | 'error'>>({})
  const run = useRef(0)

  const endpoint = ENDPOINTS[sel]
  const qs = queryString(query)
  const url = `${ORIGIN}${endpoint.path}${qs}`
  const result = results[endpoint.path]

  const send = async () => {
    const id = ++run.current
    const path = endpoint.path
    setBusy(true)
    const t0 = performance.now()
    try {
      const res = await fetch(`${path}${qs}`, {
        method,
        headers: { accept: 'application/json' },
      })
      const body = await res.text()
      const next: Result = {
        status: res.status,
        ok: res.ok,
        ms: Math.round(performance.now() - t0),
        bytes: new Blob([body]).size,
        body: pretty(body),
      }
      setResults((r) => ({ ...r, [path]: next }))
    } catch {
      setResults((r) => ({ ...r, [path]: 'error' }))
    }
    if (id === run.current) setBusy(false)
  }

  const pick = (i: number) => {
    run.current++
    setBusy(false)
    setSel(i)
    setQuery(initialQuery(ENDPOINTS[i]))
  }

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = LANGS.length - 1
    const next =
      e.key === 'ArrowRight'
        ? (lang + 1) % LANGS.length
        : e.key === 'ArrowLeft'
          ? (lang - 1 + LANGS.length) % LANGS.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1
    if (next < 0) return
    e.preventDefault()
    setLang(next)
    e.currentTarget.parentElement
      ?.querySelectorAll<HTMLElement>('[role="tab"]')
      [next]?.focus()
  }

  return (
    <div className={s.apiPlay}>
      <ul className={cx(s.apiList, ui.mono)} aria-label="Endpoints">
        {ENDPOINTS.map((e, i) => {
          const r = results[e.path]
          const on = i === sel
          return (
            <li key={e.path}>
              <button
                type="button"
                className={s.apiRow}
                aria-pressed={on}
                onClick={() => pick(i)}
              >
                <span className={s.apiPath} title={e.about}>
                  {e.path.replace('/api/v1', '') || '/api'}
                </span>
                {r && (
                  <span
                    className={cx(
                      s.apiChip,
                      r !== 'error' && (r.ok ? s.apiOk : s.apiBad),
                      r === 'error' && s.apiBad,
                    )}
                  >
                    {r === 'error' ? 'failed' : r.status}
                  </span>
                )}
              </button>
            </li>
          )
        })}
        <li className={s.apiExt}>
          <a href="/llms.txt" className={s.apiRow}>
            <span className={s.apiPath}>/llms.txt</span>
            <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>

      <div className={s.apiSide}>
        <div className={s.apiUrlRow}>
          <select
            className={cx(s.apiMethod, ui.mono)}
            data-m={method}
            value={method}
            aria-label="HTTP method"
            onChange={(e) => setMethod(e.target.value as Method)}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className={cx(s.apiUrl, ui.mono)} title={url}>
            {endpoint.path}
            <span className={s.apiUrlQuery}>{qs}</span>
          </div>
          <button
            type="button"
            className={s.apiSend}
            onClick={send}
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? 'Sending' : 'Send'}
          </button>
        </div>

        <div className={s.apiParams}>
          <p className={cx(s.apiParamsHead, ui.mono)}>Query params</p>
          {endpoint.params ? (
            endpoint.params.map((p) => {
              const q = query[p.key]
              return (
                <div key={p.key} className={cx(s.apiParam, ui.mono)}>
                  <input
                    type="checkbox"
                    checked={q.on}
                    aria-label={`Use ${p.key}`}
                    onChange={(e) =>
                      setQuery((cur) => ({
                        ...cur,
                        [p.key]: { ...cur[p.key], on: e.target.checked },
                      }))
                    }
                  />
                  <span className={s.apiParamKey}>{p.key}</span>
                  <select
                    className={s.apiParamValue}
                    value={q.value}
                    aria-label={`Value for ${p.key}`}
                    onChange={(e) =>
                      setQuery((cur) => ({
                        ...cur,
                        [p.key]: { on: true, value: e.target.value },
                      }))
                    }
                  >
                    {p.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })
          ) : (
            <p className={cx(s.apiParamNone, ui.mono)}>
              None for this endpoint.
            </p>
          )}
        </div>

        <div className={s.apiReq}>
          <div className={cx(s.apiBar, s.apiTabBar)}>
            <span className={cx(s.apiBarLabel, ui.mono)}>Request</span>
            <div role="tablist" aria-label="Language" className={s.apiTabs}>
              {LANGS.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  id={`api-tab-${l.id}`}
                  aria-selected={lang === i}
                  aria-controls="api-snippet"
                  tabIndex={lang === i ? 0 : -1}
                  className={s.apiTab}
                  onClick={() => setLang(i)}
                  onKeyDown={onTabKey}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <CopyButton
              className={s.apiCopyEnd}
              text={LANGS[lang].code(method, url)}
              label={`${LANGS[lang].label} snippet`}
            />
          </div>
          <pre
            id="api-snippet"
            role="tabpanel"
            aria-labelledby={`api-tab-${LANGS[lang].id}`}
            tabIndex={0}
            className={cx(s.apiSnippet, ui.mono)}
          >
            {LANGS[lang].code(method, url)}
          </pre>
        </div>

        <div className={s.apiRes}>
          <div className={cx(s.apiBar, s.apiMeta, ui.mono)}>
            <span className={s.apiMetaRight} aria-live="polite">
              <span>Response</span>
              {result && result !== 'error' && (
                <span>
                  <span className={result.ok ? s.apiOkText : s.apiBadText}>
                    {result.status}
                  </span>
                  {` · ${result.ms} ms · ${size(result.bytes)}`}
                </span>
              )}
              {result === 'error' && (
                <span className={s.apiBadText}>network error</span>
              )}
            </span>
            {result && result !== 'error' && (
              <CopyButton text={result.body} label="response" />
            )}
          </div>
          <pre className={cx(s.apiBody, ui.mono)} tabIndex={0}>
            {result && result !== 'error' ? (
              <Json text={result.body} />
            ) : (
              <span className={s.apiIdle}>
                {result === 'error'
                  ? 'The request did not complete. Try again.'
                  : 'Press Send to call the live endpoint.'}
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}
