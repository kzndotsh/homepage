import { FaGithub, FaReact } from 'react-icons/fa'

import { TbBrandNextjs, TbBrandTailwind, TbMarkdown } from 'react-icons/tb'

import { SiArchlinux, SiMui, SiSupabase, SiVite } from 'react-icons/si'

const projects = [
  {
    name: 'homepage',
    description:
      'Check out the very source code that powers this website - base template by Tailwind UI',
    link: { href: 'https://github.com/kzndotsh/homepage', label: 'github.com' },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Next.js',
        logo: <TbBrandNextjs />,
      },
      {
        name: 'Tailwind CSS',
        logo: <TbBrandTailwind />,
      },
      {
        name: 'MDX',
        logo: <TbMarkdown />,
      },
    ],
  },
  {
    name: 'dotfiles',
    description:
      'My personal dotfiles that I use to make my Arch Linux daily driver feel like home.',
    link: { href: 'https://github.com/kzndotsh/dotfiles', label: 'github.com' },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Arch Linux',
        logo: <SiArchlinux />,
      },
    ],
  },
  {
    name: 'keeptrack',
    description:
      'Simple contact management app built with React, Material UI, Supabase, Vite, and more.',
    link: {
      href: 'https://github.com/kzndotsh/keeptrack',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'React',
        logo: <FaReact />,
      },
      {
        name: 'Material UI',
        logo: <SiMui />,
      },
      {
        name: 'Supabase',
        logo: <SiSupabase />,
      },
      {
        name: 'Vite',
        logo: <SiVite />,
      },
    ],
  },
]

export default projects
