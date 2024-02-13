import LastfmCard from '@/components/Stats/Lastfm'

import {
  GithubStatsCard,
  GithubLangStatsCard,
} from '@/components/Stats/GithubStatsCard'

import { WakatimeStatsCard } from '@/components/Stats/WakatimeStatsCard'

import { LeetCodeStatsCard } from '@/components/Stats/LeetCodeStatsCard'

export default function Stats() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5 ">
        <h1 className="md:leading-14 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl">
          Stats
        </h1>

        <p className="text-md leading-7 text-gray-500 dark:text-gray-400">
          I use this dashboard to track various metrics across platforms like
          Spotify, Twitter, GitHub, and more.
        </p>
      </div>

      <div className="pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 row-span-2">
            <LeetCodeStatsCard />
            <GithubStatsCard />
            <WakatimeStatsCard />
          </div>
          <div className="col-span-1 row-span-1"></div>
          <div className="col-span-1 row-span-1">
            <GithubLangStatsCard />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <LastfmCard />
        </div>
      </div>
    </div>
  )
}
