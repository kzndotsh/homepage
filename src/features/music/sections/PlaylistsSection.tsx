import Image from 'next/image'
import { SiSpotify } from 'react-icons/si'

import { Panel } from '@/components/ui/Panel'
import { PanelHeader, PanelLink } from '@/components/ui/PanelHeader'
import { ScrollRow } from '@/components/ui/ScrollRow'
import { person, playlists, playlistsIntro } from '@/content'
import { formatNumber } from '@/lib/formatNumber'
import type { SpotifyPlaylistInfo } from '@/lib/integrations/types'

import { GenreFlow } from '../components/GenreFlow'
import { findPlaylistInfo } from '../findPlaylistInfo'
import s from '../music.module.css'

const EMPHASIS = 'always shuffle'
const emphasisAt = playlistsIntro.indexOf(EMPHASIS)

export function PlaylistsSection({
  spotify,
}: {
  spotify: Record<string, SpotifyPlaylistInfo> | null
}) {
  return (
    <Panel id="music" labelledBy="mus">
      <PanelHeader
        id="mus"
        title="Playlists I curate"
        aside={
          <PanelLink
            href={person.links.spotify}
            icon={<SiSpotify aria-hidden="true" />}
          >
            via Spotify
          </PanelLink>
        }
      />
      <p className={s.shuffleNote}>
        {emphasisAt < 0 ? (
          playlistsIntro
        ) : (
          <>
            {playlistsIntro.slice(0, emphasisAt)}
            <b>{EMPHASIS}</b>
            {playlistsIntro.slice(emphasisAt + EMPHASIS.length)}
          </>
        )}
      </p>
      <ScrollRow className={s.pls}>
        {playlists.map((p) => {
          const info = findPlaylistInfo(spotify, p.name)
          return (
            <li key={p.name} className={s.pl}>
              <a
                className={s.plCover}
                href={p.href}
                aria-label={`${p.name} on Spotify`}
              >
                <Image src={p.cover} alt="" sizes="128px" />
              </a>
              <div className={s.plBody}>
                <div className={s.plHead}>
                  <h3 className={s.plName}>
                    <a href={p.href}>{p.name}</a>
                  </h3>
                  <a
                    className={s.plSpotify}
                    href={p.href}
                    aria-label={`Open ${p.name} on Spotify`}
                  >
                    <SiSpotify aria-hidden="true" />
                  </a>
                </div>
                <p className={s.plStat}>
                  {info && <span>{formatNumber(info.trackCount)} tracks</span>}
                  <span>{p.genres.length} genres</span>
                  {info && info.followers !== null && (
                    <span>
                      {formatNumber(info.followers)}{' '}
                      {info.followers === 1 ? 'follower' : 'followers'}
                    </span>
                  )}
                </p>
                <GenreFlow
                  genres={p.genres}
                  label={`${p.name} genres`}
                  name={p.name}
                />
              </div>
            </li>
          )
        })}
      </ScrollRow>
    </Panel>
  )
}
