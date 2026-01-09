/**
 * Agent 3: Keyword Stuffing Detector
 * Flag unnatural keyword density
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { calculateKeywordDensity } from '../lib/content-extractor';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const KEYWORDS_TO_CHECK = [
  { phrase: 'truck accident', maxDensity: 3 },
  { phrase: '18-wheeler', maxDensity: 2 },
  { phrase: 'semi truck', maxDensity: 2 },
  { phrase: 'trucking accident', maxDensity: 2.5 },
  { phrase: 'truck crash', maxDensity: 2 },
  { phrase: 'big rig', maxDensity: 2 },
  { phrase: 'commercial truck', maxDensity: 2 },
];

async function fetchPageText(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) return '';

    const html = await response.text();
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch {
    return '';
  }
}

export async function runKeywordStuffingDetector(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Check accident and state pages (most likely to have keyword stuffing)
  const pagesToCheck = pages.filter(p =>
    p.type === 'accident' || p.type === 'state' || p.type === 'blog'
  );

  console.log(`    Checking ${pagesToCheck.length} pages for keyword stuffing...`);

  for (const page of pagesToCheck) {
    const text = await fetchPageText(page.url);
    if (text.length < 100) continue;

    for (const { phrase, maxDensity } of KEYWORDS_TO_CHECK) {
      const density = calculateKeywordDensity(text, phrase);

      if (density > maxDensity) {
        const severity = density > maxDensity * 1.5 ? 'critical' : 'warning';
        issues.push(
          createIssue(
            page.url,
            'keyword-stuffing',
            severity,
            `"${phrase}" density is ${density.toFixed(2)}%, exceeds ${maxDensity}% threshold`,
            { keyword: phrase, density, threshold: maxDensity }
          )
        );
      }
    }
  }

  return createAgentResult('keyword-stuffing', startTime, pagesToCheck.length, issues);
}

// CLI execution
if (require.main === module) {
  runKeywordStuffingDetector().then(result => {
    console.log(`\nKeyword Stuffing Detector Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nIssues:');
      for (const issue of result.issues.slice(0, 10)) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
    }
  });
}
