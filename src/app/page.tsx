import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import ActivityStats from '@/components/ActivityStats'

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'

import hire from '@/images/logos/hire.svg'
import smile from '@/images/logos/smile.svg'
import tv from '@/images/logos/tv.svg'
import arch from '@/images/logos/arch.svg'
import f4milymatters from '@/images/logos/f4milymatters.svg'
import web3 from '@/images/logos/web3.svg'

import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'

function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
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
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ArrowDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

interface Role {
  company: string
  title: string
  logo: ImageProps['src']
  start: string | { label: string; dateTime: string }
  end: string | { label: string; dateTime: string }
}

function Role({ role }: { role: Role }) {
  const [startLabel, startDate] =
    typeof role.start === 'string'
      ? [role.start, role.start]
      : [role.start.label, role.start.dateTime]
  const [endLabel, endDate] =
    typeof role.end === 'string'
      ? [role.end, role.end]
      : [role.end.label, role.end.dateTime]

  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border-teal-400/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={role.logo} alt="" className="h-6 w-6 brightness-0 invert" unoptimized />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-zinc-500 dark:text-zinc-400">
          {role.title}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
      </dl>
    </li>
  )
}

function Resume() {
  const resume: Role[] = [
    {
      company: 'Doji',
      title: 'Co-Founder & Full-Stack Engineer',
      logo: hire,
      start: 'Feb 2026',
      end: 'Present',
    },
    {
      company: 'All Things Linux',
      title: 'Founder & Full-Stack Engineer',
      logo: arch,
      start: 'Nov 2023',
      end: 'May 2026',
    },
    {
      company: 'BloxMania',
      title: 'Shopify Developer (contract)',
      logo: smile,
      start: 'Jul 2025',
      end: 'Aug 2025',
    },
    {
      company: 'PrintBliss',
      title: 'Solutions Engineer (contract)',
      logo: f4milymatters,
      start: 'Dec 2023',
      end: 'Aug 2024',
    },
    {
      company: 'Blackbeard Media Group',
      title: 'System Administrator',
      logo: tv,
      start: 'Jan 2022',
      end: 'Nov 2023',
    },
  {
    company: 'Independent',
    title: 'Web Developer & Technical Consultant',
    logo: web3,
    start: 'Aug 2021',
    end: 'May 2023',
  },
  ]

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-100 bg-secondary p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work</span>
      </h2>
      <ol className="mt-6 flex-1 space-y-4">
        {resume.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
      <Button
        href="/files/resume.pdf"
        variant="secondary"
        className="group mt-6 w-full"
        download="resume.pdf"
      >
        Download CV
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </Button>
    </div>
  )
}

function Photos() {
  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-3']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex flex-wrap justify-center gap-6 py-4 sm:gap-8">
        {[image1, image2, image4, image3].map((image, index) => (
          <div
            key={index}
            className={clsx(
              'group relative flex flex-col bg-white p-3 shadow-xl shadow-black/20 transition-transform hover:-translate-y-1 dark:bg-zinc-100',
              rotations[index % rotations.length],
            )}
          >
            {/* Polaroid frame */}
            <div className="relative overflow-hidden border border-zinc-200">
              <Image
                src={image}
                alt=""
                className="h-[260px] w-[240px] object-cover sm:h-[320px] sm:w-[280px]"
                sizes="(min-width: 640px) 280px, 240px"
              />
            </div>

            {/* Caption strip */}
            <div className="mt-3 h-5 w-full bg-white" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  // let articles = (await getAllArticles()).slice(0, 4)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Software developer, entrepreneur, and creator.
          </h1>
          <p className="mt-6 text-base">
            I’m Logan, a software developer and entrepreneur based in Charlotte,
            NC. I have a strong passion for building things and solving
            problems. I love to learn and am always looking to grow. In my free
            time, I enjoy working with all things linux, self hosting and media.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://twitter.com/kzndotsh"
              aria-label="Follow on Twitter"
              icon={TwitterIcon}
            />
            <SocialLink
              href="https://instagram.com/kzndotsh"
              aria-label="Follow on Instagram"
              icon={InstagramIcon}
            />
            <SocialLink
              href="https://github.com/kzndotsh"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://linkedin.com/in/kzndotsh"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2 lg:items-stretch">
          <div className="flex h-full flex-col">
            <ActivityStats />
          </div>
          <div className="flex h-full flex-col lg:pl-16 xl:pl-24">
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
