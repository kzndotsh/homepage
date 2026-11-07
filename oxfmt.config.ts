import { defineConfig } from 'oxfmt'
import ultracite from 'ultracite/oxfmt'

export default defineConfig({
  ...ultracite,
  // Keep the house style the site was written in (Prettier's old settings).
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    '.next/**',
    '.open-next/**',
    '.alchemy/**',
    'src/app/demo/**',
    'public/**',
    'scripts/source/**',
    'wrangler.jsonc',
    'package-lock.json',
    '.claude/**',
    '.impeccable/**',
    '.kiro/**',
  ],
  sortImports: {
    ...(typeof ultracite.sortImports === 'object' ? ultracite.sortImports : {}),
    ignoreCase: true,
    internalPattern: ['@/'],
    newlinesBetween: true,
    order: 'asc',
  },
  sortTailwindcss: {
    ...(typeof ultracite.sortTailwindcss === 'object'
      ? ultracite.sortTailwindcss
      : {}),
    stylesheet: './src/styles/tailwind.css',
  },
})
