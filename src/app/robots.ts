import type { MetadataRoute } from 'next'

import { absolute } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Design explorations and JSON endpoints, not content.
        disallow: ['/demo/', '/api/'],
      },
    ],
    sitemap: absolute('/sitemap.xml'),
  }
}
