/**
 * Agent 14: Meta Tags Validator
 * Ensure all required meta tags present
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function validateMetaTags(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Check og:title
    if (!/<meta[^>]*property=["']og:title["']/i.test(html)) {
      issues.push(createIssue(url, 'missing-og-title', 'warning', 'Missing og:title meta tag', {}));
    }

    // Check og:description
    if (!/<meta[^>]*property=["']og:description["']/i.test(html)) {
      issues.push(createIssue(url, 'missing-og-description', 'warning', 'Missing og:description meta tag', {}));
    }

    // Check og:image
    if (!/<meta[^>]*property=["']og:image["']/i.test(html)) {
      issues.push(createIssue(url, 'missing-og-image', 'warning', 'Missing og:image meta tag', {}));
    }

    // Check twitter:card
    if (!/<meta[^>]*name=["']twitter:card["']/i.test(html)) {
      issues.push(createIssue(url, 'missing-twitter-card', 'info', 'Missing twitter:card meta tag', {}));
    }

    // Check canonical
    if (!/<link[^>]*rel=["']canonical["']/i.test(html)) {
      issues.push(createIssue(url, 'missing-canonical', 'warning', 'Missing canonical link tag', {}));
    }

    // Check robots
    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
    if (robotsMatch && robotsMatch[1].includes('noindex')) {
      issues.push(createIssue(url, 'noindex-set', 'critical', 'Page has noindex directive', { robots: robotsMatch[1] }));
    }

    // Check title tag
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      issues.push(createIssue(url, 'missing-title', 'critical', 'Page missing title tag', {}));
    }

    // Check meta description
    if (!/<meta[^>]*name=["']description["']/i.test(html)) {
      issues.push(createIssue(url, 'missing-meta-description', 'warning', 'Missing meta description', {}));
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runMetaTagsValidator(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static'),
    ...pages.filter(p => p.type === 'accident'),
    ...pages.filter(p => p.type === 'state'),
    ...pages.filter(p => p.type === 'blog'),
    ...pages.filter(p => p.type === 'city').slice(0, 30),
  ];

  console.log(`    Validating meta tags on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await validateMetaTags(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('meta-tags', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runMetaTagsValidator().then(result => {
    console.log(`\nMeta Tags Validator Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
