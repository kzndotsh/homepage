import { SiGithub } from 'react-icons/si'

import { RefIcon } from '@/components/RefIcon'
import { site } from '@/config/site'
import { cx } from '@/lib/cx'

import { EggButton } from './EggButton'

import s from '../home.module.css'
import ui from '@/components/ui/ui.module.css'

/**
 * Each glyph with the space to add after it, in em. Measured from Manrope 800
 * ink bounds so every visible gap is 0.07em (the font's own spacing is uneven).
 */
const WORDMARK: readonly (readonly [string, number])[] = [
  ['k', 0.081],
  ['z', -0.028],
  ['n', -0.066],
  ['.', -0.047],
  ['s', -0.024],
  ['h', 0],
]

// Set at build time in next.config.mjs.
const SHA = process.env.NEXT_PUBLIC_GIT_SHA

export function SiteFooter() {
  return (
    <footer className={s.foot}>
      <p className={s.footWord} aria-hidden="true">
        {WORDMARK.map(([ch, gap]) => (
          <span key={ch} style={{ marginRight: `${gap}em` }}>
            {ch}
          </span>
        ))}
      </p>
      <div className={s.footRow}>
        <span>
          Made with{' '}
          <a href="/coffee" className={s.footCoffee} aria-label="coffee">
            ☕
          </a>{' '}
          and ❤️
        </span>
        <EggButton />
        <div className={s.footRight}>
          <a className={s.footSource} href={site.repo}>
            <SiGithub aria-hidden="true" />
            View source
          </a>
          {SHA && (
            <a
              className={cx(s.footSha, ui.mono)}
              href={`${site.repo}/commit/${SHA}`}
              title="The commit this build is made from"
            >
              <RefIcon kind="commit" />
              {SHA}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
