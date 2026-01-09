/**
 * Agent 17: Robots/Sitemap Validator
 * Ensure crawlability
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

export async function runRobotsSitemapValidator(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  console.log(`    Validating robots.txt and sitemap...`);

  // Check robots.txt
  try {
    const robotsResponse = await fetch(`${BASE_URL}/robots.txt`);
    if (!robotsResponse.ok) {
      issues.push(createIssue(`${BASE_URL}/robots.txt`, 'missing-robots', 'warning', 'robots.txt not found', {}));
    } else {
      const robotsText = await robotsResponse.text();

      // Check for Disallow: /
      if (/Disallow:\s*\/\s*$/m.test(robotsText)) {
        issues.push(createIssue(`${BASE_URL}/robots.txt`, 'blocking-all', 'critical', 'robots.txt blocks all crawlers with Disallow: /', {}));
      }

      // Check for sitemap reference
      if (!/Sitemap:/i.test(robotsText)) {
        issues.push(createIssue(`${BASE_URL}/robots.txt`, 'missing-sitemap-reference', 'warning', 'robots.txt should reference sitemap', {}));
      }
    }
  } catch {
    issues.push(createIssue(`${BASE_URL}/robots.txt`, 'robots-error', 'warning', 'Failed to fetch robots.txt', {}));
  }

  // Check sitemap
  try {
    const sitemapResponse = await fetch(`${BASE_URL}/sitemap.xml`);
    if (!sitemapResponse.ok) {
      issues.push(createIssue(`${BASE_URL}/sitemap.xml`, 'missing-sitemap', 'warning', 'sitemap.xml not found', {}));
    } else {
      const sitemapText = await sitemapResponse.text();

      // Count URLs in sitemap
      const urlCount = (sitemapText.match(/<loc>/g) || []).length;
      const expectedCount = pages.length;

      if (urlCount === 0) {
        issues.push(createIssue(`${BASE_URL}/sitemap.xml`, 'empty-sitemap', 'critical', 'Sitemap contains no URLs', {}));
      } else if (urlCount < expectedCount * 0.8) {
        issues.push(createIssue(`${BASE_URL}/sitemap.xml`, 'incomplete-sitemap', 'warning', `Sitemap has ${urlCount} URLs, expected ~${expectedCount}`, { urlCount, expected: expectedCount }));
      }

      // Sample check: verify a few URLs in sitemap return 200
      const urlMatches = sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g);
      const sampleUrls = [...urlMatches].slice(0, 10).map(m => m[1]);

      for (const sampleUrl of sampleUrls) {
        try {
          const response = await fetch(sampleUrl, { method: 'HEAD' });
          if (!response.ok) {
            issues.push(createIssue(sampleUrl, 'sitemap-dead-link', 'warning', `Sitemap URL returns ${response.status}`, { status: response.status }));
          }
        } catch {
          issues.push(createIssue(sampleUrl, 'sitemap-unreachable', 'warning', 'Sitemap URL unreachable', {}));
        }
      }
    }
  } catch {
    issues.push(createIssue(`${BASE_URL}/sitemap.xml`, 'sitemap-error', 'warning', 'Failed to fetch sitemap.xml', {}));
  }

  return createAgentResult('robots-sitemap', startTime, 2, issues);
}

if (require.main === module) {
  runRobotsSitemapValidator().then(result => {
    console.log(`\nRobots/Sitemap Validator Results:`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
