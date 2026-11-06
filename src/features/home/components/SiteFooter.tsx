import { SiGithub } from 'react-icons/si'

import { site } from '@/config/site'

import s from '../home.module.css'
import { EggButton } from './EggButton'

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
        <a className={s.footSource} href={site.repo}>
          <SiGithub aria-hidden="true" />
          View source
        </a>
      </div>
    </footer>
  )
}
