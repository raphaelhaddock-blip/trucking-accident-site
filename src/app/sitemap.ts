import { MetadataRoute } from 'next';
import { ACCIDENT_SLUGS } from '@/lib/accidents-content';
import { getAvailableStateSlugs } from '@/lib/states-content';
import { BLOG_SLUGS } from '@/lib/blog-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trucking-accident-site.vercel.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/accidents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/states`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fmcsa-regulations`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Accident type pages (20 pages)
  const accidentPages: MetadataRoute.Sitemap = ACCIDENT_SLUGS.map((slug) => ({
    url: `${baseUrl}/accidents/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // State pages (10 pages currently)
  const statePages: MetadataRoute.Sitemap = getAvailableStateSlugs().map((slug) => ({
    url: `${baseUrl}/states/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...accidentPages, ...statePages, ...blogPages];
}
