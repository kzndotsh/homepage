import { Panel } from '@/components/ui/Panel'
import { PanelHeader } from '@/components/ui/PanelHeader'

import { ApiPlayground } from '../components/ApiPlayground'

export function ApiSection() {
  return (
    <Panel id="api" labelledBy="api-h">
      <PanelHeader id="api-h" title="There is an API, because why not" />
      <ApiPlayground />
    </Panel>
  )
}
