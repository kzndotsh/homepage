import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata = {
  title: 'About',
  // description:
  //   'I’m Spencer Sharp. I live in New York City, where I design the future.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Hello 👋
            <br />
            my name is Logan.
          </h1>

          <div className="mt-6 space-y-7 text-base">
            <span className="bg-accent inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
              Web Developer
            </span>
            <p>
              I am a full stack developer with a passion for building things and
              solving problems through code. My current tech stack includes
              React, Next.js, Tailwind CSS, Express, Node, Supabase, and other
              great tools.
            </p>

            <span className="bg-accent inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
              Digital Marketer
            </span>
            <p>
              Growth is the mission for whatever project is at hand but at the
              end of the day I genuinely enjoy all things marketing like data
              analytics, content creation, and SaaS. I previously worked as an
              event marketer producing events for thousands of attendees.
            </p>

            <span className="bg-accent inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
              Systems Engineer
            </span>
            <p>
              I love to dive deep into systems and operations. I am a creative
              at heart with the mind of an engineer. When working with clients,
              I dissect complex problems and design innovative solutions through
              creative outlook and systematic thinking.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://twitter.com/kzndotsh" icon={TwitterIcon}>
              Follow on Twitter
            </SocialLink>
            <SocialLink
              href="https://instagram.com/growwithlogan"
              icon={InstagramIcon}
              className="mt-4"
            >
              Follow on Instagram
            </SocialLink>
            <SocialLink
              href="https://github.com/kzndotsh"
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://linkedin.com/in/growwithlogan"
              icon={LinkedInIcon}
              className="mt-4"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:me@kzn.sh"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              me@kzn.sh
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
