'use client'

import { useNow } from '@/hooks/useNow'
import type { NowPlaying } from '@/lib/integrations/lastfm-history-types'
import { relativeTime } from '@/lib/relativeTime'

import s from '../music.module.css'

/** The current (or most recent) Last.fm track, with cover art when it has any. */
export function NowPlayingCard({ data }: { data: NonNullable<NowPlaying> }) {
  const now = useNow(30_000)

  return (
    <div className={s.npGrid} role="status">
      <span
        className={`${s.npBars} ${data.nowPlaying ? s.npLive : ''}`}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={s.npState}>
        {data.nowPlaying
          ? 'Now playing'
          : data.at
            ? `Last played ${now ? `${relativeTime(data.at, now)} ago` : 'recently'}`
            : 'Last played'}
      </span>
      <a className={s.npName} href={data.url}>
        {data.artist} - {data.name}
      </a>
    </div>
  )
}
