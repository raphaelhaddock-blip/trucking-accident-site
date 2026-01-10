import { BlogPost } from './types';
import { whatToDoAfterAccident } from './what-to-do-after-truck-accident';
import { underrideDeaths } from './underride-deaths';
import { settlementAmounts } from './settlement-amounts';
import { fmcsaViolations } from './fmcsa-violations';
import { specializedAttorneys } from './specialized-attorneys';
import { fmcsaViolationsTruckAccidents } from './fmcsa-violations-truck-accidents';
import { whenToHireTruckAccidentLawyer } from './when-to-hire-truck-accident-lawyer';

export const BLOG_POSTS: BlogPost[] = [
  whatToDoAfterAccident,
  underrideDeaths,
  settlementAmounts,
  fmcsaViolations,
  specializedAttorneys,
  fmcsaViolationsTruckAccidents,
  whenToHireTruckAccidentLawyer,
];

export const BLOG_SLUGS = BLOG_POSTS.map((post) => post.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.category === category);
}

export function getBlogPostsByFunnelStage(stage: BlogPost['funnelStage']): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.funnelStage === stage);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.featured);
}

export function getRecentPosts(limit: number = 5): BlogPost[] {
  return [...BLOG_POSTS]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export * from './types';
