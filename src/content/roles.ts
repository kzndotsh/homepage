import type { Role } from './types'

// Only facts from the owner's resume. Do not add numbers or claims.
export const roles: Role[] = [
  {
    title: 'Co-Founder & Full-Stack Engineer',
    org: 'Doji',
    start: '2026',
    end: 'Present',
    blurb:
      'Terminal-style Polymarket prediction-market platform: Next.js 16 + React 19, live WebSocket market data, Hono + tRPC, PostgreSQL (Drizzle).',
  },
  {
    title: 'Founder & Full-Stack Engineer',
    org: 'All Things Linux',
    start: '2023',
    end: '2026',
    blurb:
      'Linux education nonprofit community: OIDC identity hub, Discord/IRC/XMPP bridge, 30+ self-hosted services on Docker Compose, Ansible, Terraform.',
  },
  {
    title: 'Shopify Developer (contract)',
    org: 'BloxMania',
    start: '2025',
    end: '2025',
    blurb:
      'Replatformed a digital-goods marketplace to a custom Shopify 2.0 theme with a Node.js theme pipeline.',
  },
  {
    title: 'Solutions Engineer (contract)',
    org: 'PrintBliss',
    start: '2023',
    end: '2024',
    blurb:
      'Migrated a garment printer to a custom Airtable ERP with 20+ automation scripts and a typed Express/OpenAPI API.',
  },
  {
    title: 'System Administrator',
    org: 'Blackbeard Media Group',
    start: '2022',
    end: '2023',
    blurb:
      'Petabyte-scale media platform on Hetzner bare metal: 100+ Docker containers, Ceph, Ansible, Traefik, Authelia.',
  },
  {
    title: 'Business Solutions Manager',
    org: 'F4mily Matters',
    start: '2020',
    end: '2021',
    blurb:
      'Sales ops and business systems for a custom apparel brand: automations linking Printavo, Jotform, Airtable, Trello.',
  },
  {
    title: 'Founder',
    org: 'Artists at Scale',
    start: '2018',
    end: '2020',
    blurb: 'WordPress membership platform for 300+ artists.',
  },
  {
    title: 'Event promoter',
    org: 'Independent, Charlotte',
    start: '2013',
    end: '2017',
    blurb: '75+ events across 20+ venues.',
  },
]
