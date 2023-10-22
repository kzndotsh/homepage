import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

import {
  HomeIcon,
  QuestionMarkCircleIcon,
  AtSymbolIcon,
  BookOpenIcon,
  Square3Stack3DIcon,
  BriefcaseIcon,
  CommandLineIcon,
  BookmarkIcon,
  ChartBarIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
  { name: 'Projects', href: '/projects' },
  { name: 'Resume', href: '/resume' },
  { name: 'Uses', href: '/uses' },
  { name: 'Snippets', href: '/snippets' },
  { name: 'Stats', href: '/stats' },
]

const icons = [
  HomeIcon,
  QuestionMarkCircleIcon,
  AtSymbolIcon,
  BookOpenIcon,
  Square3Stack3DIcon,
  BriefcaseIcon,
  CommandLineIcon,
  BookmarkIcon,
  ChartBarIcon,
]

import Link from 'next/link'

export const navList = navigation.map((item, index) => {
  const Icon = icons[index]

  return (
    <Menu.Item key={item.name}>
      {({ active }) => (
        <Link
          href={item.href}
          className={classNames(
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            'group flex items-center px-4 py-2 text-sm',
          )}
        >
          <Icon
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          {item.name}
        </Link>
      )}
    </Menu.Item>
  )
})

export default function DropdownMenu({ href, children }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="bg-secondary ring-border inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset">
          Open
          <ChevronDownIcon className="ml-3 h-auto w-3 stroke-white group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-secondary ring-border absolute right-1 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none">
          <div className="py-1">{navList}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
