import type { Stack } from './types'

export const stacks: Stack[] = [
  {
    id: 'media',
    tab: 'Media platform',
    title: 'Petabyte-scale media platform',
    where: 'Blackbeard Media Group, 2022 to 2023',
    tiers: [
      { label: 'ingress', nodes: ['Traefik', 'Authelia'], hot: true },
      { label: 'services', nodes: ['100+ Docker containers', 'Portainer'] },
      { label: 'storage', nodes: ['Ceph'] },
      { label: 'metal', nodes: ['Hetzner bare metal', 'Ansible'] },
    ],
    bullets: [
      'Ran the platform as system administrator on rented bare metal rather than a cloud provider.',
      'More than 100 containers, managed through Portainer.',
      'Traefik routed traffic and Authelia handled sign-in in front of it.',
      'Ceph for storage, Ansible for configuration.',
    ],
  },
  {
    id: 'community',
    tab: 'Community platform',
    title: 'Linux community on self-hosted services',
    where: 'All Things Linux, 2023 to 2026',
    tiers: [
      { label: 'identity', nodes: ['OIDC identity hub'], hot: true },
      { label: 'bridge', nodes: ['Discord / IRC / XMPP bridge'] },
      {
        label: 'services',
        nodes: ['30+ self-hosted services', 'Docker Compose'],
      },
      { label: 'infra', nodes: ['Ansible', 'Terraform', 'Cloudflare Workers'] },
    ],
    bullets: [
      'One identity hub in front of the self-hosted services for a community of 20K+ members.',
      'A bridge that joins Discord, IRC, and XMPP chat.',
      'More than 30 services on Docker Compose.',
      'Provisioned with Ansible and Terraform, with Cloudflare Workers at the edge.',
    ],
  },
  {
    id: 'trading',
    tab: 'Trading terminal',
    title: 'Terminal-style prediction-market interface',
    where: 'Doji, 2026 to present',
    tiers: [
      { label: 'client', nodes: ['Next.js 16', 'React 19'], hot: true },
      { label: 'live', nodes: ['WebSockets'] },
      { label: 'api', nodes: ['Hono', 'tRPC'] },
      { label: 'data', nodes: ['PostgreSQL', 'Drizzle'] },
    ],
    bullets: [
      'Charts, watchlists, and live order books for Polymarket markets.',
      'Market data reaches the browser over WebSockets.',
      'Hono and tRPC form the typed API; PostgreSQL through Drizzle stores the data.',
      'Deployed on Vercel. Still running, and I am a co-founder.',
    ],
  },
  {
    id: 'erp',
    tab: 'Business ERP',
    title: 'Custom ERP for a garment printer',
    where: 'PrintBliss, 2023 to 2024',
    tiers: [
      {
        label: 'records',
        nodes: ['Airtable', '20+ automation scripts'],
        hot: true,
      },
      { label: 'api', nodes: ['Express / TypeScript', 'OpenAPI + Zod'] },
      { label: 'glue', nodes: ['Make'] },
      { label: 'services', nodes: ['Stripe', 'PandaDoc', 'Twilio'] },
    ],
    bullets: [
      'Moved the shop off its old setup onto Airtable as the system of record.',
      'More than 20 automation scripts around it.',
      'A typed Express API described with OpenAPI and validated with Zod.',
      'Make, Stripe, PandaDoc, and Twilio connect quoting, payment, documents, and messages.',
    ],
  },
  {
    id: 'llm',
    tab: 'LLM pipeline',
    title: 'Extraction pipeline behind a map',
    where: 'gang.guide, personal project',
    tiers: [
      { label: 'extract', nodes: ['Python', 'Claude'], hot: true },
      { label: 'check', nodes: ['Adjudication'] },
      { label: 'merge', nodes: ['Consensus merge'] },
      { label: 'serve', nodes: ['SvelteKit 5 + Konva', 'Cloudflare Workers'] },
    ],
    bullets: [
      'Claude extracts structured facts from source material using Python.',
      'Disagreements go through an adjudication step, then a consensus merge.',
      'The result is an interactive map of U.S. criminal organizations.',
      'A SvelteKit front end draws the canvas graph with Konva on Cloudflare Workers.',
    ],
  },
]
