import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://usecircuitos.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: new Date('2026-03-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-02-15'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-02-15'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
