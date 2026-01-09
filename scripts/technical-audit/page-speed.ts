/**
 * Agent 25: Page Speed Checker
 * Measure load times
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function measurePageSpeed(url: string): Promise<{ ttfb: number; totalTime: number } | null> {
  try {
    const startTime = Date.now();

    const response = await fetch(url);
    const ttfb = Date.now() - startTime;

    // Read full response
    await response.text();
    const totalTime = Date.now() - startTime;

    return { ttfb, totalTime };
  } catch {
    return null;
  }
}

export async function runPageSpeedChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    pages.find(p => p.path === '/')!,
    ...pages.filter(p => p.type === 'accident').slice(0, 5),
    ...pages.filter(p => p.type === 'state').slice(0, 5),
    ...pages.filter(p => p.type === 'city').slice(0, 10),
  ].filter(Boolean);

  console.log(`    Measuring page speed on ${sampled.length} pages...`);

  for (const page of sampled) {
    const timing = await measurePageSpeed(page.url);

    if (!timing) {
      allIssues.push(createIssue(page.url, 'page-unreachable', 'critical', 'Page failed to load', {}));
      continue;
    }

    // TTFB thresholds: Good < 600ms, Needs Improvement < 1800ms, Poor >= 1800ms
    if (timing.ttfb >= 1800) {
      allIssues.push(createIssue(page.url, 'poor-ttfb', 'critical', `TTFB is ${timing.ttfb}ms (poor, should be < 600ms)`, { ttfb: timing.ttfb }));
    } else if (timing.ttfb >= 600) {
      allIssues.push(createIssue(page.url, 'slow-ttfb', 'warning', `TTFB is ${timing.ttfb}ms (needs improvement, should be < 600ms)`, { ttfb: timing.ttfb }));
    }

    // Total load time thresholds
    if (timing.totalTime >= 4000) {
      allIssues.push(createIssue(page.url, 'slow-page-load', 'warning', `Page load took ${timing.totalTime}ms (>4s)`, { totalTime: timing.totalTime }));
    }
  }

  return createAgentResult('page-speed', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runPageSpeedChecker().then(result => {
    console.log(`\nPage Speed Results:`);
    console.log(`  Pages tested: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
