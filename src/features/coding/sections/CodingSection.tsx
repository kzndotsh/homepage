import { SiGithub } from 'react-icons/si'

import { Panel } from '@/components/ui/Panel'
import { PanelHeader, PanelLink } from '@/components/ui/PanelHeader'
import { person } from '@/content'
import type { GithubActivity } from '@/lib/integrations/types'

import { GithubLive } from '../components/GithubLive'

import s from '../coding.module.css'

export function CodingSection({ github }: { github: GithubActivity | null }) {
  return (
    <Panel id="live" labelledBy="liveh">
      <PanelHeader
        id="liveh"
        title="Code I've been shipping"
        aside={
          <PanelLink
            href={person.links.github}
            icon={<SiGithub aria-hidden="true" />}
          >
            via GitHub
          </PanelLink>
        }
      />
      {github ? (
        <GithubLive data={github} />
      ) : (
        <div className={s.empty}>
          The live feed is quiet at the moment. Everything I build in the open
          is on <a href={person.links.github}>github.com/kzndotsh</a>.
        </div>
      )}
    </Panel>
  )
}
