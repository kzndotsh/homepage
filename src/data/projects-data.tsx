import { type ReactNode } from 'react'
import { FaGithub, FaReact } from 'react-icons/fa'

import { TbBrandNextjs, TbBrandTailwind, TbMarkdown } from 'react-icons/tb'

import {
  SiNixos,
  SiMui,
  SiSupabase,
  SiVite,
  SiReactrouter,
  SiRedux,
  SiExpress,
  SiChakraui,
  SiAxios,
  SiPython,
  SiGrafana,
  SiMariadb,
  SiDiscord,
  SiPostgresql,
  SiDocker,
  SiShopify,
  SiTypescript,
  SiNodedotjs,
  SiPrisma,
  SiTailwindcss,
  SiAuth0,
  SiRedis,
  SiSentry,
  SiSvelte,
  SiCloudflare,
  SiJavascript,
  SiSpotify,
  SiSway,
} from 'react-icons/si'

export type ProjectStackItem = {
  name: string
  logo: ReactNode
}

export type Project = {
  name: string
  description: string
  link: {
    href: string
    label: string
  }
  logo: ReactNode
  stack?: ProjectStackItem[]
}

const projects: Project[] = [
  // gang.guide
  {
    name: 'gang.guide',
    description:
      'Evidence-backed mapping of criminal organizations across the US — alliances, rivalries, history, and culture. LLM extraction pipeline + interactive Konva canvas (SvelteKit, Python, Cloudflare Workers).',
    link: {
      href: 'https://github.com/kzndotsh/gang.guide',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'SvelteKit',
        logo: <SiSvelte />,
      },
      {
        name: 'Python',
        logo: <SiPython />,
      },
      {
        name: 'Cloudflare',
        logo: <SiCloudflare />,
      },
    ],
  },
  // crate digger
  {
    name: 'Crate Digger',
    description:
      'Spicetify extension for keyboard-first crate digging — number keys dump the current track into bound playlists, HUD above the seek bar, optional like-cleaner.',
    link: {
      href: 'https://github.com/kzndotsh/spicetify-cratedigger',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'JavaScript',
        logo: <SiJavascript />,
      },
      {
        name: 'Spotify',
        logo: <SiSpotify />,
      },
    ],
  },
  // bloxmania
  {
    name: 'BloxMania',
    description:
      'High-performance Shopify 2.0 theme for digital goods (Roblox/Fortnite) with modular Tailwind design system and custom Node.js build pipeline.',
    link: {
      href: 'https://github.com/kzndotsh/bloxmania',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Shopify',
        logo: <SiShopify />,
      },
      {
        name: 'Tailwind CSS',
        logo: <SiTailwindcss />,
      },
      {
        name: 'Node.js',
        logo: <SiNodedotjs />,
      },
    ],
  },
  // chat360
  {
    name: 'Chat360',
    description:
      'Real-time voice party chat — Agora WebRTC (AI denoising, VAD), Supabase auth + realtime presence, Xbox-inspired UI (Next.js 15, TypeScript, Tailwind, shadcn, Zustand).',
    link: {
      href: 'https://github.com/kzndotsh/chat360',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Next.js',
        logo: <TbBrandNextjs />,
      },
      {
        name: 'TypeScript',
        logo: <SiTypescript />,
      },
      {
        name: 'Supabase',
        logo: <SiSupabase />,
      },
      {
        name: 'Tailwind CSS',
        logo: <SiTailwindcss />,
      },
    ],
  },
  // coinswiper
  {
    name: 'CoinSwiper',
    description:
      'Full-stack Solana token voting — swipe bullish/bearish on live DexScreener pairs, persisted votes, aggregated leaderboards (Next.js 15, Prisma, TypeScript, shadcn).',
    link: {
      href: 'https://github.com/kzndotsh/coinswiper',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Next.js',
        logo: <TbBrandNextjs />,
      },
      {
        name: 'TypeScript',
        logo: <SiTypescript />,
      },
      {
        name: 'Prisma',
        logo: <SiPrisma />,
      },
      {
        name: 'Tailwind CSS',
        logo: <SiTailwindcss />,
      },
    ],
  },
  // human rights first
  {
    name: 'Human Rights First',
    description:
      'React-based web application with Auth0 authentication, dynamic user profiles, and real data visualization replacing dummy data.',
    link: {
      href: 'https://github.com/kzndotsh/human-rights-first',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'React',
        logo: <FaReact />,
      },
      {
        name: 'Auth0',
        logo: <SiAuth0 />,
      },
    ],
  },
  // homepage
  {
    name: 'homepage',
    description:
      'Browse the source code that powers this website - base template by TailwindUI',
    link: {
      href: 'https://github.com/kzndotsh/homepage',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Next.js',
        logo: <TbBrandNextjs />,
      },
      {
        name: 'Tailwind CSS',
        logo: <TbBrandTailwind />,
      },
      {
        name: 'MDX',
        logo: <TbMarkdown />,
      },
    ],
  },
  // dotfiles
  {
    name: 'dotfiles',
    description:
      'NixOS flake for ikigai — my Sway daily driver, a throwaway hardened libvirt VM, and kzn.sh on Hetzner. Declarative system modules only (no Home Manager): explicit per-host imports, sops-nix secrets, Terranix/OpenTofu infra, Tokyo Night theming, PipeWire pro-audio, gaming, local AI, and more.',
    link: { href: 'https://github.com/kzndotsh/dotfiles', label: 'github.com' },
    logo: <FaGithub />,
    stack: [
      {
        name: 'NixOS',
        logo: <SiNixos />,
      },
      {
        name: 'Sway',
        logo: <SiSway />,
      },
      {
        name: 'Docker',
        logo: <SiDocker />,
      },
      {
        name: 'Cloudflare',
        logo: <SiCloudflare />,
      },
    ],
  },
  // tux
  {
    name: 'tux',
    description:
      'Open-source Discord bot — moderation cases, XP/leveling, snippets, plugin system (Python, discord.py, SQLModel, PostgreSQL, Redis, ~690 tests, Sentry, Docker).',
    link: {
      href: 'https://github.com/allthingslinux/tux',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Python',
        logo: <SiPython />,
      },
      {
        name: 'Discord.py',
        logo: <SiDiscord />,
      },
      {
        name: 'PostgreSQL',
        logo: <SiPostgresql />,
      },
      {
        name: 'Redis',
        logo: <SiRedis />,
      },
      {
        name: 'Sentry',
        logo: <SiSentry />,
      },
    ],
  },
  // keeptrack
  {
    name: 'keeptrack',
    description:
      'Simple contact manager built with React, Material UI, Supabase, Vite, and more.',
    link: {
      href: 'https://github.com/kzndotsh/keeptrack',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'React',
        logo: <FaReact />,
      },
      {
        name: 'Material UI',
        logo: <SiMui />,
      },
      {
        name: 'Supabase',
        logo: <SiSupabase />,
      },
      {
        name: 'Vite',
        logo: <SiVite />,
      },
    ],
  },
  // state
  {
    name: 'state',
    description:
      'State management demo app using React, React Router, Redux, Yup, Axios, and Express.',
    link: {
      href: 'https://github.com/kzndotsh/state',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'React',
        logo: <FaReact />,
      },
      {
        name: 'React Router',
        logo: <SiReactrouter />,
      },
      {
        name: 'Redux',
        logo: <SiRedux />,
      },
      {
        name: 'Express.js',
        logo: <SiExpress />,
      },
      {
        name: 'Axios',
        logo: <SiAxios />,
      },
    ],
  },
  // todo
  {
    name: 'todo',
    description:
      'Simple todo app implementing CRUD operations using React, Chakra UI, and Vite.',
    link: {
      href: 'https://github.com/kzndotsh/todo',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'React',
        logo: <FaReact />,
      },
      {
        name: 'Chakra UI',
        logo: <SiChakraui />,
      },
      {
        name: 'Vite',
        logo: <SiVite />,
      },
    ],
  },
  // qbit-peers
  {
    name: 'qBit Peers',
    description:
      'Geographic visualization data source for qBittorrent and Grafana using Python, MariaDB, Docker, and more.',
    link: {
      href: 'https://github.com/kzndotsh/qbit-peers',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Python',
        logo: <SiPython />,
      },
      {
        name: 'Grafana',
        logo: <SiGrafana />,
      },
      {
        name: 'MariaDB',
        logo: <SiMariadb />,
      },
      {
        name: 'Docker',
        logo: <SiDocker />,
      },
    ],
  },
]

export default projects
