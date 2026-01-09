/**
 * Agent 16: Canonical URL Checker
 * Validate canonical URLs
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

async function checkCanonical(url: string, expectedPath: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                          html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);

    if (!canonicalMatch) {
      issues.push(createIssue(url, 'missing-canonical', 'warning', 'Page missing canonical URL', {}));
    } else {
      const canonical = canonicalMatch[1];
      const expectedCanonical = `${BASE_URL}${expectedPath}`;

      // Check if canonical is absolute
      if (!canonical.startsWith('http')) {
        issues.push(createIssue(url, 'relative-canonical', 'warning', `Canonical URL should be absolute: ${canonical}`, { canonical }));
      }

      // Check if canonical matches expected
      if (canonical !== expectedCanonical && canonical !== url) {
        issues.push(createIssue(url, 'mismatched-canonical', 'warning', `Canonical URL doesn't match page URL. Got: ${canonical}, Expected: ${expectedCanonical}`, { canonical, expected: expectedCanonical }));
      }

      // Check for trailing slash inconsistency
      if ((canonical.endsWith('/') && !expectedPath.endsWith('/')) ||
          (!canonical.endsWith('/') && expectedPath.endsWith('/') && expectedPath !== '/')) {
        issues.push(createIssue(url, 'canonical-trailing-slash', 'info', 'Canonical URL trailing slash inconsistency', { canonical }));
      }
    }
  } catch {
    // Network error
  }

  return issues;
}

export async function runCanonicalChecker(): Promise<AgentResult> {
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

  console.log(`    Checking canonicals on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkCanonical(page.url, page.path);
    allIssues.push(...issues);
  }

  return createAgentResult('canonical-checker', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runCanonicalChecker().then(result => {
    console.log(`\nCanonical Checker Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
