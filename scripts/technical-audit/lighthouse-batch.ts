/**
 * Agent 11: Lighthouse Batch Runner
 * Run Lighthouse on sample pages
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

async function runLighthouse(url: string): Promise<LighthouseScores | null> {
  try {
    const { stdout } = await execAsync(
      `npx lighthouse "${url}" --output=json --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --quiet 2>/dev/null`,
      { timeout: 120000 }
    );

    const report = JSON.parse(stdout);
    return {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
    };
  } catch (error) {
    return null;
  }
}

export async function runLighthouseBatch(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Sample: 1 static, 5 accident, 5 state, 5 city
  const sampled = [
    pages.find(p => p.path === '/')!,
    ...pages.filter(p => p.type === 'accident').slice(0, 5),
    ...pages.filter(p => p.type === 'state').slice(0, 5),
    ...pages.filter(p => p.type === 'city').slice(0, 5),
  ].filter(Boolean);

  console.log(`    Running Lighthouse on ${sampled.length} pages (this takes a while)...`);

  for (const page of sampled) {
    console.log(`      Testing ${page.path}...`);
    const scores = await runLighthouse(page.url);

    if (!scores) {
      issues.push(
        createIssue(
          page.url,
          'lighthouse-failed',
          'warning',
          'Lighthouse test failed to complete',
          {}
        )
      );
      continue;
    }

    // Check performance
    if (scores.performance < 90) {
      const severity = scores.performance < 50 ? 'critical' : 'warning';
      issues.push(
        createIssue(
          page.url,
          'low-performance',
          severity,
          `Performance score: ${scores.performance} (target: 90+)`,
          { scores }
        )
      );
    }

    // Check accessibility
    if (scores.accessibility < 95) {
      const severity = scores.accessibility < 80 ? 'critical' : 'warning';
      issues.push(
        createIssue(
          page.url,
          'low-accessibility',
          severity,
          `Accessibility score: ${scores.accessibility} (target: 95+)`,
          { scores }
        )
      );
    }

    // Check best practices
    if (scores.bestPractices < 100) {
      issues.push(
        createIssue(
          page.url,
          'best-practices-issues',
          'info',
          `Best Practices score: ${scores.bestPractices} (target: 100)`,
          { scores }
        )
      );
    }

    // Check SEO
    if (scores.seo < 100) {
      const severity = scores.seo < 90 ? 'warning' : 'info';
      issues.push(
        createIssue(
          page.url,
          'seo-issues',
          severity,
          `SEO score: ${scores.seo} (target: 100)`,
          { scores }
        )
      );
    }
  }

  return createAgentResult('lighthouse-batch', startTime, sampled.length, issues);
}

// CLI execution
if (require.main === module) {
  runLighthouseBatch().then(result => {
    console.log(`\nLighthouse Batch Results:`);
    console.log(`  Pages tested: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nIssues:');
      for (const issue of result.issues) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
    }
  });
}
