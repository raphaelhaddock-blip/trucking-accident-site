import { createClient } from '@sanity/client';

// Sanity project configuration - Trucking Accident Editorial
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tspm77c6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
};

// Public client for frontend queries (read-only)
export const sanityClient = createClient({
  ...sanityConfig,
  useCdn: true,
});

// Alias for backwards compatibility
export const sanityReadClient = sanityClient;

// Server-side client with write access (for API routes only)
export const sanityWriteClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// GROQ query helper with typing
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}

// Types for Sanity documents
export interface SanityAuthor {
  _id: string;
  _type: 'author';
  name: string;
  slug: { current: string };
  role: 'attorney' | 'editor' | 'medical' | 'editorial';
  credentials?: string;
  bio?: string;
  image?: {
    asset: { _ref: string };
  };
  avvoUrl?: string;
  linkedinUrl?: string;
  barNumber?: string;
  barState?: string;
}

export interface SanityNewsArticle {
  _id: string;
  _type: 'newsArticle';
  headline: string;
  slug: { current: string };
  eventDate: string;
  publishedAt?: string;
  location: {
    city?: string;
    state: string;
    highway?: string;
  };
  accidentType?: string;
  casualties?: {
    fatalities?: number;
    injuries?: number;
  };
  summary: unknown[]; // Portable Text blocks
  legalImplications?: unknown[];
  sources: Array<{
    title: string;
    url: string;
  }>;
  status: 'draft' | 'needs-review' | 'approved' | 'published' | 'rejected';
  author?: SanityAuthor;
  reviewedBy?: SanityAuthor;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface SanityCitationDraft {
  _id: string;
  _type: 'citationDraft';
  targetPage: string;
  pageType?: 'state' | 'accident' | 'blog' | 'other';
  originalClaim: string;
  proposedCitation: {
    sourceName: string;
    sourceUrl: string;
    dataYear?: string;
    verifiedValue?: string;
  };
  proposedText?: string;
  status: 'pending' | 'approved' | 'applied' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  createdAt?: string;
}

export interface SanityEditorialTask {
  _id: string;
  _type: 'editorialTask';
  title: string;
  taskType: 'citation' | 'news-review' | 'stats-update' | 'refresh' | 'attribution' | 'other';
  targetPage?: string;
  description?: string;
  status: 'open' | 'in-progress' | 'awaiting-review' | 'completed' | 'cancelled';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignedTo?: SanityAuthor;
  dueDate?: string;
  completedAt?: string;
}

export interface SanitySiteSettings {
  _id: string;
  _type: 'siteSettings';
  siteName: string;
  siteTagline?: string;
  defaultAuthor?: SanityAuthor;
  defaultReviewer?: SanityAuthor;
  organizationSchema?: {
    legalName?: string;
    description?: string;
    telephone?: string;
    email?: string;
    address?: {
      streetAddress?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
  socialProfiles?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  dataSourcesDisclaimer?: string;
  lastGlobalUpdate?: string;
}

// Common GROQ queries
export const queries = {
  // Get all published news articles
  newsArticles: `*[_type == "newsArticle" && status == "published"] | order(eventDate desc) {
    _id,
    headline,
    slug,
    eventDate,
    publishedAt,
    location,
    accidentType,
    casualties,
    "author": author->{name, slug, credentials},
    seo
  }`,

  // Get single news article by slug
  newsArticleBySlug: `*[_type == "newsArticle" && slug.current == $slug][0] {
    _id,
    headline,
    slug,
    eventDate,
    publishedAt,
    location,
    accidentType,
    casualties,
    summary,
    legalImplications,
    sources,
    "author": author->{name, slug, credentials, bio, image},
    "reviewedBy": reviewedBy->{name, slug, credentials},
    seo
  }`,

  // Get all authors
  authors: `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    role,
    credentials,
    bio,
    image
  }`,

  // Get author by slug
  authorBySlug: `*[_type == "author" && slug.current == $slug][0]`,

  // Get site settings
  siteSettings: `*[_type == "siteSettings"][0] {
    siteName,
    siteTagline,
    "defaultAuthor": defaultAuthor->{name, slug, credentials},
    "defaultReviewer": defaultReviewer->{name, slug, credentials},
    organizationSchema,
    socialProfiles,
    dataSourcesDisclaimer
  }`,

  // Get pending citation drafts (for editorial workflow)
  pendingCitations: `*[_type == "citationDraft" && status == "pending"] | order(priority asc, createdAt desc) {
    _id,
    targetPage,
    pageType,
    originalClaim,
    proposedCitation,
    priority,
    createdAt
  }`,

  // Get open editorial tasks
  openTasks: `*[_type == "editorialTask" && status in ["open", "in-progress", "awaiting-review"]] | order(priority asc, dueDate asc) {
    _id,
    title,
    taskType,
    targetPage,
    description,
    status,
    priority,
    dueDate,
    "assignedTo": assignedTo->{name, slug}
  }`,
};
