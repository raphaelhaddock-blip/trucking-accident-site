/**
 * Agent 23: API Health Checker
 * Verify Sanity API connectivity and basic endpoints
 */

import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tspm77c6';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export async function runApiHealthChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const issues: AuditIssue[] = [];

  console.log(`    Checking API health...`);

  // Test Sanity API connectivity
  const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=*[_type == "siteSettings"][0]`;

  try {
    const startMs = Date.now();
    const response = await fetch(sanityUrl);
    const latency = Date.now() - startMs;

    if (!response.ok) {
      issues.push(createIssue(sanityUrl, 'sanity-api-error', 'critical', `Sanity API returned ${response.status}`, { status: response.status }));
    } else {
      if (latency > 2000) {
        issues.push(createIssue(sanityUrl, 'sanity-slow-response', 'warning', `Sanity API response took ${latency}ms (>2000ms)`, { latency }));
      }
    }
  } catch (error) {
    issues.push(createIssue(sanityUrl, 'sanity-unreachable', 'critical', 'Sanity API unreachable', { error: String(error) }));
  }

  // Test Vercel deployment health
  const vercelUrl = 'https://trucking-accident-site.vercel.app/';
  try {
    const startMs = Date.now();
    const response = await fetch(vercelUrl);
    const latency = Date.now() - startMs;

    if (!response.ok) {
      issues.push(createIssue(vercelUrl, 'vercel-error', 'critical', `Vercel deployment returned ${response.status}`, { status: response.status }));
    } else {
      if (latency > 3000) {
        issues.push(createIssue(vercelUrl, 'vercel-slow-response', 'warning', `Homepage response took ${latency}ms (>3000ms)`, { latency }));
      }
    }
  } catch (error) {
    issues.push(createIssue(vercelUrl, 'vercel-unreachable', 'critical', 'Vercel deployment unreachable', { error: String(error) }));
  }

  // Test sitemap endpoint
  const sitemapUrl = 'https://trucking-accident-site.vercel.app/sitemap.xml';
  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      issues.push(createIssue(sitemapUrl, 'sitemap-error', 'warning', `Sitemap returned ${response.status}`, { status: response.status }));
    }
  } catch {
    issues.push(createIssue(sitemapUrl, 'sitemap-unreachable', 'warning', 'Sitemap endpoint unreachable', {}));
  }

  return createAgentResult('api-health', startTime, 3, issues);
}

if (require.main === module) {
  runApiHealthChecker().then(result => {
    console.log(`\nAPI Health Results:`);
    console.log(`  Endpoints checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
