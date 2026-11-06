import { Geist_Mono, Inter, Manrope } from 'next/font/google'

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

// Waybar in the dotfiles uses Inter Nerd Font.
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/** Class names that expose every font as a CSS variable. */
export const fontVariables = [
  manrope.variable,
  geistMono.variable,
  inter.variable,
].join(' ')
