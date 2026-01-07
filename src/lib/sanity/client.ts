import { createClient } from '@sanity/client';

// Sanity client for server-side operations (mutations)
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '54bwni5t',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Don't use CDN for mutations
  token: process.env.SANITY_API_TOKEN, // Required for creating documents
});

// Read-only client for fetching data (can use CDN)
export const sanityReadClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '54bwni5t',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
