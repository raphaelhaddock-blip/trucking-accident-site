/**
 * Agent 2: Duplicate Content Checker
 * Find pages with >30% content similarity using fingerprinting
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { generateFingerprint, findSimilarPairs, ContentFingerprint } from '../lib/similarity';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function fetchPageText(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) return '';

    const html = await response.text();

    // Extract main content, removing boilerplate
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return textContent;
  } catch {
    return '';
  }
}

export async function runDuplicateChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Focus on city pages (highest risk for duplicates)
  const cityPages = pages.filter(p => p.type === 'city');

  // Sample 100 city pages for comparison
  const sampledCityPages = cityPages
    .sort(() => Math.random() - 0.5)
    .slice(0, 100);

  console.log(`    Generating fingerprints for ${sampledCityPages.length} city pages...`);

  // Generate fingerprints
  const fingerprints: ContentFingerprint[] = [];
  for (const page of sampledCityPages) {
    const text = await fetchPageText(page.url);
    if (text.length > 100) {
      fingerprints.push(generateFingerprint(text, page.url));
    }
  }

  // Find similar pairs (threshold 0.5 = 50% similar)
  const similarPairs = findSimilarPairs(fingerprints, 0.5);

  console.log(`    Found ${similarPairs.length} similar pairs`);

  // Report high similarity as issues
  for (const pair of similarPairs) {
    const severity = pair.similarity > 0.7 ? 'critical' : 'warning';
    issues.push(
      createIssue(
        pair.url1,
        'duplicate-content',
        severity,
        `${Math.round(pair.similarity * 100)}% similar to ${pair.url2}`,
        {
          similarity: pair.similarity,
          comparedTo: pair.url2,
        }
      )
    );
  }

  return createAgentResult('duplicate-checker', startTime, sampledCityPages.length, issues);
}

// CLI execution
if (require.main === module) {
  runDuplicateChecker().then(result => {
    console.log(`\nDuplicate Checker Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nMost Similar Pairs:');
      for (const issue of result.issues.slice(0, 10)) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
    }
  });
}
