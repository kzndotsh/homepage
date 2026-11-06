// The full CV, from the owner's resume. Facts only: nothing here is invented.
// The phone number is deliberately left off the site.

import { person } from './person'

export type CvRole = {
  id: string
  title: string
  org: string
  contract?: boolean
  /** "YYYY-MM" */
  start: string
  /** "YYYY-MM", or null while it is still running. */
  end: string | null
  location: string
  bullets: string[]
  /** Technologies named in the bullets, for filtering and highlighting. */
  tags: string[]
}

export type CvProject = {
  name: string
  href: string
  blurb: string
  stack: string[]
}

export type CvSkillGroup = { label: string; items: string[] }

export type CvOtherWork = { label: string; year: string; text: string }

export const cv = {
  name: person.name,
  alias: person.alias,
  location: person.city,
  headline: 'Full-stack builder: engineering and solutions',
  summary:
    "Full-stack builder (engineering and solutions). I write TypeScript/React/Next.js, wire up API integrations and workflow automation, and build LLM-backed tooling: extraction pipelines, voice agents, MCP servers. I've run container fleets, delivered custom ERP stacks for clients, and scaled communities from scratch. Linux, self-hosting, open source.",
  contact: [
    { label: 'Email', text: person.email, href: person.links.email },
    { label: 'Site', text: 'kzn.sh', href: 'https://kzn.sh' },
    { label: 'GitHub', text: 'github.com/kzndotsh', href: person.links.github },
    {
      label: 'LinkedIn',
      text: 'linkedin.com/in/kzndotsh',
      href: person.links.linkedin,
    },
  ],
  pdf: person.links.resume,
} as const

export const skills: CvSkillGroup[] = [
  {
    label: 'Development',
    items: [
      'TypeScript',
      'JavaScript',
      'Python',
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'Hono',
      'tRPC',
      'FastAPI',
      'SQL/PostgreSQL',
      'OpenAPI',
      'Zod',
      'WebSockets',
      'Tailwind',
      'Drizzle/Prisma',
      'Supabase',
      'Turborepo',
      'Vitest',
      'Playwright',
      'TanStack (Router, Query, Table)',
      'MCP',
      'Git',
      'GitHub Actions',
      'Vercel AI SDK',
      'Anthropic API',
      'OpenAI API',
      'Ollama',
    ],
  },
  {
    label: 'Platform & Infrastructure',
    items: [
      'Linux',
      'Docker',
      'Ansible',
      'Terraform',
      'Nginx',
      'Cloudflare',
      'Observability (Grafana, Prometheus, Loki, Sentry, Alloy, Mimir)',
      'Redis',
      'NixOS',
      'Bash',
      'MkDocs',
      'GCP',
      'Vercel',
      'MediaWiki',
    ],
  },
  {
    label: 'Business Systems & Automation',
    items: [
      'Airtable',
      'Make/Zapier',
      'Pipedrive',
      'ClickUp',
      'Stripe/Authorize.NET',
      'Twilio',
      'PandaDoc',
      'Jotform',
      'SendGrid',
      'Shopify',
    ],
  },
]

export const cvProjects: CvProject[] = [
  {
    name: 'fish-audio-suite',
    href: 'https://github.com/kzndotsh/fish-audio-suite',
    blurb:
      'Unofficial Fish Audio toolkit: OpenAI-compatible TTS/ASR proxy (FastAPI), full-duplex CLI voice loop with barge-in and VAD, live WebSocket voice client with thread-isolated playback, and a pure-Python text normalization kit. Strict basedpyright, ruff, pytest, Docker, NixOS module.',
    stack: ['Python', 'FastAPI', 'Docker', 'NixOS'],
  },
  {
    name: 'gang.guide',
    href: 'https://github.com/kzndotsh/gang.guide',
    blurb:
      'Interactive map of U.S. criminal organizations: LLM data extraction pipeline (Python, Claude, multi-temperature extraction with adjudication and consensus merge), canvas graph UI (SvelteKit 5, Konva.js), deployed on Cloudflare Workers.',
    stack: ['Python', 'Claude', 'SvelteKit 5', 'Konva.js', 'Cloudflare'],
  },
  {
    name: 'Chat360',
    href: 'https://github.com/kzndotsh/chat360',
    blurb:
      'Real-time voice party chat: Agora WebRTC with AI denoising, VAD, and echo cancellation; Supabase auth and realtime presence; Xbox-inspired UI.',
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind',
      'shadcn',
      'Zustand',
      'Supabase',
    ],
  },
  {
    name: 'Tux',
    href: 'https://github.com/allthingslinux/tux',
    blurb:
      'Open-source Discord bot: moderation cases, XP/leveling, snippets, plugin system. About 690 tests, Sentry, Docker.',
    stack: ['Python', 'discord.py', 'SQLModel', 'PostgreSQL', 'Redis'],
  },
]

export const experience: CvRole[] = [
  {
    id: 'doji',
    title: 'Co-Founder & Full-Stack Engineer',
    org: 'Doji',
    start: '2026-02',
    end: null,
    location: 'Remote',
    bullets: [
      'Built a terminal-style Polymarket prediction-market platform end to end in a TypeScript monorepo: Next.js 16 + React 19 frontend with live market data over multi-channel WebSockets, Hono + tRPC API, PostgreSQL (Drizzle).',
      'Integrated Polymarket trading APIs for live order placement, portfolio/positions, notifications, and real-time orderbooks.',
      'Hardened upstream Polymarket integrations: retry/circuit-breaker/rate-limit layer, Vitest + property-based tests, Sentry, CI/CD to Vercel.',
    ],
    tags: [
      'TypeScript',
      'Next.js',
      'React',
      'WebSockets',
      'Hono',
      'tRPC',
      'PostgreSQL',
      'Drizzle',
      'Vitest',
      'Sentry',
      'Vercel',
    ],
  },
  {
    id: 'atl',
    title: 'Founder & Full-Stack Engineer',
    org: 'All Things Linux',
    start: '2023-11',
    end: '2026-05',
    location: 'Remote',
    bullets: [
      'Scaled a 501(c)(3) Linux education nonprofit community to 20,000+ members, 10M+ messages, and 40 active volunteers; maintained a 250K+ LOC monorepo.',
      'Built an OIDC identity hub and Discord/IRC/XMPP bridge (Better Auth, PostgreSQL/Drizzle, Next.js): one account provisions IRC, XMPP, email, and wiki (1,500+ tests).',
      'Ran 30+ self-hosted services on Hetzner/OVH via Docker Compose, Ansible/Terraform, and Cloudflare Workers, with production observability.',
    ],
    tags: [
      'Next.js',
      'PostgreSQL',
      'Drizzle',
      'Docker',
      'Ansible',
      'Terraform',
      'Cloudflare',
      'Linux',
      'Observability',
    ],
  },
  {
    id: 'bloxmania',
    title: 'Shopify Developer',
    org: 'BloxMania',
    contract: true,
    start: '2025-07',
    end: '2025-08',
    location: 'Remote',
    bullets: [
      'Replatformed a Roblox/Fortnite digital-goods marketplace from a Next.js storefront to a custom Shopify 2.0 theme (Tailwind, modular Liquid sections); configured Google Analytics, Tag Manager, and Search Console.',
      'Shipped marketplace UX with feature parity: per-game header and mobile selector, supported-games catalog, and a video tutorial onboarding page.',
      'Built a Node.js theme pipeline with CSS/JS bundling, hot reload, and Theme Check; deployed to production via Shopify CLI.',
    ],
    tags: ['Shopify', 'Tailwind', 'Node.js', 'Next.js'],
  },
  {
    id: 'printbliss',
    title: 'Solutions Engineer',
    org: 'PrintBliss',
    contract: true,
    start: '2023-12',
    end: '2024-08',
    location: 'Remote',
    bullets: [
      'Migrated a garment printer from Printavo to a custom Airtable ERP (20+ automation scripts); phased cutover with zero production downtime; documented production workflows.',
      'Built a typed Express/TypeScript REST API with OpenAPI and Zod validation; garment pricing formulas and quote/invoice dashboards.',
      'Connected Make, Stripe, PandaDoc, Shopify, Twilio, OpenAI, Jotform, and Google Workspace to the Airtable ERP with event-driven automations; set up SendGrid transactional email.',
    ],
    tags: [
      'Airtable',
      'Express',
      'TypeScript',
      'OpenAPI',
      'Zod',
      'Make/Zapier',
      'Stripe/Authorize.NET',
      'PandaDoc',
      'Shopify',
      'Twilio',
      'OpenAI API',
      'Jotform',
      'SendGrid',
    ],
  },
  {
    id: 'blackbeard',
    title: 'System Administrator',
    org: 'Blackbeard Media Group',
    start: '2022-01',
    end: '2023-11',
    location: 'Remote',
    bullets: [
      'Operated a petabyte-scale media platform on Hetzner bare metal: 100+ Docker containers, Ceph storage, Ansible, Portainer, Traefik, and Authelia.',
      'Built an MkDocs customer help site and internal staff handbook deployed via Cloudflare Pages.',
      'Co-authored a ~1,300-line Hetzner media-node provisioning runbook (Arch Linux installimage, LVM/XFS, node naming conventions, Plex/Emby standards).',
    ],
    tags: ['Linux', 'Docker', 'Ansible', 'MkDocs', 'Cloudflare'],
  },
  {
    id: 'independent',
    title: 'Web Developer & Technical Consultant',
    org: 'Independent',
    contract: true,
    start: '2021-08',
    end: '2023-05',
    location: 'Remote',
    bullets: [
      'Designed Discord architecture for three small-business client communities (Varius Media): channel/role structure, whitelist onboarding, moderation and member verification.',
      "Recovered a compromised WordPress/PHP/MySQL site for Foster's Alaska Cabins; rebuilt on Cloudways and migrated DNS to Cloudflare with a backup workflow.",
      'Redesigned the WordPress/Elementor Pro site for M.R. Snyder Company, an industrial automation integrator; performance tuning (Breeze cache/CDN) and shipped baseline SEO.',
    ],
    tags: ['Cloudflare'],
  },
  {
    id: 'f4mily',
    title: 'Business Solutions Manager',
    org: 'F4mily Matters',
    start: '2020-10',
    end: '2021-12',
    location: 'Charlotte, NC',
    bullets: [
      'Ran sales ops and business systems for a custom apparel brand: Google Workspace and Cloudflare DNS; Make/Zapier automations linking Printavo, Jotform, Airtable, and Trello.',
      'Wrote inbound order-flow SOPs and 7 automated customer email/SMS templates (Twilio) for order stages; led the rebrand from Digital Apparel Printing to F4mily Matters.',
      'Documented team roles and handoffs across sales, production, and design; rolled out ClickUp and Pipedrive workflows.',
    ],
    tags: [
      'Airtable',
      'Make/Zapier',
      'Jotform',
      'Twilio',
      'ClickUp',
      'Pipedrive',
      'Cloudflare',
    ],
  },
]

/** Earlier and other work, Oct 2013 - Apr 2022. */
export const earlierWork = {
  start: '2013-10',
  end: '2022-04',
  location: 'Charlotte, NC / Remote',
  items: [
    {
      label: 'Web3 launch consulting',
      year: '2022',
      text: 'Led Discord launch ops for Wagmi World, Pixel Pussies, and The Football Club (whitelist growth, anti-raid security, mint-week ops); $200K+ launch revenue, 20,000+ Discord members.',
    },
    {
      label: 'Music Career Map',
      year: '2020',
      text: 'Built WordPress/Elementor marketing and product landing pages; course mockups, contributor onboarding, and content styleguides for launch.',
    },
    {
      label: 'Artists at Scale',
      year: '2018-2020',
      text: 'Founded a WordPress membership platform (Stripe, Zapier), 300+ artists; 60-day private beta with Intercom/Userpilot onboarding.',
    },
    {
      label: 'Events & field ops',
      year: '2013-2017',
      text: '75+ events across 20+ venues; 40+ independent sales rep program at F4mily Matters (CRM, field onboarding).',
    },
    {
      label: 'Marketing consulting',
      year: '2017-2021',
      text: 'Creator and small-business martech/brand work; lead-gen app with 5,000+ podcast leads (Ace the Game, 2019).',
    },
  ] satisfies CvOtherWork[],
}

export const education = {
  school: 'Bloom Institute of Technology',
  program: 'Full-Stack Web Development',
  years: '2023-2024',
  certifications: [
    'HubSpot (Inbound, Email, Growth-Driven Design)',
    'SEMrush (SEO Fundamentals, Technical SEO)',
    'Google Fundamentals of Digital Marketing',
  ],
}

/** Numbers taken straight from the bullets above, for at-a-glance views. */
export const highlights: { value: string; label: string }[] = [
  { value: '20,000+', label: 'community members scaled' },
  { value: '100+', label: 'Docker containers operated' },
  { value: '30+', label: 'self-hosted services run' },
  { value: '75+', label: 'events promoted' },
  { value: '300+', label: 'artists on a membership platform' },
]
