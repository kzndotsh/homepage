import { GitHubIcon } from 'src/components/SocialIcons'

const projects = [
  {
    name: 'homepage',
    description: 'Check out the very source code that powers this website.',
    link: { href: 'https://github.com/kaizensh/homepage', label: 'github.com' },
    logo: <GitHubIcon />,
  },
  {
    name: 'dotfiles', 
    description:
      'My personal dotfiles that I use to make my Arch Linux daily driver feel like home.',
    link: { href: 'https://github.com/kaizensh/dotfiles', label: 'github.com' },
    logo: <GitHubIcon />,
  },
  {
    name: 'HelioStream',
    description:
      'Real-time video streaming library, optimized for interstellar transmission.',
    link: { href: '#', label: 'github.com' },
    logo: <GitHubIcon />,
  },
  {
    name: 'cosmOS',
    description:
      'The operating system that powers our Planetaria space shuttles.',
    link: { href: '#', label: 'github.com' },
    logo: <GitHubIcon />,
  },
  {
    name: 'OpenShuttle',
    description:
      'The schematics for the first rocket I designed that successfully made it to orbit.',
    link: { href: '#', label: 'github.com' },
    logo: <GitHubIcon />,
  },
]

export default projects
