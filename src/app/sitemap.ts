import type { MetadataRoute } from 'next'

import { absolute } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absolute('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absolute('/resume'), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
