import { MetadataRoute } from 'next'
import portfolioData from './data/portfolio.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.artemdyachuk.com'
  
  // Static pages - realistic change frequencies for portfolio site
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // Portfolio home pages update monthly at most
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // About pages rarely change
      priority: 0.8,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // Skills update occasionally
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // Experience updates when job changes
      priority: 0.8,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // Achievements added occasionally
      priority: 0.8,
    },
    {
      url: `${baseUrl}/my-work`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // Portfolio updates when projects added
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const, // Contact info rarely changes
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sitemap-page`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    },
  ]
  
  // Dynamic project pages - project case studies rarely change once published
  const projectPages = portfolioData.map((project) => ({
    url: `${baseUrl}/my-work/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const, // Case studies are static once published
    priority: 0.7,
  }))
  
  return [...staticPages, ...projectPages]
} 