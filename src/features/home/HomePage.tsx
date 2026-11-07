import { fontVariables } from '@/config/fonts'
import { BookingSection } from '@/features/booking/sections/BookingSection'
import { CodingSection } from '@/features/coding/sections/CodingSection'
import { BooksSection } from '@/features/library/sections/BooksSection'
import { WatchingSection } from '@/features/library/sections/WatchingSection'
import { ListeningSection } from '@/features/music/sections/ListeningSection'
import { PlaylistsSection } from '@/features/music/sections/PlaylistsSection'
import { SetupSection } from '@/features/setup/sections/SetupSection'
import { ExperienceSection } from '@/features/work/sections/ExperienceSection'
import { ProjectsSection } from '@/features/work/sections/ProjectsSection'
import { cx } from '@/lib/cx'
import { snapshot } from '@/lib/snapshots'

import { CommandPalette } from './components/CommandPalette'
import { SiteFooter } from './components/SiteFooter'
import { SiteNav } from './components/SiteNav'
import { ApiSection } from './sections/ApiSection'
import { ContactSection } from './sections/ContactSection'
import { Hero } from './sections/Hero'

import s from './home.module.css'

/**
 * The homepage. Each integration's data comes from a stored snapshot (see
 * lib/snapshots) and is null when it is missing, so each section decides what
 * to show without it.
 */
export async function HomePage() {
  const [
    github,
    spotify,
    favorites,
    charts,
    lastfmStats,
    nowPlaying,
    genres,
    library,
    trakt,
    availability,
  ] = await Promise.all([
    snapshot('github'),
    snapshot('spotify'),
    snapshot('lastfm-favorites'),
    snapshot('lastfm-charts'),
    snapshot('lastfm-stats'),
    snapshot('lastfm-now'),
    snapshot('lastfm-genres'),
    snapshot('hardcover'),
    snapshot('trakt'),
    snapshot('cal'),
  ])

  return (
    <div className={cx(s.root, fontVariables)}>
      <SiteNav />
      <CommandPalette />
      <div className={s.wrap}>
        <main className={s.grid}>
          <Hero />
          <ProjectsSection />
          <CodingSection github={github} />
          <SetupSection nowPlaying={nowPlaying} />
          <PlaylistsSection spotify={spotify} />
          <ListeningSection
            favorites={favorites}
            charts={charts}
            stats={lastfmStats}
            nowPlaying={nowPlaying}
            genres={genres}
          />
          {library && <BooksSection library={library} />}
          {trakt && <WatchingSection trakt={trakt} />}
          <ExperienceSection />
          <BookingSection availability={availability} />
          <ContactSection />
          <ApiSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
