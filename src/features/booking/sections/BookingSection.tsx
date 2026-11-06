import { CalIcon } from '@/components/CalIcon'
import { Panel } from '@/components/ui/Panel'
import { PanelHeader, PanelLink, PanelNote } from '@/components/ui/PanelHeader'
import { person } from '@/content'
import type { CalAvailability } from '@/lib/integrations/types'

import { Booker } from '../components/Booker'
import { EmailScheduler } from '../components/EmailScheduler'

/** Book a call from live Cal.com availability, or propose a time by email. */
export function BookingSection({
  availability,
}: {
  availability: CalAvailability | null
}) {
  return (
    <Panel id="schedule-a-call" labelledBy="bk">
      <PanelHeader
        id="bk"
        title={availability ? 'Schedule a call with me' : 'Propose a time'}
        aside={
          availability ? (
            <PanelLink
              href={person.links.cal}
              icon={<CalIcon style={{ width: 16, height: 16 }} />}
            >
              via Cal
            </PanelLink>
          ) : (
            <PanelNote>Email, not a booking system.</PanelNote>
          )
        }
      />
      {availability ? (
        <Booker availability={availability} />
      ) : (
        <EmailScheduler />
      )}
    </Panel>
  )
}
