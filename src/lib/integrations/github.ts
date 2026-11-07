import type {
  GithubActivity,
  GithubDiff,
  GithubEvent,
  GithubEventKind,
} from '@/lib/integrations/types'

const LOGIN = 'kzndotsh'
const API = 'https://api.github.com'
const MAX_EVENTS = 30

type RawEvent = {
  id: string
  type: string
  public?: boolean
  repo: { name: string }
  created_at: string
  payload?: {
    action?: string
    ref?: string | null
    ref_type?: string
    commits?: { message?: string }[]
    pull_request?: {
      title?: string
      html_url?: string
      number?: number
      url?: string
    }
    head?: string
    issue?: { title?: string; html_url?: string; number?: number }
    comment?: { html_url?: string }
  }
}

type RawUser = { public_repos: number; followers: number }

type CalendarResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: { date: string; contributionCount: number }[]
          }[]
        }
      }
      followers: { totalCount: number }
      repositories: { totalCount: number }
      own: { nodes: { stargazerCount: number }[] }
      starredRepositories: { totalCount: number }
    }
  }
}

const KIND: Record<string, GithubEventKind> = {
  PushEvent: 'push',
  PullRequestEvent: 'pr',
  IssuesEvent: 'issue',
  IssueCommentEvent: 'comment',
  PullRequestReviewCommentEvent: 'comment',
  PullRequestReviewEvent: 'review',
  CreateEvent: 'branch',
  DeleteEvent: 'branch',
}

function headers(token?: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kzn.sh-site',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function firstLine(s: string | undefined): string | null {
  const line = s?.split('\n')[0]?.trim()
  return line ? line.slice(0, 140) : null
}

type Detail = {
  title: string | null
  sha: string | null
  diff: GithubDiff | null
}

function short(sha: string | null | undefined): string | null {
  return sha ? sha.slice(0, 7) : null
}

function detailFor(
  pr: { url?: string },
  details: Map<string, Detail>,
): Detail | undefined {
  return pr.url ? details.get(pr.url) : undefined
}

function prUrl(
  pr: { html_url?: string; number?: number },
  repo: string,
): string | undefined {
  if (pr.html_url) return pr.html_url
  return pr.number ? `https://github.com/${repo}/pull/${pr.number}` : undefined
}

type PrJson = {
  title?: string
  additions?: number
  deletions?: number
  changed_files?: number
  merged?: boolean
  merge_commit_sha?: string | null
  head?: { sha?: string }
}
type CommitJson = {
  sha?: string
  commit?: { message?: string }
  stats?: { additions?: number; deletions?: number }
  files?: unknown[]
}

function diffOf(
  additions: number | undefined,
  deletions: number | undefined,
  files: number | undefined,
): GithubDiff | null {
  if (additions === undefined || deletions === undefined) return null
  return { additions, deletions, files: files ?? 0 }
}

// GitHub's events API no longer includes PR titles, commit messages or sizes,
// so look them up (deduped; cached by fetch revalidate). Unauthenticated calls
// are capped to stay inside the 60 requests/hour limit.
async function lookupDetails(
  raw: RawEvent[],
  token?: string,
): Promise<Map<string, Detail>> {
  const jobs = new Map<string, { url: string; read: (j: unknown) => Detail }>()
  const readPr = (j: unknown): Detail => {
    const pr = j as PrJson
    return {
      title: firstLine(pr.title),
      sha: short(pr.merged ? pr.merge_commit_sha : pr.head?.sha),
      diff: diffOf(pr.additions, pr.deletions, pr.changed_files),
    }
  }
  const readCommit = (j: unknown): Detail => {
    const c = j as CommitJson
    return {
      title: firstLine(c.commit?.message),
      sha: short(c.sha),
      diff: diffOf(c.stats?.additions, c.stats?.deletions, c.files?.length),
    }
  }
  for (const e of raw) {
    if (e.public !== true) continue
    const p = e.payload
    const pr = p?.pull_request
    if (pr?.url) jobs.set(pr.url, { url: pr.url, read: readPr })
    if (e.type === 'PushEvent' && p?.head) {
      jobs.set(`commit:${e.repo.name}@${p.head}`, {
        url: `${API}/repos/${e.repo.name}/commits/${p.head}`,
        read: readCommit,
      })
    }
  }
  const entries = [...jobs.entries()].slice(0, token ? 30 : 8)
  const details = new Map<string, Detail>()
  let next = 0
  const worker = async () => {
    while (next < entries.length) {
      const [key, job] = entries[next++]
      try {
        const { data } = await get<unknown>(job.url, token)
        if (data) details.set(key, job.read(data))
      } catch {
        // leave the generic title
      }
    }
  }
  await Promise.all(Array.from({ length: 5 }, worker))
  return details
}

function mapEvent(e: RawEvent, details: Map<string, Detail>): GithubEvent {
  const kind = KIND[e.type] ?? 'other'
  const p = e.payload ?? {}
  const repoUrl = `https://github.com/${e.repo.name}`
  let action: string | null = null
  let title = e.type.replace(/Event$/, '')
  let url = repoUrl
  let sha: string | null = null
  let diff: GithubDiff | null = null
  const branch = p.ref?.replace('refs/heads/', '')
  const verb = p.action ?? 'updated'
  const prDetail = p.pull_request
    ? detailFor(p.pull_request, details)
    : undefined

  if (kind === 'push') {
    const commits = p.commits ?? []
    const pushed = p.head
      ? details.get(`commit:${e.repo.name}@${p.head}`)
      : undefined
    const message = firstLine(commits.at(-1)?.message) ?? pushed?.title
    action = message ? 'pushed' : null
    title = message ?? (branch ? `pushed to ${branch}` : 'pushed commits')
    sha = pushed?.sha ?? short(p.head)
    diff = pushed?.diff ?? null
    if (sha) url = `${repoUrl}/commit/${sha}`
  } else if (kind === 'pr' && p.pull_request) {
    action = `${verb} pull request`
    title =
      p.pull_request.title ??
      prDetail?.title ??
      (p.pull_request.number ? `#${p.pull_request.number}` : 'a pull request')
    sha = prDetail?.sha ?? null
    diff = prDetail?.diff ?? null
    url = prUrl(p.pull_request, e.repo.name) ?? url
  } else if (kind === 'issue' && p.issue) {
    action = `${verb} issue`
    title =
      p.issue.title ?? (p.issue.number ? `#${p.issue.number}` : 'an issue')
    url = p.issue.html_url ?? url
  } else if (kind === 'comment') {
    action = 'commented on'
    title =
      p.issue?.title ?? p.pull_request?.title ?? prDetail?.title ?? 'a thread'
    url = p.comment?.html_url ?? p.issue?.html_url ?? url
  } else if (kind === 'review') {
    action = 'reviewed'
    title = p.pull_request?.title ?? prDetail?.title ?? 'a pull request'
    url = (p.pull_request && prUrl(p.pull_request, e.repo.name)) ?? url
  } else if (kind === 'branch') {
    // Create and delete events share one category.
    action = `${e.type === 'DeleteEvent' ? 'deleted' : 'created'} ${p.ref_type ?? 'ref'}`
    title = p.ref ?? e.repo.name
  }
  return {
    id: e.id,
    kind,
    repo: e.repo.name,
    action,
    title,
    url,
    sha,
    diff,
    at: e.created_at,
  }
}

// One row per PR or issue (and per review or comment thread): keep its most final event (merged > closed >
// reopened > opened > labels and other edits), latest first on ties.
const RANK: Record<string, number> = {
  merged: 5,
  closed: 4,
  reopened: 3,
  opened: 2,
}

function threadKey(e: RawEvent): string | null {
  const p = e.payload
  if (e.type === 'PullRequestEvent' && p?.pull_request?.number) {
    return `${e.repo.name}#pr${p.pull_request.number}`
  }
  if (e.type === 'IssuesEvent' && p?.issue?.number) {
    return `${e.repo.name}#issue${p.issue.number}`
  }
  // Several reviews or comments on one thread read as the same row.
  const thread = p?.pull_request?.number ?? p?.issue?.number
  if (thread && KIND[e.type] === 'review') {
    return `${e.repo.name}#review${thread}`
  }
  if (thread && KIND[e.type] === 'comment') {
    return `${e.repo.name}#comment${thread}`
  }
  return null
}

function dedupeThreads(raw: RawEvent[]): RawEvent[] {
  const best = new Map<string, RawEvent>()
  const rank = (e: RawEvent) => RANK[e.payload?.action ?? ''] ?? 1
  for (const e of raw) {
    const key = threadKey(e)
    if (!key) continue
    const cur = best.get(key)
    if (
      !cur ||
      rank(e) > rank(cur) ||
      (rank(e) === rank(cur) && e.created_at > cur.created_at)
    ) {
      best.set(key, e)
    }
  }
  return raw.filter((e) => {
    const key = threadKey(e)
    return key === null || best.get(key) === e
  })
}

async function mapEvents(
  raw: RawEvent[],
  token?: string,
): Promise<GithubEvent[]> {
  // Authenticated feeds include private repos; this site is public. Stars
  // arrive as WatchEvent and say nothing about what I built, so they are dropped.
  const events = dedupeThreads(
    raw.filter((event) => event.public === true && event.type !== 'WatchEvent'),
  )
  const details = await lookupDetails(events, token)
  return events
    .map((event) => mapEvent(event, details))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, MAX_EVENTS)
}

async function get<T>(
  url: string,
  token?: string,
): Promise<{ status: number; data: T | null }> {
  const res = await fetch(url, {
    headers: headers(token),
    signal: AbortSignal.timeout(6000),
  })
  return { status: res.status, data: res.ok ? ((await res.json()) as T) : null }
}

// GitHub's events feed is not real time (its docs promise 30 seconds to 6 hours,
// and pushes can take longer), so the push rows come from the commits API, which
// is. Commits replace the PushEvent for the same commit; events still supply
// issues, comments, pull requests and anything older.
type RawRepo = {
  full_name: string
  private: boolean
  fork: boolean
  pushed_at: string
}
type RawCommit = {
  sha: string
  html_url: string
  commit: { message?: string; committer?: { date?: string } }
}

async function recentCommits(token?: string): Promise<GithubEvent[]> {
  const repos = token ? 4 : 2 // an unauthenticated caller has 60 requests an hour
  const diffs = token ? 8 : 0
  const listed = await get<RawRepo[]>(
    `${API}/users/${LOGIN}/repos?type=owner&sort=pushed&per_page=10`,
    token,
  )
  if (!listed.data) return []
  const cutoff = Date.now() - 30 * 86_400_000
  const picks = listed.data
    .filter((r) => !r.private && !r.fork && Date.parse(r.pushed_at) > cutoff)
    .slice(0, repos)
  const lists = await Promise.all(
    picks.map(async (r) => {
      const { data } = await get<RawCommit[]>(
        `${API}/repos/${r.full_name}/commits?author=${LOGIN}&per_page=8`,
        token,
      )
      return (data ?? []).map((c) => ({ repo: r.full_name, c }))
    }),
  )
  const rows = lists
    .flat()
    .map(({ repo, c }): GithubEvent => ({
      id: `commit:${c.sha}`,
      kind: 'push',
      repo,
      action: 'pushed',
      title: firstLine(c.commit.message) ?? 'pushed commits',
      url: c.html_url,
      sha: short(c.sha),
      diff: null,
      at: c.commit.committer?.date ?? new Date().toISOString(),
    }))
    .sort((a, b) => b.at.localeCompare(a.at))

  // Sizes need one request per commit, so only the newest few get them.
  await Promise.all(
    rows.slice(0, diffs).map(async (row) => {
      const { data } = await get<CommitJson>(
        `${API}/repos/${row.repo}/commits/${row.id.slice('commit:'.length)}`,
        token,
      )
      if (data) {
        row.diff = diffOf(
          data.stats?.additions,
          data.stats?.deletions,
          data.files?.length,
        )
      }
    }),
  )
  return rows
}

/** Events, minus pushes the commits already cover, merged with the commits. */
async function withCommits(
  raw: RawEvent[],
  commits: GithubEvent[],
  token?: string,
): Promise<GithubEvent[]> {
  const have = new Set(commits.map((c) => c.sha))
  const rest = raw.filter(
    (e) => !(e.type === 'PushEvent' && have.has(short(e.payload?.head))),
  )
  const events = await mapEvents(rest, token)
  return [...events, ...commits]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, MAX_EVENTS)
}

const QUERY = `query($login:String!){user(login:$login){followers{totalCount}repositories(privacy:PUBLIC){totalCount}own:repositories(first:100,privacy:PUBLIC,isFork:false){nodes{stargazerCount}}starredRepositories{totalCount}contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`

async function authenticated(token: string): Promise<GithubActivity | null> {
  const [gql, events, commits] = await Promise.all([
    fetch(`${API}/graphql`, {
      method: 'POST',
      headers: { ...headers(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
      signal: AbortSignal.timeout(6000),
    }),
    get<RawEvent[]>(`${API}/users/${LOGIN}/events?per_page=50`, token),
    recentCommits(token).catch((): GithubEvent[] => []),
  ])
  if (!gql.ok || !events.data) return null
  const user = ((await gql.json()) as CalendarResponse).data?.user
  if (!user) return null
  const cal = user.contributionsCollection.contributionCalendar
  return {
    source: 'authenticated',
    login: LOGIN,
    fetchedAt: new Date().toISOString(),
    events: await withCommits(events.data, commits, token),
    calendar: cal.weeks.flatMap((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
      })),
    ),
    totals: {
      publicRepos: user.repositories.totalCount,
      followers: user.followers.totalCount,
      contributionsLastYear: cal.totalContributions,
      starsEarned: user.own.nodes.reduce((n, r) => n + r.stargazerCount, 0),
      starsGiven: user.starredRepositories.totalCount,
    },
  }
}

async function publicOnly(): Promise<GithubActivity | null> {
  const [events, user, repos, commits] = await Promise.all([
    get<RawEvent[]>(`${API}/users/${LOGIN}/events/public?per_page=50`),
    get<RawUser>(`${API}/users/${LOGIN}`),
    get<{ stargazers_count: number; fork: boolean }[]>(
      `${API}/users/${LOGIN}/repos?type=owner&per_page=100`,
    ),
    recentCommits().catch((): GithubEvent[] => []),
  ])
  if (!events.data || !user.data) return null
  return {
    source: 'public',
    login: LOGIN,
    fetchedAt: new Date().toISOString(),
    events: await withCommits(events.data, commits),
    calendar: null,
    totals: {
      publicRepos: user.data.public_repos,
      followers: user.data.followers,
      contributionsLastYear: null,
      starsEarned: repos.data
        ? repos.data
            .filter((r) => !r.fork)
            .reduce((n, r) => n + r.stargazers_count, 0)
        : null,
      starsGiven: null,
    },
  }
}

export async function fetchGithubActivity(): Promise<GithubActivity | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (token) {
      try {
        const authed = await authenticated(token)
        if (authed) return authed
      } catch {
        // fall through to the public path
      }
    }
    return await publicOnly()
  } catch {
    return null
  }
}
