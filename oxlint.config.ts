import { defineConfig } from 'oxlint'
import core from 'ultracite/oxlint/core'
import next from 'ultracite/oxlint/next'
import react from 'ultracite/oxlint/react'

export default defineConfig({
  extends: [core, react, next],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    '.next/**',
    '.open-next/**',
    '.alchemy/**',
    'src/app/demo/**',
    'next-env.d.ts',
    'wrangler.jsonc',
    '.claude/**',
    '.impeccable/**',
    '.kiro/**',
  ],
  options: { typeAware: true },
  rules: {
    // Style rules that fight how this codebase is written; not bug catchers.
    'eslint/sort-keys': 'off',
    'eslint/func-style': 'off',
    'eslint/curly': 'off',
    'eslint/no-plusplus': 'off',
    'eslint/no-inline-comments': 'off',
    'eslint/no-nested-ternary': 'off',
    'eslint/no-bitwise': 'off',
    'eslint/prefer-destructuring': 'off',
    'eslint/prefer-named-capture-group': 'off',
    'eslint/require-unicode-regexp': 'off',
    'eslint/require-await': 'off',
    'eslint/complexity': 'off',
    'react/function-component-definition': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-sort': 'off',
    // `.at(-1)` returns T | undefined, which tsc then rejects where `a[a.length - 1]` was fine.
    'unicorn/prefer-at': 'off',
    'typescript/consistent-type-definitions': 'off',
    'typescript/strict-boolean-expressions': 'off',
    'typescript/no-confusing-void-expression': 'off',
    'import/consistent-type-specifier-style': 'off',
    'jsx-a11y/prefer-tag-over-role': 'off',
    // Routes like /llms.txt and /resume.md are file routes, not pages; and the shelf's
    // covers are small remote images that next/image would not improve.
    'nextjs/no-html-link-for-pages': 'off',
    'nextjs/no-img-element': 'off',
    // Taste, not bugs.
    'eslint/no-empty-function': 'off',
    'eslint/no-warning-comments': 'off',
    'eslint/default-case': 'off',
    'eslint/no-new': 'off',
    'eslint/no-promise-executor-return': 'off',
    'unicorn/prefer-query-selector': 'off',
    'unicorn/prefer-export-from': 'off',
    'unicorn/prefer-add-event-listener': 'off',
    'unicorn/prefer-number-coercion': 'off',
    'unicorn/prefer-array-find': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/import-style': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-useless-promise-resolve-reject': 'off',
    'typescript/no-unnecessary-type-conversion': 'off',
    'typescript/no-unnecessary-type-parameters': 'off',
    'typescript/no-base-to-string': 'off',
    'typescript/no-deprecated': 'warn',
    'react/capitalized-calls': 'off',
    // Sequential awaits are deliberate (rate limits, one refresh at a time).
    'eslint/no-await-in-loop': 'off',
    // The inline scripts that set sizes before hydration use dangerouslySetInnerHTML.
    'react/no-danger': 'off',
    // Promise constructors wrap CDP sockets in the bake script.
    'promise/avoid-new': 'off',
    'promise/param-names': 'off',
    'promise/always-return': 'off',
    'promise/prefer-await-to-callbacks': 'off',
    // Worth fixing over time, but not at the cost of churn now: shown as warnings.
    'typescript/no-unsafe-type-assertion': 'warn',
    'typescript/return-await': 'warn',
    'typescript/promise-function-async': 'warn',
    'typescript/strict-void-return': 'warn',
    // Off: React effects return a cleanup on some paths and bare `return` on others,
    // and `return undefined` trips unicorn/no-useless-undefined.
    'typescript/consistent-return': 'off',
    // `void promise()` is how a handler starts async work without returning it.
    'eslint/no-void': ['warn', { allowAsStatement: true }],
    'typescript/no-misused-promises': 'warn',
    'typescript/no-non-null-assertion': 'warn',
    'typescript/prefer-nullish-coalescing': 'warn',
    'eslint/no-shadow': 'warn',
    // Hoisted functions and closures that call something declared further down are fine.
    'eslint/no-use-before-define': [
      'warn',
      { functions: false, classes: false, variables: false },
    ],
    'eslint/no-loop-func': 'warn',
    'react/purity': 'warn',
    'react/exhaustive-effect-dependencies': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/interactive-supports-focus': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
    'jsx-a11y/no-noninteractive-tabindex': 'warn',
  },
  overrides: [
    {
      // Plain Node scripts sit outside every tsconfig, so type-aware rules see `any`.
      files: [
        'scripts/**',
        '*.config.ts',
        'next.config.mjs',
        'alchemy.run.ts',
        'src/app/.well-known/**',
      ],
      rules: {
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-return': 'off',
        'typescript/no-unsafe-argument': 'off',
        'typescript/promise-function-async': 'off',
        'typescript/strict-void-return': 'off',
      },
    },
  ],
  jsPlugins: [
    { name: 'react-doctor', specifier: 'oxlint-plugin-react-doctor' },
  ],
})
