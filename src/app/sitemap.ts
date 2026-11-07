import type { MetadataRoute } from 'next'

import { absolute } from '@/config/site'

/** Evaluated at build time, so it moves with each deploy. */
const BUILT = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absolute('/'),
      lastModified: BUILT,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absolute('/resume'),
      lastModified: BUILT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
