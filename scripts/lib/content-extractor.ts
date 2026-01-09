/**
 * Content Extractor - Extracts text, metadata, and structural info from HTML
 */

import * as cheerio from 'cheerio';

export interface ExtractedContent {
  url: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  h1: string;
  headings: { level: number; text: string }[];
  bodyText: string;
  wordCount: number;
  links: { href: string; text: string; isInternal: boolean }[];
  images: { src: string; alt: string }[];
  schema: SchemaData[];
  faqs: { question: string; answer: string }[];
  robots: string;
}

export interface SchemaData {
  type: string;
  data: Record<string, unknown>;
}

const BASE_DOMAIN = 'trucking-accident-site.vercel.app';

/**
 * Extract content from HTML string
 */
export function extractContent(html: string, url: string): ExtractedContent {
  const $ = cheerio.load(html);

  // Remove script, style, and nav elements for text extraction
  const $content = cheerio.load(html);
  $content('script, style, nav, header, footer, noscript').remove();

  // Extract metadata
  const title = $('title').text().trim();
  const metaTitle = $('meta[property="og:title"]').attr('content') ||
                    $('meta[name="title"]').attr('content') || title;
  const metaDescription = $('meta[name="description"]').attr('content') ||
                          $('meta[property="og:description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const robots = $('meta[name="robots"]').attr('content') || '';

  // Extract H1
  const h1 = $('h1').first().text().trim();

  // Extract all headings
  const headings: { level: number; text: string }[] = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const $el = $(el);
    const level = parseInt(el.tagName.charAt(1));
    headings.push({ level, text: $el.text().trim() });
  });

  // Extract body text (cleaned)
  const bodyText = $content('body').text()
    .replace(/\s+/g, ' ')
    .trim();

  // Word count
  const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

  // Extract links
  const links: { href: string; text: string; isInternal: boolean }[] = [];
  $('a[href]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';
    const text = $el.text().trim();
    const isInternal = href.startsWith('/') ||
                       href.includes(BASE_DOMAIN) ||
                       !href.startsWith('http');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push({ href, text, isInternal });
    }
  });

  // Extract images
  const images: { src: string; alt: string }[] = [];
  $('img').each((_, el) => {
    const $el = $(el);
    images.push({
      src: $el.attr('src') || '',
      alt: $el.attr('alt') || '',
    });
  });

  // Extract JSON-LD schema
  const schema: SchemaData[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}');
      if (data['@type']) {
        schema.push({ type: data['@type'], data });
      } else if (Array.isArray(data)) {
        for (const item of data) {
          if (item['@type']) {
            schema.push({ type: item['@type'], data: item });
          }
        }
      }
    } catch {
      // Invalid JSON-LD
    }
  });

  // Extract FAQs from FAQ schema or page content
  const faqs: { question: string; answer: string }[] = [];
  const faqSchema = schema.find(s => s.type === 'FAQPage');
  if (faqSchema && faqSchema.data.mainEntity) {
    const entities = Array.isArray(faqSchema.data.mainEntity)
      ? faqSchema.data.mainEntity
      : [faqSchema.data.mainEntity];
    for (const entity of entities) {
      if (entity.name && entity.acceptedAnswer?.text) {
        faqs.push({
          question: entity.name as string,
          answer: entity.acceptedAnswer.text as string,
        });
      }
    }
  }

  // Fallback: extract FAQs from page structure
  if (faqs.length === 0) {
    // Look for FAQ sections with details/summary or accordion patterns
    $('details').each((_, el) => {
      const $el = $(el);
      const question = $el.find('summary').text().trim();
      const answer = $el.text().replace(question, '').trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    });
  }

  return {
    url,
    title,
    metaTitle,
    metaDescription,
    canonical,
    h1,
    headings,
    bodyText,
    wordCount,
    links,
    images,
    schema,
    faqs,
    robots,
  };
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Extract keywords from text with frequency
 */
export function extractKeywords(text: string): Map<string, number> {
  const words = text.toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);

  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  return freq;
}

/**
 * Calculate keyword density for a phrase
 */
export function calculateKeywordDensity(text: string, keyword: string): number {
  const totalWords = countWords(text);
  if (totalWords === 0) return 0;

  const keywordLower = keyword.toLowerCase();
  const textLower = text.toLowerCase();
  const matches = (textLower.match(new RegExp(keywordLower, 'g')) || []).length;

  return (matches / totalWords) * 100;
}

/**
 * Check if text contains duplicate consecutive sentences
 */
export function findDuplicateSentences(text: string): string[] {
  const sentences = text.split(/[.!?]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 20);

  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const sentence of sentences) {
    if (seen.has(sentence)) {
      duplicates.push(sentence);
    }
    seen.add(sentence);
  }

  return duplicates;
}
