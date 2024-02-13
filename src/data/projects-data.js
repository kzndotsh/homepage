import { FaGithub, FaReact } from 'react-icons/fa'

import { TbBrandNextjs, TbBrandTailwind, TbMarkdown } from 'react-icons/tb'

import {
  SiArchlinux,
  SiMui,
  SiSupabase,
  SiVite,
  SiReactrouter,
  SiRedux,
  SiExpress,
  SiChakraui,
  SiAxios,
  SiPython,
  SiGrafana,
  SiMariadb,
  SiDiscord,
  SiPostgresql,
  SiDocker,
  SiGithubactions,
} from 'react-icons/si'

const projects = [
  // homepage
  {
    name: 'homepage',
    description:
      'Browse the source code that powers this website - base template by TailwindUI',
    link: {
      href: 'https://gtithub.com/kzndotsh/homepage',
      label: 'github.com',
    },
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
  // dotfiles
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
  // tux
  {
    name: 'tux',
    description:
      'Work in progress: A Discord.py AIO bot to help manage the .gg/linux Discord server.',
    link: {
      href: 'https://github.com/allthingslinux/tux',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Python',
        logo: <SiPython />,
      },
      {
        name: 'Discord.py',
        logo: <SiDiscord />,
      },
      {
        name: 'PostgreSQL',
        logo: <SiPostgresql />,
      },
      {
        name: 'Github Actions',
        logo: <SiGithubactions />,
      },
    ],
  },
  // keeptrack
  {
    name: 'keeptrack',
    description:
      'Simple contact manager built with React, Material UI, Supabase, Vite, and more.',
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
  // state
  {
    name: 'state',
    description:
      'State management demo app using React, React Router, Redux, Yup, Axios, and Express.',
    link: {
      href: 'https://github.com/kzndotsh/state',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'React',
        logo: <FaReact />,
      },
      {
        name: 'React Router',
        logo: <SiReactrouter />,
      },
      {
        name: 'Redux',
        logo: <SiRedux />,
      },
      {
        name: 'Express.js',
        logo: <SiExpress />,
      },
      {
        name: 'Axios',
        logo: <SiAxios />,
      },
    ],
  },
  // todo
  {
    name: 'todo',
    description:
      'Simple todo app implementing CRUD operations using React, Chakra UI, and Vite.',
    link: {
      href: 'https://github.com/kzndotsh/todo',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'React',
        logo: <FaReact />,
      },
      {
        name: 'Chakra UI',
        logo: <SiChakraui />,
      },
      {
        name: 'Vite',
        logo: <SiVite />,
      },
    ],
  },
  // qbit-peers
  {
    name: 'qBit Peers',
    description:
      'Geographic visualization data source for qBittorrent and Grafana using Python, MariaDB, Docker, and more.',
    link: {
      href: 'https://github.com/kzndotsh/qbit-peers',
      label: 'github.com',
    },
    logo: <FaGithub />,
    stack: [
      {
        name: 'Python',
        logo: <SiPython />,
      },
      {
        name: 'Grafana',
        logo: <SiGrafana />,
      },
      {
        name: 'MariaDB',
        logo: <SiMariadb />,
      },
      {
        name: 'Docker',
        logo: <SiDocker />,
      },
    ],
  },
]

export default projects
