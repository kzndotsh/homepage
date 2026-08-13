import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'tmp/**',
    '.alchemy/**',
    'wrangler.jsonc',
  ]),
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['typography.ts'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
])

export default eslintConfig
