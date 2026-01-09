/**
 * Agent 4: Broken Link Checker
 * Find dead internal/external links
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

interface LinkCheck {
  href: string;
  sourceUrl: string;
  status: number;
  isInternal: boolean;
}

async function checkLink(href: string): Promise<number> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(href, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);
    return response.status;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return 408; // Timeout
    }
    return 0; // Network error
  }
}

async function extractLinks(url: string): Promise<Array<{ href: string; isInternal: boolean }>> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const html = await response.text();
    const links: Array<{ href: string; isInternal: boolean }> = [];

    // Extract href attributes
    const hrefMatches = html.matchAll(/href=["']([^"']+)["']/gi);
    for (const match of hrefMatches) {
      const href = match[1];

      // Skip anchors, javascript, and mailto
      if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
        continue;
      }

      const isInternal = href.startsWith('/') || href.includes('trucking-accident-site.vercel.app');

      // Normalize relative URLs
      let fullUrl = href;
      if (href.startsWith('/')) {
        fullUrl = `${BASE_URL}${href}`;
      }

      links.push({ href: fullUrl, isInternal });
    }

    return links;
  } catch {
    return [];
  }
}

export async function runBrokenLinkChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Sample pages to check
  const pagesToCheck = [
    ...pages.filter(p => p.type === 'static'),
    ...pages.filter(p => p.type === 'accident'),
    ...pages.filter(p => p.type === 'state'),
    ...pages.filter(p => p.type === 'blog'),
    // Sample 20 city pages
    ...pages.filter(p => p.type === 'city').slice(0, 20),
  ];

  console.log(`    Extracting links from ${pagesToCheck.length} pages...`);

  // Collect all unique links
  const linkMap = new Map<string, string[]>(); // href -> source pages

  for (const page of pagesToCheck) {
    const links = await extractLinks(page.url);
    for (const link of links) {
      if (!linkMap.has(link.href)) {
        linkMap.set(link.href, []);
      }
      linkMap.get(link.href)!.push(page.url);
    }
  }

  console.log(`    Checking ${linkMap.size} unique links...`);

  // Check internal links only (external link checking is slow)
  const internalLinks = [...linkMap.entries()].filter(([href]) =>
    href.includes('trucking-accident-site.vercel.app')
  );

  for (const [href, sources] of internalLinks.slice(0, 100)) {
    const status = await checkLink(href);

    if (status === 404) {
      issues.push(
        createIssue(
          sources[0],
          'broken-internal-link',
          'critical',
          `Internal link returns 404: ${href}`,
          { brokenLink: href, status, foundOn: sources }
        )
      );
    } else if (status === 0 || status >= 500) {
      issues.push(
        createIssue(
          sources[0],
          'broken-internal-link',
          'warning',
          `Internal link unreachable (${status}): ${href}`,
          { brokenLink: href, status, foundOn: sources }
        )
      );
    }
  }

  return createAgentResult('broken-links', startTime, pagesToCheck.length, issues);
}

// CLI execution
if (require.main === module) {
  runBrokenLinkChecker().then(result => {
    console.log(`\nBroken Link Checker Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nBroken Links:');
      for (const issue of result.issues) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.message}`);
      }
    }
  });
}
