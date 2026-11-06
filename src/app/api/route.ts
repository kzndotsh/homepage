import { json, limited, methodGuards, text } from '@/app/api/_lib/respond'

const endpoints = [
  {
    path: '/api/v1/resume',
    about: 'who, where, what: the CV in JSON Resume format',
  },
  { path: '/api/v1/playlists', about: 'curated playlists, always shuffle' },
  { path: '/api/v1/github', about: 'recent public activity' },
  {
    path: '/api/v1/lastfm',
    about:
      'last.fm: ?section= favorites, now, stats, tops, charts, genres, weekly, history, coding',
  },
]

const banner = String.raw`
  _                  _
 | | __ ____ _ __   | |__
 | |/ /|_  /| '_ \  | '_ \
 |   <  / / | | | |_| | | |
 |_|\_\/___||_| |_(_)_| |_|
`

const headers = {
  'x-hello': 'Hi. Read-only, JSON, no keys needed. Be nice and cache.',
  Link: endpoints.map((e) => `<${e.path}>; rel="item"`).join(', '),
  Vary: 'User-Agent',
}

function get(request: Request): Response {
  const ua = request.headers.get('user-agent') ?? ''
  if (/^(curl|wget|httpie)/i.test(ua)) {
    const list = endpoints
      .map((e) => `  ${e.path.padEnd(20)} ${e.about}`)
      .join('\n')
    return text(
      `${banner}\n  kzn.sh api, v1\n\nendpoints:\n${list}\n\nGET only. Responses are cached for five minutes.\nThanks for curling politely.`,
      { headers },
    )
  }
  return json(
    { name: 'kzn.sh api', version: 'v1', readOnly: true, endpoints },
    { headers },
  )
}

export const { POST, PUT, PATCH, DELETE } = methodGuards

export const GET = limited(get)
