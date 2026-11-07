import { SiLastdotfm } from 'react-icons/si'

import { Panel } from '@/components/ui/Panel'
import { StatRow } from '@/components/ui/StatRow'
import { person } from '@/content'
import { cx } from '@/lib/cx'
import { formatNumber as nf } from '@/lib/formatNumber'
import type {
  GenresByPeriod,
  LastfmStats,
  NowPlaying,
  TopCharts as TopChartsData,
} from '@/lib/integrations/lastfm-history-types'
import type { LastfmFavorites } from '@/lib/integrations/types'

import { MusicSplit } from '../components/MusicSplit'
import { NowPlayingCard } from '../components/NowPlayingCard'

import s from '../music.module.css'
import ui from '@/components/ui/ui.module.css'

type Props = {
  favorites: LastfmFavorites | null
  charts: TopChartsData | null
  stats: LastfmStats | null
  nowPlaying: NowPlaying
  genres: GenresByPeriod | null
}

/** Last.fm listening: now playing, totals, then charts and a genre map. */
export function ListeningSection({
  favorites,
  charts,
  stats,
  nowPlaying,
  genres,
}: Props) {
  return (
    <Panel labelledBy="fav">
      <div className={s.favTop}>
        <h3 id="fav" className={ui.h2}>
          Music I&apos;ve been listening to
        </h3>
        <a className={s.via} href={person.links.lastfm}>
          <SiLastdotfm aria-hidden="true" />
          via Last.fm
        </a>
        {nowPlaying && <NowPlayingCard data={nowPlaying} />}
        {stats && (
          <StatRow
            items={[
              ['Scrobbles', nf(stats.scrobbles)],
              ['Artists', nf(stats.artists)],
              ['Albums', nf(stats.albums)],
              ['Tracks', nf(stats.tracks)],
            ]}
          />
        )}
      </div>
      {charts ? (
        <MusicSplit charts={charts} genres={genres} />
      ) : favorites ? (
        <div className={s.fav}>
          <div className={s.favCol}>
            <h4 style={{ margin: 0 }} className={ui.quiet}>
              Top artists, last 6 months
            </h4>
            <ol className={s.favList} style={{ marginTop: 12 }}>
              {favorites.topArtists.slice(0, 6).map((a) => (
                <li key={a.name}>
                  <a href={a.url}>{a.name}</a>
                  <span className={cx(s.favPlays, ui.mono)}>{nf(a.plays)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className={s.favCol}>
            <h4 style={{ margin: 0 }} className={ui.quiet}>
              Top tracks, last 6 months
            </h4>
            <ol className={s.favList} style={{ marginTop: 12 }}>
              {favorites.topTracks.slice(0, 6).map((t) => (
                <li key={`${t.artist}-${t.name}`}>
                  <a href={t.url}>
                    {t.name}
                    <small>{t.artist}</small>
                  </a>
                  <span className={cx(s.favPlays, ui.mono)}>{nf(t.plays)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <p className={ui.body}>
          The live listening stats are offline right now. The playlists above
          are the short version of my taste, and my full history is on Last.fm.
        </p>
      )}
    </Panel>
  )
}
