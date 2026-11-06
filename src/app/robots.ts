import type { MetadataRoute } from 'next'

import { absolute } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Design explorations, not content.
        disallow: '/demo/',
      },
    ],
    sitemap: absolute('/sitemap.xml'),
  }
}
