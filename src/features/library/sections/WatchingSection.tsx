import { SiTrakt } from 'react-icons/si'

import { Panel } from '@/components/ui/Panel'
import { PanelHeader, PanelLink } from '@/components/ui/PanelHeader'
import { StatRow } from '@/components/ui/StatRow'
import { formatNumber } from '@/lib/formatNumber'
import type { TraktActivity } from '@/lib/integrations/types'

import { Shelf } from '../components/Shelf'
import { uniqueTitles, watchSubtitle } from '../watching'

/** Trakt: lifetime totals and the titles watched most recently. */
export function WatchingSection({ trakt }: { trakt: TraktActivity }) {
  const { totals, username } = trakt

  return (
    <Panel span={6} labelledBy="watch-h">
      <PanelHeader
        id="watch-h"
        title="What I've been watching"
        aside={
          <PanelLink
            href={`https://trakt.tv/users/${username}`}
            icon={<SiTrakt aria-hidden="true" />}
          >
            via Trakt
          </PanelLink>
        }
      />
      <Shelf
        stats={
          <StatRow
            items={[
              ['Movies', formatNumber(totals.movies)],
              ['Shows', formatNumber(totals.shows)],
              ['Episodes', formatNumber(totals.episodes)],
              ['Time', `${formatNumber(Math.round(totals.minutes / 60))}h`],
            ]}
          />
        }
        items={uniqueTitles(trakt.recent)
          .slice(0, 24)
          .map((w) => ({
            id: w.id,
            href: w.url,
            title: w.title,
            subtitle: watchSubtitle(w),
            image: w.poster,
          }))}
      />
    </Panel>
  )
}
