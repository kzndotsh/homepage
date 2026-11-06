// One list for everything I have built or run: roles first (newest first), then
// projects. Each entry carries a small architecture diagram. Facts come from the
// resume bullets in cv.ts; the diagrams only arrange what those bullets name.

import { cvProjects, experience } from './cv'
import { rangeLabel } from './cvDates'

export type ArchNode = { title: string; sub?: string; hot?: boolean }

/** A node hanging off one of the main nodes, drawn above or below the row. */
export type ArchSide = {
  title: string
  sub?: string
  /** Index of the main node it connects to. */
  at: number
  /** What the arrow means, e.g. "provisions". */
  label?: string
  /** "in" points at the main node (default); "out" points at this one. */
  dir?: 'in' | 'out'
}

export type ArchSpec = {
  /** The main row, left to right (top to bottom on phones). */
  path: ArchNode[]
  /** Draw arrows between the main nodes (default true). */
  flow?: boolean
  /** A dashed box around a run of main nodes. */
  group?: { label: string; from: number; to: number }
  above?: ArchSide
  below?: ArchSide
  note?: string
}

export type WorkFact = { value: string; label: string }

export type WorkEntry = {
  id: string
  /** URL-safe, for /portfolio/<slug>. */
  slug: string
  kind: 'role' | 'project'
  name: string
  /** Job title for a role, a one-line description for a project. */
  title: string
  /** "Feb 2026 - Present"; null for projects. */
  period: string | null
  location: string | null
  contract: boolean
  summary: string
  bullets: string[]
  tags: string[]
  href: string | null
  /** Numbers named in the bullets, word for word. */
  facts: WorkFact[]
  diagram: ArchSpec
}

const DIAGRAMS: Record<string, ArchSpec> = {
  doji: {
    path: [
      { title: 'Polymarket', sub: 'APIs, WebSockets', hot: true },
      { title: 'Hardening', sub: 'retry, breaker, limits', hot: true },
      { title: 'Hono + tRPC', sub: 'API', hot: true },
      { title: 'Next.js 16', sub: 'React 19 UI', hot: true },
    ],
    group: { label: 'TypeScript monorepo', from: 1, to: 3 },
    above: { title: 'Vercel', sub: 'CI/CD', at: 3, label: 'deploys' },
    below: { title: 'PostgreSQL', sub: 'Drizzle', at: 2, label: 'stores' },
    note: 'Vitest, property-based tests and Sentry cover the upstream integrations.',
  },
  atl: {
    path: [
      { title: 'Member', sub: 'browser' },
      { title: 'Cloudflare Workers', sub: 'edge', hot: true },
      { title: 'Identity hub', sub: 'OIDC, Better Auth', hot: true },
      { title: 'Services', sub: '30+ self-hosted', hot: true },
    ],
    group: { label: 'Hetzner and OVH', from: 2, to: 3 },
    above: { title: 'Ansible, Terraform', at: 3, label: 'provision' },
    below: {
      title: 'IRC, XMPP, email, wiki',
      at: 2,
      label: 'provisions',
      dir: 'out',
    },
    note: 'A Discord, IRC and XMPP bridge joins the chat networks. 20,000+ members.',
  },
  bloxmania: {
    path: [
      { title: 'Next.js storefront', sub: 'before' },
      { title: 'Shopify 2.0 theme', sub: 'Tailwind, Liquid', hot: true },
      { title: 'Production store', sub: 'Shopify CLI', hot: true },
    ],
    above: {
      title: 'Node.js pipeline',
      sub: 'bundling, hot reload',
      at: 1,
      label: 'builds',
    },
    below: {
      title: 'Analytics',
      sub: 'GA, Tag Manager',
      at: 2,
      label: 'measures',
    },
  },
  printbliss: {
    path: [
      { title: 'Printavo', sub: 'before' },
      { title: 'Airtable ERP', sub: '20+ scripts', hot: true },
      { title: 'REST API', sub: 'Express, OpenAPI, Zod', hot: true },
      { title: 'Dashboards', sub: 'quotes, invoices', hot: true },
    ],
    above: { title: 'Make', sub: 'event-driven', at: 1, label: 'automates' },
    below: {
      title: 'Stripe, PandaDoc, Twilio',
      sub: '+ Shopify, OpenAI, Jotform',
      at: 1,
      label: 'integrates',
    },
    note: 'Phased cutover with zero production downtime.',
  },
  blackbeard: {
    path: [
      { title: 'Visitor', sub: 'browser' },
      { title: 'Traefik', sub: 'reverse proxy', hot: true },
      { title: 'Authelia', sub: 'auth gate', hot: true },
      { title: 'Docker', sub: '100+ containers', hot: true },
    ],
    group: { label: 'Hetzner bare metal', from: 1, to: 3 },
    above: { title: 'Ansible', at: 2, label: 'provisions' },
    below: { title: 'Ceph', sub: 'storage', at: 3, label: 'backs' },
    note: 'A petabyte-scale media platform, managed through Portainer.',
  },
  independent: {
    path: [
      { title: 'Discord architecture', sub: 'Varius Media' },
      { title: 'WordPress recovery', sub: "Foster's Alaska Cabins" },
      { title: 'Site redesign', sub: 'M.R. Snyder Company' },
    ],
    flow: false,
    above: { title: 'Breeze cache, CDN, SEO', at: 2, label: 'tunes' },
    below: {
      title: 'Cloudways, Cloudflare DNS',
      at: 1,
      label: 'rebuilt on',
      dir: 'out',
    },
  },
  f4mily: {
    path: [
      { title: 'Order', sub: 'Jotform' },
      { title: 'Make, Zapier', sub: 'automations', hot: true },
      { title: 'Airtable, Printavo', sub: 'and Trello', hot: true },
      { title: 'Twilio', sub: '7 email/SMS templates', hot: true },
    ],
    above: { title: 'ClickUp, Pipedrive', at: 2, label: 'workflows' },
    below: {
      title: 'Google Workspace',
      sub: 'Cloudflare DNS',
      at: 1,
      label: 'underpins',
    },
  },
  'fish-audio-suite': {
    path: [
      { title: 'Voice clients', sub: 'CLI loop, WebSocket', hot: true },
      { title: 'Proxy', sub: 'OpenAI-compatible', hot: true },
      { title: 'Fish Audio', sub: 'TTS and ASR', hot: true },
    ],
    above: {
      title: 'Text normalization',
      sub: 'pure Python kit',
      at: 1,
      label: 'uses',
    },
    below: {
      title: 'basedpyright, ruff, pytest',
      sub: 'Docker, NixOS module',
      at: 1,
      label: 'checks',
    },
  },
  'gang.guide': {
    path: [
      { title: 'Source material' },
      { title: 'Extraction', sub: 'Python, Claude', hot: true },
      { title: 'Adjudication', hot: true },
      { title: 'Consensus merge', hot: true },
      { title: 'Map UI', sub: 'SvelteKit 5, Konva', hot: true },
    ],
    group: { label: 'LLM pipeline', from: 1, to: 3 },
    below: {
      title: 'Cloudflare Workers',
      at: 4,
      label: 'deployed on',
      dir: 'out',
    },
    note: 'Multi-temperature extraction feeds the adjudication step.',
  },
  Watchdog: {
    path: [
      { title: 'Caps and agents', sub: 'collect' },
      { title: 'Evidence', hot: true },
      { title: 'Proposal', hot: true },
      { title: 'Triage', sub: 'human review', hot: true },
      { title: 'Case Graph', sub: 'Postgres', hot: true },
    ],
    group: { label: 'Human custody', from: 3, to: 4 },
    above: {
      title: 'Export',
      sub: 'markdown + zip',
      at: 4,
      label: 'projects to',
      dir: 'out',
    },
    below: { title: 'Discarded', at: 3, label: 'reject', dir: 'out' },
    note: 'Nothing reaches the case until a person accepts it.',
  },
  'Crate Digger': {
    path: [
      { title: 'Number key' },
      { title: 'Spicetify extension', sub: 'inside Spotify', hot: true },
      { title: 'Bound playlist', hot: true },
    ],
    above: {
      title: 'HUD',
      sub: 'above the seek bar',
      at: 1,
      label: 'shows',
      dir: 'out',
    },
    note: 'A number key dumps the current track into its playlist. An optional like-cleaner is included.',
  },
  'Awesome discord.py': {
    path: [
      { title: 'Official links' },
      {
        title: 'Libraries and extensions',
        sub: 'voice, UI, utilities',
        hot: true,
      },
      { title: 'Example bots', sub: 'reference to specialised', hot: true },
      { title: 'Guides and tutorials' },
    ],
    flow: false,
    below: {
      title: 'Gists and snippets',
      sub: 'help commands',
      at: 2,
      label: 'plus',
    },
    note: 'A curated list; the sections stand side by side.',
  },
  exhaust: {
    path: [
      { title: 'Workspace', sub: 'one per Target', hot: true },
      { title: 'Harness', sub: 'drives the loop', hot: true },
      { title: 'Findings', sub: 'append-only', hot: true },
      { title: 'Verdicts', sub: 'recorded over time' },
    ],
    group: { label: 'Scope Contract', from: 0, to: 1 },
    above: { title: 'Rig', sub: 'pinned tools', at: 1, label: 'equips' },
    below: {
      title: 'Playbook',
      sub: 'verticals to work through',
      at: 1,
      label: 'guides',
    },
    note: 'With no Scope Contract, everything stays in the Sandbox.',
  },
  skills: {
    path: [
      { title: 'SKILL.md', sub: 'the entry point', hot: true },
      { title: 'references/', sub: 'loaded on demand' },
    ],
    above: {
      title: 'Agent',
      sub: 'Claude Code, Cursor',
      at: 1,
      label: 'loads',
    },
    below: {
      title: 'skills CLI',
      sub: 'npx skills add',
      at: 0,
      label: 'installs',
    },
    note: 'One folder per skill.',
  },
  dotfiles: {
    path: [
      { title: 'Flake', sub: 'explicit per-host imports', hot: true },
      { title: 'ikigai', sub: 'Sway daily driver' },
      { title: 'Hardened VM', sub: 'throwaway, libvirt' },
      { title: 'kzn.sh', sub: 'Hetzner' },
    ],
    flow: false,
    group: { label: 'NixOS hosts, no Home Manager', from: 1, to: 3 },
    above: { title: 'sops-nix', sub: 'secrets', at: 0, label: 'decrypts' },
    below: {
      title: 'Terranix, OpenTofu',
      sub: 'infrastructure',
      at: 3,
      label: 'provisions',
    },
  },
  Chat360: {
    path: [
      { title: 'Client', sub: 'Next.js, Zustand', hot: true },
      { title: 'Agora WebRTC', sub: 'denoising, VAD', hot: true },
    ],
    above: {
      title: 'Tailwind, shadcn',
      sub: 'Xbox-inspired UI',
      at: 0,
      label: 'styles',
    },
    below: {
      title: 'Supabase',
      sub: 'auth, realtime presence',
      at: 0,
      label: 'backs',
    },
    note: 'Agora handles AI denoising, VAD and echo cancellation.',
  },
  Tux: {
    path: [
      { title: 'Discord', sub: 'members' },
      { title: 'discord.py bot', sub: 'cases, XP, plugins', hot: true },
      { title: 'PostgreSQL', sub: 'SQLModel', hot: true },
    ],
    above: { title: 'Redis', at: 2, label: 'caches' },
    below: { title: 'Sentry, Docker', at: 1, label: 'runs on', dir: 'out' },
    note: 'About 690 tests.',
  },
}

const SUMMARIES: Record<string, string> = {
  doji: 'A terminal-style Polymarket prediction-market platform, built end to end in a TypeScript monorepo.',
  atl: 'Scaled a Linux education nonprofit to 20,000+ members and ran the self-hosted platform behind it.',
  bloxmania:
    'Replatformed a digital-goods marketplace from a Next.js storefront to a custom Shopify 2.0 theme.',
  printbliss:
    'Moved a garment printer off Printavo onto a custom Airtable ERP with zero production downtime.',
  blackbeard: 'Operated a petabyte-scale media platform on Hetzner bare metal.',
  independent:
    'Client work: Discord communities, a recovered WordPress site and a redesigned industrial site.',
  f4mily: 'Ran sales ops and business systems for a custom apparel brand.',
  'fish-audio-suite':
    'An unofficial Fish Audio toolkit: an OpenAI-compatible proxy and a full-duplex voice loop.',
  'gang.guide':
    'An interactive map of U.S. criminal organizations, fed by an LLM extraction pipeline.',
  Watchdog:
    'An open-source intelligence (OSINT) case management platform for small teams.',
  'Crate Digger': 'A Spicetify extension for keyboard-first crate digging.',
  'Awesome discord.py':
    'Useful resources for creating Discord bots with discord.py. An Awesome list for all things Discord.py.',
  exhaust: 'An agent-first toolkit for security research.',
  skills: 'Agent skills for Claude Code, Cursor and other SKILL.md agents.',
  dotfiles:
    "A NixOS flake for my Sway desktop, a hardened VM and this site's server.",
  Chat360: 'Real-time voice party chat with an Xbox-inspired UI.',
  Tux: 'An open-source Discord bot with moderation, XP and a plugin system.',
}

const FACTS: Record<string, WorkFact[]> = {
  atl: [
    { value: '20,000+', label: 'community members' },
    { value: '10M+', label: 'messages' },
    { value: '40', label: 'active volunteers' },
    { value: '250K+', label: 'lines in the monorepo' },
    { value: '1,500+', label: 'tests on the identity hub' },
    { value: '30+', label: 'self-hosted services' },
  ],
  printbliss: [
    { value: '20+', label: 'automation scripts' },
    { value: 'Zero', label: 'production downtime in the cutover' },
  ],
  blackbeard: [
    { value: '100+', label: 'Docker containers' },
    { value: '~1,300', label: 'lines in the provisioning runbook' },
    { value: 'Petabyte', label: 'scale of the platform' },
  ],
  independent: [{ value: '3', label: 'client communities designed' }],
  f4mily: [{ value: '7', label: 'automated email and SMS templates' }],
  Tux: [{ value: '~690', label: 'tests' }],
}

/** One short line per project for cards, so the line is not just the tech list again. */
const TAGLINES: Record<string, string> = {
  Watchdog: 'OSINT case management for small teams',
  Doji: 'Terminal-style prediction-market trading',
  'fish-audio-suite': 'TTS/ASR proxy and full-duplex voice CLI',
  'gang.guide': 'Map of U.S. criminal organizations',
  'Crate Digger': 'Keyboard-first Spotify crate digging',
  dotfiles: 'NixOS flake for my machines and kzn.sh',
  skills: 'Agent skills for Claude Code and Cursor',
  exhaust: 'Agent-first security research toolkit',
  'Awesome discord.py': 'Awesome list for discord.py bots',
  Chat360: 'Real-time voice party chat',
  Tux: 'Open-source Discord bot',
}

const slugify = (id: string) =>
  id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const roles: WorkEntry[] = experience.map((r) => ({
  id: r.id,
  slug: slugify(r.id),
  kind: 'role',
  name: r.org,
  title: r.title,
  period: rangeLabel(r.start, r.end),
  location: r.location,
  contract: r.contract ?? false,
  summary: SUMMARIES[r.id],
  bullets: r.bullets,
  tags: r.tags,
  href: null,
  facts: FACTS[r.id] ?? [],
  diagram: DIAGRAMS[r.id],
}))

const projects: WorkEntry[] = cvProjects.map((p) => ({
  id: p.name,
  slug: slugify(p.name),
  kind: 'project',
  name: p.name,
  title: TAGLINES[p.name] ?? p.stack.slice(0, 3).join(', '),
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES[p.name],
  bullets: [p.blurb],
  tags: p.stack,
  href: p.href,
  facts: FACTS[p.name] ?? [],
  diagram: DIAGRAMS[p.name],
}))

// Not on the resume, so it lives here rather than in cv.ts.
const watchdog: WorkEntry = {
  id: 'Watchdog',
  slug: 'watchdog',
  kind: 'project',
  name: 'Watchdog',
  title: TAGLINES.Watchdog,
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES.Watchdog,
  bullets: [
    'Open-source (AGPL-3.0) OSINT case-management platform for small teams, pre-1.0. Every lookup comes back as a proposal; nothing reaches the case graph until a person accepts it.',
    'Collectors (Caps) run as background jobs and produce evidence plus a proposal. Their runtime context has no database handle, and the patch schema rejects confidence, which is chosen at Accept.',
    'TypeScript monorepo: TanStack Start UI with oRPC (RPC and OpenAPI), an Effect domain layer, Drizzle on Postgres, a pg-boss worker, a typed SDK and a CLI.',
  ],
  tags: ['TS', 'Effect', 'TanStack Start', 'oRPC', 'Drizzle', 'pg-boss'],
  href: 'https://github.com/kzndotsh/watchdog',
  facts: [],
  diagram: DIAGRAMS.Watchdog,
}

// The same work as the Doji role, shown as a project because it has a live site.
const doji: WorkEntry = {
  id: 'doji-bet',
  slug: 'doji-bet',
  kind: 'project',
  name: 'Doji',
  title: TAGLINES.Doji,
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES.doji,
  bullets: [
    'Terminal-style Polymarket prediction-market platform: Next.js 16 + React 19 frontend with live market data over multi-channel WebSockets, Hono + tRPC API, PostgreSQL (Drizzle).',
  ],
  tags: ['TypeScript', 'Next.js', 'Hono', 'tRPC', 'Drizzle'],
  href: 'https://doji.bet',
  facts: [],
  diagram: DIAGRAMS.doji,
}

const crateDigger: WorkEntry = {
  id: 'Crate Digger',
  slug: 'crate-digger',
  kind: 'project',
  name: 'Crate Digger',
  title: TAGLINES['Crate Digger'],
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES['Crate Digger'],
  bullets: [
    'Spicetify extension for keyboard-first crate digging: number keys dump the current track into bound playlists, with a HUD above the seek bar and an optional like-cleaner.',
  ],
  tags: ['Spicetify', 'JavaScript', 'Spotify'],
  href: 'https://github.com/kzndotsh/spicetify-cratedigger',
  facts: [],
  diagram: DIAGRAMS['Crate Digger'],
}

const dotfiles: WorkEntry = {
  id: 'dotfiles',
  slug: 'dotfiles',
  kind: 'project',
  name: 'dotfiles',
  title: TAGLINES.dotfiles,
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES.dotfiles,
  bullets: [
    'NixOS flake for ikigai (a Sway daily driver), a throwaway hardened libvirt VM and kzn.sh on Hetzner. Declarative system modules only, no Home Manager: explicit per-host imports, sops-nix secrets, Terranix/OpenTofu infrastructure, Tokyo Night theming, PipeWire pro-audio, gaming and local AI.',
  ],
  tags: ['NixOS', 'Sway', 'sops-nix', 'OpenTofu'],
  href: 'https://github.com/kzndotsh/dotfiles',
  facts: [],
  diagram: DIAGRAMS.dotfiles,
}

const exhaust: WorkEntry = {
  id: 'exhaust',
  slug: 'exhaust',
  kind: 'project',
  name: 'exhaust',
  title: TAGLINES.exhaust,
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES.exhaust,
  bullets: [
    'Agent-first toolkit for security research, pre-alpha. A self-contained Workspace per Target, with a Rig of pinned tools, a Playbook of verticals and a Harness that drives the loop. A Scope Contract gates real Targets, and Findings are append-only.',
  ],
  tags: ['Python', 'uv', 'Typer'],
  href: 'https://github.com/kzndotsh/exhaust',
  facts: [],
  diagram: DIAGRAMS.exhaust,
}

const skills: WorkEntry = {
  id: 'skills',
  slug: 'skills',
  kind: 'project',
  name: 'skills',
  title: TAGLINES.skills,
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES.skills,
  bullets: [
    'Agent skills for Claude Code, Cursor and other SKILL.md-compatible agents. Each folder under skills/ is one skill: a SKILL.md entry point plus optional references the agent loads on demand.',
  ],
  tags: ['SKILL.md', 'Claude Code', 'Cursor', 'Python'],
  href: 'https://github.com/kzndotsh/skills',
  facts: [],
  diagram: DIAGRAMS.skills,
}

const awesomeDiscordpy: WorkEntry = {
  id: 'Awesome discord.py',
  slug: 'awesome-discordpy',
  kind: 'project',
  name: 'Awesome discord.py',
  title: TAGLINES['Awesome discord.py'],
  period: null,
  location: null,
  contract: false,
  summary: SUMMARIES['Awesome discord.py'],
  bullets: [
    'Useful resources for creating Discord bots with discord.py: official links, libraries and extensions, example bots, guides and tutorials, and community gists and snippets.',
  ],
  tags: ['discord.py', 'Discord', 'Awesome list'],
  href: 'https://github.com/kzndotsh/awesome-discordpy',
  facts: [],
  diagram: DIAGRAMS['Awesome discord.py'],
}

export const workEntries: WorkEntry[] = [
  ...roles,
  watchdog,
  ...projects.flatMap((p) => (p.name === 'Chat360' ? [doji, p] : [p])),
  crateDigger,
  dotfiles,
  skills,
  awesomeDiscordpy,
  exhaust,
]
