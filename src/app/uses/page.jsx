import React from 'react'

import {
  TbBrandVscode,
  TbBrandFigma,
  TbBrandDiscordFilled,
} from 'react-icons/tb'

import { AiOutlineGithub } from 'react-icons/ai'

const tools = [
  {
    title: 'Figma',
    desc: 'Ut enim ad minim veniam',
    icon: <TbBrandFigma className="h-10 w-10" />,
  },
  {
    title: 'Github',
    desc: 'Ut enim ad minim veniam',
    icon: <AiOutlineGithub className="h-10 w-10" />,
  },
  {
    title: 'Discord',
    desc: 'Ut enim ad minim veniam',
    icon: <TbBrandDiscordFilled className="h-10 w-10" />,
  },
  {
    title: 'Visual Studio Code',
    desc: 'My favorite code editor',
    icon: <TbBrandVscode className="h-10 w-10" />,
  },
  {
    title: 'Visual Studio Code',
    desc: 'My favorite code editor',
    icon: <TbBrandVscode className="h-10 w-10" />,
  },
  {
    title: 'Visual Studio Code',
    desc: 'My favorite code editor',
    icon: <TbBrandVscode className="h-10 w-10" />,
  },
]

export default function Uses() {
  return (
    <section className="py-16">
      <div className="px-4 md:px-8">
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-gray-800 sm:text-2xl">
            Tools I use to get things done
          </h1>
          <p className="mt-2 text-gray-600">
            I use a variety of tools to get things done. Here are some of my
            favorites.
          </p>
        </div>
        <ul className="mt-16 grid gap-8 p-10 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((item, idx) => (
            <li className="rounded-lg border" key={item.title}>
              <div className="border-b px-4 py-3 text-left">
                <span className="bg-tertiary mr-2 rounded px-4 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Default
                </span>
              </div>
              <div className="flex items-start justify-between p-4">
                <div className="space-y-2">
                  {item.icon}
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <button className="rounded-lg border px-3 py-2 text-sm text-gray-700 duration-150 hover:bg-gray-100">
                  Explore
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
