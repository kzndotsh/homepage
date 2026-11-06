// Mirrors kzndotsh/dotfiles (README, modules/desktop/sway/), not a live probe.

export const DOTFILES_URL = 'https://github.com/kzndotsh/dotfiles'

export const FETCH_INFO: [label: string, value: string][] = [
  ['OS', 'NixOS unstable x86_64'],
  ['Kernel', 'Linux Zen'],
  ['WM', 'Sway'],
  ['Terminal', 'Ghostty'],
  ['Shell', 'zsh + starship'],
  ['Theme', 'Tokyo Night (Night)'],
  ['CPU', 'AMD Ryzen 7 5800X (16) @ 4.85 GHz'],
  ['GPU', 'AMD Radeon RX 6700 XT, 12 GB'],
  ['Memory', '128 GB'],
  ['Display', 'MSI MAG 275UD E14, 4K @ 144 Hz'],
]

/** Tokyo Night colours as site tokens: two even rows of seven. */
export const SWATCHES: [name: string, color: string][] = [
  ['red', 'var(--color-tn-red)'],
  ['orange', 'var(--color-tn-orange)'],
  ['yellow', 'var(--color-tn-yellow)'],
  ['green', 'var(--color-tn-green)'],
  ['teal', 'var(--color-tn-teal)'],
  ['cyan', 'var(--color-tn-cyan)'],
  ['blue', 'var(--color-tn-blue)'],
  ['magenta', 'var(--color-tn-magenta)'],
  ['purple', 'var(--color-tn-purple)'],
  ['foreground', 'var(--color-tn-fg)'],
  ['foreground dim', 'var(--color-tn-fg-dark)'],
  ['comment', 'var(--color-tn-comment)'],
  ['gutter', 'var(--color-tn-gutter)'],
  ['black', 'var(--color-tn-black)'],
]
