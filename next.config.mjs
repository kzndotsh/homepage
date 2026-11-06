import { execSync } from 'node:child_process'

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const MARKDOWN = {
  type: 'header',
  key: 'accept',
  value: '(.*)text/markdown(.*)',
}

/** Point agents at the Markdown twin of a page and at llms.txt. */
const discovery = (md) => [
  {
    key: 'Link',
    value: `<${md}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`,
  },
  { key: 'Vary', value: 'Accept' },
]

/** The commit this build is made from, shown in the footer. Empty outside a git checkout. */
const commit = (() => {
  try {
    return execSync('git rev-parse --short=7 HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
  } catch {
    return ''
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { NEXT_PUBLIC_GIT_SHA: commit },
  async rewrites() {
    return {
      // A request that asks for Markdown gets the Markdown version of the same URL.
      beforeFiles: [
        { source: '/', has: [MARKDOWN], destination: '/index.md' },
        { source: '/resume', has: [MARKDOWN], destination: '/resume.md' },
      ],
    }
  },
  async redirects() {
    // The resume used to live at a fixed name; keep old links working.
    return [
      {
        source: '/files/resume.pdf',
        destination: '/files/LoganHoneycutt_Resume_2026-07-13.pdf',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      { source: '/', headers: discovery('/index.md') },
      { source: '/resume', headers: discovery('/resume.md') },
    ]
  },
}

initOpenNextCloudflareForDev()

export default nextConfig
