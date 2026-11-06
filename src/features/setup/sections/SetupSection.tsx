import { SiGithub, SiNixos } from 'react-icons/si'

import { Panel } from '@/components/ui/Panel'
import { PanelHeader, PanelLink } from '@/components/ui/PanelHeader'
import type { NowPlaying } from '@/lib/integrations/lastfm-history-types'

import { Prompt } from '../components/Prompt'
import { Waybar } from '../components/Waybar'
import { DOTFILES_URL, FETCH_INFO, SWATCHES } from '../data'
import s from '../setup.module.css'
import ui from '@/components/ui/ui.module.css'

/** A Sway desktop sketch: a fetch, the dotfiles link, the palette, Waybar. */
export function SetupSection({ nowPlaying }: { nowPlaying: NowPlaying }) {
  return (
    <Panel id="setup" labelledBy="dk-h">
      <PanelHeader
        id="dk-h"
        title="My dotfiles I run daily"
        aside={
          <PanelLink href={DOTFILES_URL} icon={<SiGithub aria-hidden="true" />}>
            via GitHub
          </PanelLink>
        }
      />
      <div className={s.dk}>
        <div className={s.dkTiles}>
          <div className={`${s.dkWin} ${s.dkFocus}`}>
            <div className={`${ui.mono} ${s.dkBody}`}>
              <Prompt command="fastfetch" />
              <div className={s.dkFetch}>
                <SiNixos className={s.dkLogo} aria-hidden="true" />
                <dl className={s.dkRows}>
                  {FETCH_INFO.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <div className={s.dkWin}>
            <div className={`${ui.mono} ${s.dkBody}`}>
              <Prompt command="git remote get-url origin" />
              <a className={s.dkLink} href={DOTFILES_URL}>
                {DOTFILES_URL}
              </a>
            </div>
          </div>
          <div className={s.dkWin}>
            <div className={`${ui.mono} ${s.dkBody} ${s.dkFill}`}>
              <Prompt command="colors" />
              <div className={s.dkSwatches} aria-label="Tokyo Night palette">
                {SWATCHES.map(([name, color]) => (
                  <span key={name} title={name} style={{ background: color }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Waybar nowPlaying={nowPlaying} />
      </div>
    </Panel>
  )
}
