/**
 * Agent 24: Redirect Chain Checker
 * Find redirect issues
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

async function checkRedirects(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];
  const redirectChain: string[] = [url];

  try {
    let currentUrl = url;
    let redirectCount = 0;
    const maxRedirects = 10;

    while (redirectCount < maxRedirects) {
      const response = await fetch(currentUrl, { redirect: 'manual' });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) break;

        redirectCount++;
        currentUrl = location.startsWith('/') ? `${BASE_URL}${location}` : location;
        redirectChain.push(currentUrl);

        // Check redirect type
        if (response.status === 302) {
          issues.push(createIssue(url, 'temporary-redirect', 'info', `Uses 302 (temporary) redirect instead of 301`, { from: redirectChain[redirectChain.length - 2], to: currentUrl }));
        }
      } else {
        break;
      }
    }

    // Check for redirect chains
    if (redirectChain.length > 2) {
      issues.push(createIssue(url, 'redirect-chain', 'warning', `Redirect chain of ${redirectChain.length - 1} hops`, { chain: redirectChain }));
    }

    // Check for redirect loops (simplified)
    const uniqueUrls = new Set(redirectChain);
    if (uniqueUrls.size < redirectChain.length) {
      issues.push(createIssue(url, 'redirect-loop', 'critical', 'Possible redirect loop detected', { chain: redirectChain }));
    }

  } catch {
    // Network error
  }

  return issues;
}

async function checkTrailingSlashConsistency(): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];
  const testPaths = ['/about', '/contact', '/states', '/accidents'];

  for (const path of testPaths) {
    try {
      // Test with trailing slash
      const withSlash = await fetch(`${BASE_URL}${path}/`, { redirect: 'manual' });
      // Test without trailing slash
      const withoutSlash = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' });

      // Check if they behave differently
      if (withSlash.status !== withoutSlash.status) {
        issues.push(createIssue(`${BASE_URL}${path}`, 'trailing-slash-inconsistency', 'info', `Trailing slash inconsistency: ${path} (${withoutSlash.status}) vs ${path}/ (${withSlash.status})`, { path }));
      }
    } catch {
      // Network error
    }
  }

  return issues;
}

export async function runRedirectChainChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static'),
    ...pages.filter(p => p.type === 'accident').slice(0, 10),
    ...pages.filter(p => p.type === 'state').slice(0, 10),
  ];

  console.log(`    Checking redirects on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkRedirects(page.url);
    allIssues.push(...issues);
  }

  // Also check trailing slash consistency
  const slashIssues = await checkTrailingSlashConsistency();
  allIssues.push(...slashIssues);

  return createAgentResult('redirect-chains', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runRedirectChainChecker().then(result => {
    console.log(`\nRedirect Chain Results:`);
    console.log(`  URLs checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
