import { Panel } from '@/components/ui/Panel'
import { PanelHeader } from '@/components/ui/PanelHeader'

import { ApiPlayground } from '../components/ApiPlayground'
import s from '../home.module.css'

export function ApiSection() {
  return (
    <Panel id="api" labelledBy="api-h">
      <PanelHeader
        id="api-h"
        title={
          <>
            There is an API, <br className={s.phoneBreak} />
            because why not
          </>
        }
      />
      <ApiPlayground />
    </Panel>
  )
}
