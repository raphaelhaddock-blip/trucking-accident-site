/**
 * Agent 10: Internal Linking Analyzer
 * Optimize link structure, find orphan pages
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

interface LinkData {
  url: string;
  outboundLinks: string[];
  inboundCount: number;
}

async function extractInternalLinks(url: string): Promise<string[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const html = await response.text();
    const links: string[] = [];

    // Extract href attributes pointing to internal pages
    const hrefMatches = html.matchAll(/href=["']([^"']+)["']/gi);
    for (const match of hrefMatches) {
      const href = match[1];

      // Only internal links
      if (href.startsWith('/') && !href.startsWith('//')) {
        // Normalize - remove anchors, trailing slashes
        const normalized = href.split('#')[0].replace(/\/$/, '') || '/';
        links.push(normalized);
      } else if (href.includes(BASE_URL)) {
        const path = href.replace(BASE_URL, '').split('#')[0].replace(/\/$/, '') || '/';
        links.push(path);
      }
    }

    return [...new Set(links)];
  } catch {
    return [];
  }
}

export async function runInternalLinkingAnalyzer(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Build a map of all page paths
  const allPaths = new Set(pages.map(p => p.path));

  // Sample pages to analyze
  const sampled = [
    ...pages.filter(p => p.type === 'static'),
    ...pages.filter(p => p.type === 'accident'),
    ...pages.filter(p => p.type === 'state'),
    ...pages.filter(p => p.type === 'blog'),
    // Sample city pages
    ...pages.filter(p => p.type === 'city').slice(0, 50),
  ];

  console.log(`    Analyzing internal links on ${sampled.length} pages...`);

  // Track inbound links to each page
  const inboundLinks = new Map<string, string[]>();
  for (const path of allPaths) {
    inboundLinks.set(path, []);
  }

  // Extract outbound links from each page
  const linkData: LinkData[] = [];
  for (const page of sampled) {
    const outbound = await extractInternalLinks(page.url);
    linkData.push({
      url: page.url,
      outboundLinks: outbound,
      inboundCount: 0,
    });

    // Track inbound links
    for (const link of outbound) {
      if (inboundLinks.has(link)) {
        inboundLinks.get(link)!.push(page.path);
      }
    }
  }

  // Check for pages with few internal links
  for (const data of linkData) {
    const page = sampled.find(p => p.url === data.url);
    if (!page) continue;

    // Skip static utility pages
    if (['privacy', 'terms', 'disclaimer', 'contact'].includes(page.slug)) continue;

    if (data.outboundLinks.length < 3) {
      issues.push(
        createIssue(
          data.url,
          'low-internal-links',
          'warning',
          `Page has only ${data.outboundLinks.length} internal links, recommend 5+`,
          { linkCount: data.outboundLinks.length }
        )
      );
    }
  }

  // Check for orphan pages (no inbound links from sampled pages)
  // Note: This is a sample-based check, not comprehensive
  for (const page of sampled) {
    const inbound = inboundLinks.get(page.path) || [];

    // Exclude homepage and utility pages
    if (page.path === '/' || ['privacy', 'terms', 'disclaimer'].includes(page.slug)) continue;

    if (inbound.length === 0) {
      issues.push(
        createIssue(
          page.url,
          'potential-orphan',
          'info',
          `Page has no inbound links from sampled pages (may have links from non-sampled pages)`,
          { path: page.path }
        )
      );
    }
  }

  // Check for accident <-> state cross-linking
  const accidentPages = sampled.filter(p => p.type === 'accident');
  const statePages = sampled.filter(p => p.type === 'state');

  for (const accidentPage of accidentPages) {
    const data = linkData.find(d => d.url === accidentPage.url);
    if (!data) continue;

    // Check if accident page links to any states
    const linksToStates = data.outboundLinks.filter(l =>
      l.startsWith('/states/') && !l.includes('/', 9) // /states/[slug] but not /states/[slug]/[city]
    );

    if (linksToStates.length < 3) {
      issues.push(
        createIssue(
          accidentPage.url,
          'missing-cross-links',
          'info',
          `Accident page links to only ${linksToStates.length} state pages, recommend 5+`,
          { stateLinks: linksToStates }
        )
      );
    }
  }

  for (const statePage of statePages) {
    const data = linkData.find(d => d.url === statePage.url);
    if (!data) continue;

    // Check if state page links to any accidents
    const linksToAccidents = data.outboundLinks.filter(l => l.startsWith('/accidents/'));

    if (linksToAccidents.length < 3) {
      issues.push(
        createIssue(
          statePage.url,
          'missing-cross-links',
          'info',
          `State page links to only ${linksToAccidents.length} accident pages, recommend 5+`,
          { accidentLinks: linksToAccidents }
        )
      );
    }
  }

  return createAgentResult('internal-linking', startTime, sampled.length, issues);
}

// CLI execution
if (require.main === module) {
  runInternalLinkingAnalyzer().then(result => {
    console.log(`\nInternal Linking Analyzer Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nLinking Issues:');
      for (const issue of result.issues.slice(0, 15)) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
    }
  });
}
