function ActivityIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.75 3.75v16.5h16.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
      <path
        d="M7.5 19.5l3.75-4.5 3 3L20.25 9"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

export default function ActivityStats() {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-secondary p-6 dark:border-zinc-700/40">
      <h2 className="mb-6 flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <ActivityIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Activity</span>
      </h2>

      <div className="space-y-4">
        <a
          href="https://www.last.fm/user/growwithlogan"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-teal-400/50 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Music
          </div>
          <div className="mt-1 text-base font-semibold text-zinc-900 transition group-hover:text-teal-500 dark:text-zinc-100">
            Explore my latest plays →
          </div>
        </a>

        <a
          href="https://app.trakt.tv/profile/kzndotsh"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-teal-400/50 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            TV &amp; Movies
          </div>
          <div className="mt-1 text-base font-semibold text-zinc-900 transition group-hover:text-teal-500 dark:text-zinc-100">
            See what I’m watching →
          </div>
        </a>

        <a
          href="https://wakatime.com/@kzndotsh"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-teal-400/50 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Coding
          </div>
          <div className="mt-1 text-base font-semibold text-zinc-900 transition group-hover:text-teal-500 dark:text-zinc-100">
            See my coding activity →
          </div>
        </a>

        <a
          href="https://github.com/kzndotsh"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-teal-400/50 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Code
          </div>
          <div className="mt-1 text-base font-semibold text-zinc-900 transition group-hover:text-teal-500 dark:text-zinc-100">
            Browse my repositories →
          </div>
        </a>
      </div>
    </div>
  )
}
