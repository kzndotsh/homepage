import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
// import logoAnimaginary from '@/images/logos/animaginary.svg'
// import logoCosmos from '@/images/logos/cosmos.svg'
// import logoHelioStream from '@/images/logos/helio-stream.svg'
// import logoOpenShuttle from '@/images/logos/open-shuttle.svg'
// import logoPlanetaria from '@/images/logos/planetaria.svg'

import projects from '@/data/projects-data'

function LinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

// function Tooltip({ name }) {
//   return (
//   )
// }

export const metadata = {
  title: 'Projects',
  description: 'Things I’ve made trying to put my dent in the universe.',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="Things I’ve made trying to put my dent in the universe."
      intro="I’ve worked on tons of little projects over the years but these are the ones that I’m most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas for how it can be improved."
    >
      <ul className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 ">
        {projects.map((project) => (
          <div key={project} className="h-full">
            <Card
              className="flex h-full min-h-[200px] flex-col justify-between rounded-2xl border-2 border-transparent bg-secondary px-4 py-4 hover:border-teal-400/50"
              as="li"
              key={project.name}
            >
              <div>
                <h2 className="text-base font-semibold">
                  <Card.Link href={project.link.href}>{project.name}</Card.Link>
                </h2>
                <Card.Description>{project.description}</Card.Description>
                <div className="relative z-10 mt-2 flex gap-2 py-3">
                  {project.stack?.map((item) => (
                    <div
                      key={item.name}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-accent dark:ring-0"
                    >
                      {item.logo}
                    </div>
                  ))}
                </div>
              </div>
              <p className="relative z-10 mt-4 flex text-sm font-medium transition group-hover:text-teal-500 ">
                <LinkIcon className="h-6 w-6 flex-none" />
                <span className="ml-2">{project.link.label}</span>
              </p>
            </Card>
          </div>
        ))}
      </ul>
    </SimpleLayout>
  )
}
