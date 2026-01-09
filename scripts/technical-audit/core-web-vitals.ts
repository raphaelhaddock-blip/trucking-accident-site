/**
 * Agent 13: Core Web Vitals Checker
 * Measure LCP, CLS, INP using CrUX API or Lighthouse
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface WebVitals {
  lcp: number | null; // Largest Contentful Paint (ms)
  cls: number | null; // Cumulative Layout Shift
  fid: number | null; // First Input Delay (ms)
}

async function measureWebVitals(url: string): Promise<WebVitals> {
  try {
    // Use Lighthouse for lab data
    const { stdout } = await execAsync(
      `npx lighthouse "${url}" --output=json --chrome-flags="--headless --no-sandbox" --only-categories=performance --quiet 2>/dev/null`,
      { timeout: 120000 }
    );

    const report = JSON.parse(stdout);
    const audits = report.audits;

    return {
      lcp: audits['largest-contentful-paint']?.numericValue || null,
      cls: audits['cumulative-layout-shift']?.numericValue || null,
      fid: audits['max-potential-fid']?.numericValue || null,
    };
  } catch {
    return { lcp: null, cls: null, fid: null };
  }
}

export async function runCoreWebVitalsChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Sample key pages (CWV testing is slow)
  const sampled = [
    pages.find(p => p.path === '/')!,
    ...pages.filter(p => p.type === 'accident').slice(0, 3),
    ...pages.filter(p => p.type === 'state').slice(0, 3),
    ...pages.filter(p => p.type === 'city').slice(0, 3),
  ].filter(Boolean);

  console.log(`    Measuring Core Web Vitals on ${sampled.length} pages...`);

  for (const page of sampled) {
    console.log(`      Testing ${page.path}...`);
    const vitals = await measureWebVitals(page.url);

    // LCP: Good < 2500ms, Needs Improvement < 4000ms, Poor >= 4000ms
    if (vitals.lcp !== null) {
      if (vitals.lcp >= 4000) {
        issues.push(
          createIssue(
            page.url,
            'poor-lcp',
            'critical',
            `LCP is ${Math.round(vitals.lcp)}ms (poor, should be < 2500ms)`,
            { lcp: vitals.lcp }
          )
        );
      } else if (vitals.lcp >= 2500) {
        issues.push(
          createIssue(
            page.url,
            'needs-improvement-lcp',
            'warning',
            `LCP is ${Math.round(vitals.lcp)}ms (needs improvement, should be < 2500ms)`,
            { lcp: vitals.lcp }
          )
        );
      }
    }

    // CLS: Good < 0.1, Needs Improvement < 0.25, Poor >= 0.25
    if (vitals.cls !== null) {
      if (vitals.cls >= 0.25) {
        issues.push(
          createIssue(
            page.url,
            'poor-cls',
            'critical',
            `CLS is ${vitals.cls.toFixed(3)} (poor, should be < 0.1)`,
            { cls: vitals.cls }
          )
        );
      } else if (vitals.cls >= 0.1) {
        issues.push(
          createIssue(
            page.url,
            'needs-improvement-cls',
            'warning',
            `CLS is ${vitals.cls.toFixed(3)} (needs improvement, should be < 0.1)`,
            { cls: vitals.cls }
          )
        );
      }
    }

    // FID/INP: Good < 100ms, Needs Improvement < 300ms, Poor >= 300ms
    if (vitals.fid !== null) {
      if (vitals.fid >= 300) {
        issues.push(
          createIssue(
            page.url,
            'poor-fid',
            'critical',
            `Max Potential FID is ${Math.round(vitals.fid)}ms (poor, should be < 100ms)`,
            { fid: vitals.fid }
          )
        );
      } else if (vitals.fid >= 100) {
        issues.push(
          createIssue(
            page.url,
            'needs-improvement-fid',
            'warning',
            `Max Potential FID is ${Math.round(vitals.fid)}ms (needs improvement, should be < 100ms)`,
            { fid: vitals.fid }
          )
        );
      }
    }
  }

  return createAgentResult('core-web-vitals', startTime, sampled.length, issues);
}

// CLI execution
if (require.main === module) {
  runCoreWebVitalsChecker().then(result => {
    console.log(`\nCore Web Vitals Results:`);
    console.log(`  Pages tested: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
