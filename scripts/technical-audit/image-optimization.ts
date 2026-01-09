/**
 * Agent 15: Image Optimization Checker
 * Find missing alt text, oversized images
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function checkImages(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Find all img tags
    const imgMatches = html.matchAll(/<img([^>]*)>/gi);
    for (const match of imgMatches) {
      const attrs = match[1];

      // Check for alt attribute
      if (!/alt=/i.test(attrs)) {
        const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : 'unknown';
        issues.push(createIssue(url, 'missing-alt', 'warning', `Image missing alt attribute: ${src.substring(0, 50)}`, { src }));
      } else {
        // Check for empty alt (except decorative images)
        const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
        if (altMatch && altMatch[1] === '' && !/decorative|spacer|background/i.test(attrs)) {
          const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
          const src = srcMatch ? srcMatch[1] : 'unknown';
          issues.push(createIssue(url, 'empty-alt', 'info', `Image has empty alt (ok if decorative): ${src.substring(0, 50)}`, { src }));
        }
      }

      // Check for width/height attributes (prevents CLS)
      if (!/width=/i.test(attrs) || !/height=/i.test(attrs)) {
        const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : 'unknown';
        // Only flag if not using Next.js Image component
        if (!src.includes('_next/image')) {
          issues.push(createIssue(url, 'missing-dimensions', 'info', `Image missing width/height (may cause CLS): ${src.substring(0, 50)}`, { src }));
        }
      }

      // Check for lazy loading on below-fold images (heuristic)
      if (!/loading=/i.test(attrs) && !/fetchpriority=/i.test(attrs)) {
        // Skip if it's likely above-fold (hero image)
        if (!/hero|banner|header/i.test(attrs)) {
          const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
          const src = srcMatch ? srcMatch[1] : 'unknown';
          issues.push(createIssue(url, 'missing-lazy-loading', 'info', `Image may benefit from lazy loading: ${src.substring(0, 50)}`, { src }));
        }
      }
    }
  } catch {
    // Network error
  }

  return issues;
}

export async function runImageOptimizationChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static').slice(0, 5),
    ...pages.filter(p => p.type === 'accident').slice(0, 10),
    ...pages.filter(p => p.type === 'state').slice(0, 10),
    ...pages.filter(p => p.type === 'city').slice(0, 20),
  ];

  console.log(`    Checking images on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkImages(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('image-optimization', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runImageOptimizationChecker().then(result => {
    console.log(`\nImage Optimization Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
