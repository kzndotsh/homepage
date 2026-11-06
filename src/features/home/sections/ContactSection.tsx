import type { ReactNode } from 'react'
import { FaLinkedin } from 'react-icons/fa6'
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiLastdotfm,
  SiSpotify,
  SiTrakt,
  SiX,
} from 'react-icons/si'

import { CalIcon } from '@/components/CalIcon'
import { HardcoverIcon } from '@/components/HardcoverIcon'
import { Panel } from '@/components/ui/Panel'
import { person } from '@/content'

import { CopyTile } from '../components/CopyTile'
import s from '../home.module.css'
import ui from '@/components/ui/ui.module.css'

const SIZE = 20

// Email has no brand of its own, so it gets a plain envelope.
const Mail = () => (
  <svg
    viewBox="0 0 24 24"
    width={SIZE}
    height={SIZE}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 7l9 6 9-6M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
  </svg>
)

/** The account name at the end of a profile URL: github.com/kzndotsh gives kzndotsh. */
const handle = (url: string) =>
  new URL(url).pathname.split('/').filter(Boolean).pop()!.replace(/^@/, '')

export function ContactSection() {
  const { links } = person
  const rows: {
    href?: string
    brand: string
    name: string
    note: string
    icon: ReactNode
  }[] = [
    {
      href: links.email,
      brand: 'email',
      name: 'Email',
      note: person.email,
      icon: <Mail />,
    },
    {
      href: links.github,
      name: 'GitHub',
      brand: 'github',
      note: handle(links.github),
      icon: <SiGithub size={SIZE} aria-hidden="true" />,
    },
    {
      href: links.linkedin,
      name: 'LinkedIn',
      brand: 'linkedin',
      note: handle(links.linkedin),
      icon: <FaLinkedin size={SIZE} aria-hidden="true" />,
    },
    {
      href: links.x,
      name: 'X',
      brand: 'x',
      note: handle(links.x),
      icon: <SiX size={SIZE - 3} aria-hidden="true" />,
    },
    {
      href: links.instagram,
      name: 'Instagram',
      brand: 'instagram',
      note: handle(links.instagram),
      icon: <SiInstagram size={SIZE} aria-hidden="true" />,
    },
    {
      name: 'Discord',
      brand: 'discord',
      note: person.discord,
      icon: <SiDiscord size={SIZE} aria-hidden="true" />,
    },
    {
      href: links.spotify,
      name: 'Spotify',
      brand: 'spotify',
      note: handle(links.spotify),
      icon: <SiSpotify size={SIZE} aria-hidden="true" />,
    },
    {
      href: links.lastfm,
      name: 'Last.fm',
      brand: 'lastfm',
      note: handle(links.lastfm),
      icon: <SiLastdotfm size={SIZE} aria-hidden="true" />,
    },
    {
      href: links.hardcover,
      name: 'Hardcover',
      brand: 'hardcover',
      note: handle(links.hardcover),
      icon: <HardcoverIcon width="auto" height={SIZE} />,
    },
    {
      href: links.trakt,
      name: 'Trakt',
      brand: 'trakt',
      note: handle(links.trakt),
      icon: <SiTrakt size={SIZE} aria-hidden="true" />,
    },
    {
      href: links.cal,
      name: 'Cal.com',
      brand: 'cal',
      note: handle(links.cal),
      icon: <CalIcon width={SIZE} height={SIZE} />,
    },
  ]

  return (
    <Panel id="contact" labelledBy="ct">
      <h2 id="ct" className={ui.h2}>
        Connect with me
      </h2>
      <ul className={s.signs}>
        {rows.map((r) => {
          // Discord has a username but no profile URL, so it copies instead.
          if (!r.href) {
            return (
              <li key={r.name}>
                <CopyTile
                  icon={r.icon}
                  name={r.name}
                  note={r.note}
                  text={r.note}
                  brand={r.brand}
                />
              </li>
            )
          }
          return (
            <li key={r.name}>
              <a href={r.href} className={s.sign}>
                <span
                  className={s.signIcon}
                  style={{
                    background: `var(--brand-${r.brand}-bg)`,
                    color: `var(--brand-${r.brand}-fg)`,
                  }}
                >
                  {r.icon}
                </span>
                <span className={s.signName}>{r.name}</span>
                <span className={s.signNote}>{r.note}</span>
                <span className={s.signArrow} aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
