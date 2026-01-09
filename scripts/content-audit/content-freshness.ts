/**
 * Agent 8: Content Freshness Checker
 * Flag stale content
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
const CURRENT_YEAR = new Date().getFullYear();

async function checkContentFreshness(url: string): Promise<{
  lastUpdated: string | null;
  hasStaleYears: boolean;
  staleReferences: string[];
}> {
  try {
    const response = await fetch(url);
    if (!response.ok) return { lastUpdated: null, hasStaleYears: false, staleReferences: [] };

    const html = await response.text();

    // Look for lastUpdated in schema or data attributes
    let lastUpdated: string | null = null;
    const dateMatch = html.match(/dateModified["']?\s*:\s*["']([^"']+)["']/i) ||
                      html.match(/lastUpdated["']?\s*:\s*["']([^"']+)["']/i) ||
                      html.match(/Updated:?\s*([A-Za-z]+ \d{1,2},? \d{4})/i);

    if (dateMatch) {
      lastUpdated = dateMatch[1];
    }

    // Check for stale year references (years before current - 1)
    const staleReferences: string[] = [];
    const oldYears = [2020, 2021, 2022, 2023]; // Years that might be outdated

    for (const year of oldYears) {
      // Look for mentions like "in 2022" or "2022 data" without context
      const yearRegex = new RegExp(`\\b${year}\\b(?!\\s*(FARS|NHTSA|data|statistics))`, 'gi');
      if (yearRegex.test(html)) {
        // Check if it's in a date context that's ok
        const contextRegex = new RegExp(`(latest|most recent|as of|through)\\s*${year}`, 'i');
        if (!contextRegex.test(html)) {
          staleReferences.push(`${year}`);
        }
      }
    }

    // Check for outdated legal references
    const outdatedLegalPatterns = [
      /statute of limitations.*\d+\s*years.*\(as of \d{4}\)/i,
      /law changed in 20(1|2)\d/i,
    ];

    let hasStaleYears = staleReferences.length > 0;

    return { lastUpdated, hasStaleYears, staleReferences: [...new Set(staleReferences)] };
  } catch {
    return { lastUpdated: null, hasStaleYears: false, staleReferences: [] };
  }
}

export async function runContentFreshnessChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Check all pages except static utility pages
  const pagesToCheck = pages.filter(p =>
    p.type === 'accident' || p.type === 'state' || p.type === 'city' || p.type === 'blog'
  );

  // Sample for speed
  const sampled = [
    ...pagesToCheck.filter(p => p.type !== 'city'),
    ...pagesToCheck.filter(p => p.type === 'city').slice(0, 30),
  ];

  console.log(`    Checking content freshness on ${sampled.length} pages...`);

  const now = new Date();

  for (const page of sampled) {
    const { lastUpdated, hasStaleYears, staleReferences } = await checkContentFreshness(page.url);

    // Check lastUpdated date
    if (lastUpdated) {
      try {
        const updatedDate = new Date(lastUpdated);
        const ageMs = now.getTime() - updatedDate.getTime();

        if (ageMs > SIX_MONTHS_MS) {
          const monthsOld = Math.floor(ageMs / (30 * 24 * 60 * 60 * 1000));
          issues.push(
            createIssue(
              page.url,
              'stale-content',
              'warning',
              `Content last updated ${monthsOld} months ago (${lastUpdated})`,
              { lastUpdated, monthsOld }
            )
          );
        }
      } catch {
        // Invalid date format
      }
    }

    // Check for stale year references
    if (hasStaleYears && staleReferences.length > 0) {
      issues.push(
        createIssue(
          page.url,
          'outdated-references',
          'info',
          `Contains potentially outdated year references: ${staleReferences.join(', ')}`,
          { staleReferences }
        )
      );
    }
  }

  return createAgentResult('content-freshness', startTime, sampled.length, issues);
}

// CLI execution
if (require.main === module) {
  runContentFreshnessChecker().then(result => {
    console.log(`\nContent Freshness Checker Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nIssues:');
      for (const issue of result.issues.slice(0, 15)) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
    }
  });
}
