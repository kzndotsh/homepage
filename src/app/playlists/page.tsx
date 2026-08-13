import { type Metadata } from 'next'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import playlists from '@/data/playlists-data'

function SpotifyIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5 22.5 17.799 22.5 12 17.799 1.5 12 1.5Zm4.837 15.162a.656.656 0 0 1-.903.218c-2.473-1.512-5.59-1.854-9.26-1.016a.657.657 0 1 1-.293-1.28c4.026-.921 7.47-.525 10.238 1.175a.656.656 0 0 1 .218.903Zm1.29-2.87a.82.82 0 0 1-1.128.27c-2.83-1.74-7.145-2.244-10.493-1.227a.822.822 0 0 1-.477-1.573c3.824-1.16 8.586-.598 11.828 1.395a.82.82 0 0 1 .27 1.135Zm.111-2.99C14.86 8.79 9.2 8.6 5.847 9.617a.984.984 0 1 1-.572-1.882c3.853-1.17 10.16-.944 14.166 1.441a.984.984 0 0 1-1.203 1.557Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Playlists',
  description:
    "Whether it's techno, jazz, classical or rap – here's your source for a dose of Sound Therapy.",
}

export default function Playlists() {
  return (
    <SimpleLayout
      title="Sound Therapy."
      intro="I’m obsessed with music and curating playlists — discographies, subgenres, sorting everything into piles. These are the outcome. I add tracks in batches, so always shuffle these for the best experience."
    >
      <ul className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2">
        {playlists.map((playlist) => (
          <Card
            key={playlist.name}
            as="li"
            className="flex h-full min-h-[200px] flex-col justify-between rounded-2xl border-2 border-transparent bg-secondary px-4 py-4 hover:border-teal-400/50"
          >
            <div className="flex w-full gap-4">
              <Image
                src={playlist.cover}
                alt=""
                className="relative z-10 h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-zinc-900/5"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold">
                  <Card.Link
                    href={playlist.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {playlist.name}
                  </Card.Link>
                </h2>
                <ul className="relative z-10 mt-2 flex flex-wrap gap-1.5">
                  {playlist.genres.map((genre) => (
                    <li
                      key={genre}
                      className="rounded-full bg-accent px-2 py-0.5 text-xs text-zinc-400"
                    >
                      {genre}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="relative z-10 mt-4 flex text-sm font-medium transition group-hover:text-teal-500">
              <SpotifyIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">open.spotify.com</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
