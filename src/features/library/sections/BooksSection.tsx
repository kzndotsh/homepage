import { HardcoverIcon } from '@/components/HardcoverIcon'
import { Panel } from '@/components/ui/Panel'
import { PanelHeader, PanelLink } from '@/components/ui/PanelHeader'
import { StatRow } from '@/components/ui/StatRow'
import { formatNumber } from '@/lib/formatNumber'
import type { HardcoverLibrary } from '@/lib/integrations/types'

import { Shelf } from '../components/Shelf'
import { libraryStats } from '../libraryStats'

/** Hardcover: reading totals and the books finished most recently. */
export function BooksSection({ library }: { library: HardcoverLibrary }) {
  const { books, username } = library
  const stats = libraryStats(books)

  return (
    <Panel id="library" span={6} labelledBy="books-h">
      <PanelHeader
        id="books-h"
        title="Books I've been reading"
        aside={
          <PanelLink
            href={`https://hardcover.app/@${username}`}
            icon={<HardcoverIcon style={{ width: 'auto', height: 16 }} />}
          >
            via Hardcover
          </PanelLink>
        }
      />
      <Shelf
        stats={
          <StatRow
            items={[
              ['Read', formatNumber(stats.count)],
              ['Pages', formatNumber(stats.pages)],
              [
                'Avg length',
                stats.avgPages ? formatNumber(stats.avgPages) : '–',
              ],
              ['Authors', formatNumber(stats.authors)],
            ]}
          />
        }
        items={books.slice(0, 24).map((b) => ({
          id: b.id,
          href: b.url,
          title: b.title,
          subtitle: b.author,
          tooltip: `${b.title} — ${b.author}`,
          image: b.cover,
        }))}
      />
    </Panel>
  )
}
