'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** False during server render and hydration, true once mounted in the browser. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
