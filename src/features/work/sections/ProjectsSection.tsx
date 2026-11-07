import { Panel } from '@/components/ui/Panel'
import { PanelHeader } from '@/components/ui/PanelHeader'
import { featuredProjects, workEntries } from '@/content'

import { FeaturedProjects } from '../components/FeaturedProjects'
import { ProjectMarquee } from '../components/ProjectMarquee'

import s from '../work.module.css'

/** The stand-out projects shown large above the strip, in this order. */
const FEATURED = ['Watchdog', 'gang.guide', 'fish-audio-suite']

// The strip below holds the rest, so no project shows twice.
const projects = workEntries.filter(
  (e) => e.kind === 'project' && !FEATURED.includes(e.name),
)

const featured = FEATURED.flatMap((name) => {
  const entry = workEntries.find((e) => e.name === name)
  const blurb = featuredProjects.find((p) => p.name === name)?.blurb
  return entry && blurb ? [{ entry, blurb }] : []
})

export function ProjectsSection() {
  return (
    <Panel id="projects" labelledBy="proj">
      <PanelHeader id="proj" title="What I've been working on" />
      <p className={s.pmLabel}>Featured</p>
      <FeaturedProjects items={featured} />
      <p className={s.pmLabel}>Other projects</p>
      <ProjectMarquee entries={projects} />
    </Panel>
  )
}
