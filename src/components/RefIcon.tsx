const LABEL = {
  pr: 'Pull request',
  issue: 'Issue',
  commit: 'Commit',
  diff: 'Changes',
} as const

/** The small glyph before a pull request number, an issue number or a commit hash, 12px, in the text colour. */
export function RefIcon({
  kind,
  className,
}: {
  kind: 'pr' | 'issue' | 'commit' | 'diff'
  className?: string
}) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={LABEL[kind]}
      role="img"
    >
      {kind === 'pr' && (
        <>
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <path d="M13 6h3a2 2 0 0 1 2 2v7" />
          <path d="M6 9v12" />
        </>
      )}
      {kind === 'issue' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="1" />
        </>
      )}
      {kind === 'diff' && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
          <path d="M9 19h6" />
        </>
      )}
      {kind === 'commit' && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h6" />
          <path d="M15 12h6" />
        </>
      )}
    </svg>
  )
}
