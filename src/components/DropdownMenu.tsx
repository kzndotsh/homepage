import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link'
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

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'About', href: '/about', icon: QuestionMarkCircleIcon },
  { name: 'Contact', href: '/contact', icon: AtSymbolIcon },
  { name: 'Blog', href: '/blog', icon: BookOpenIcon },
  { name: 'Projects', href: '/projects', icon: Square3Stack3DIcon },
  { name: 'Resume', href: '/resume', icon: BriefcaseIcon },
  { name: 'Uses', href: '/uses', icon: CommandLineIcon },
  { name: 'Snippets', href: '/snippets', icon: BookmarkIcon },
  { name: 'Stats', href: '/stats', icon: ChartBarIcon },
]

export default function DropdownMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-zinc-900/5">
        Open
        <ChevronDownIcon className="ml-3 h-auto w-3 stroke-white group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-1 z-10 mt-2 w-56 origin-top-right rounded-md bg-secondary shadow-lg ring-1 ring-zinc-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
      >
        <div className="py-1">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <MenuItem key={item.name}>
                <Link
                  href={item.href}
                  className={classNames(
                    'group flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900',
                  )}
                >
                  <Icon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </MenuItem>
            )
          })}
        </div>
      </MenuItems>
    </Menu>
  )
}
