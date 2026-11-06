import type { GithubEventKind } from '@/lib/integrations/types'

/** Label and icon path for each kind of GitHub event. */
export const KIND: Record<GithubEventKind, { label: string; d: string }> = {
  push: { label: 'Push', d: 'M12 3v6m0 6v6M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z' },
  pr: {
    label: 'Pull request',
    d: 'M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-12a3 3 0 1 0 0 .01M18 21V9a4 4 0 0 0-4-4h-3m0 0 3-3m-3 3 3 3',
  },
  issue: { label: 'Issue', d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9v.01' },
  comment: { label: 'Comment', d: 'M4 5h16v11H9l-5 4V5Z' },
  review: {
    label: 'Review',
    d: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  },
  branch: {
    label: 'Branches',
    d: 'M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-6a3 3 0 1 0 0-.01M18 9a9 9 0 0 1-9 9',
  },
  other: { label: 'Other', d: 'M12 12h.01' },
}
