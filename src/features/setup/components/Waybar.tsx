import type { NowPlaying } from '@/lib/integrations/lastfm-history-types'

import s from '../setup.module.css'
import { WaybarClock } from './WaybarClock'

// Waybar's mpris module caps the label at 40 characters.
const MAX_LABEL = 40
const clip = (text: string) =>
  text.length > MAX_LABEL ? `${text.slice(0, MAX_LABEL - 1)}…` : text

/**
 * The bar from the owner's waybar.nix: workspaces, now playing, CPU, memory,
 * volume, notifications and the clock. Everything but the track and clock is
 * a placeholder.
 */
export function Waybar({ nowPlaying }: { nowPlaying: NowPlaying }) {
  return (
    <div className={s.dkBar}>
      <span className={s.dkWs} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} data-on={n === 1}>
            {n}
          </i>
        ))}
      </span>
      <span className={s.dkMid}>
        {nowPlaying && (
          <a href={nowPlaying.url}>
            {clip(
              `${nowPlaying.artist} - ${nowPlaying.name}${nowPlaying.nowPlaying ? '' : ' (paused)'}`,
            )}
          </a>
        )}
      </span>
      <span className={s.dkEnd} aria-hidden="true">
        <span>C 4%</span>
        <span>M 12%</span>
        <span>O 40%</span>
        <span>I 100%</span>
        <span className={s.dkBell}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          7
        </span>
        <WaybarClock />
      </span>
    </div>
  )
}
