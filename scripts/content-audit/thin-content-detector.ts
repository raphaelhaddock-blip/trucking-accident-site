/**
 * Agent 1: Thin Content Detector
 * Flags pages below word count thresholds
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

async function fetchPageWordCount(page: PageInfo): Promise<{ wordCount: number; faqCount: number }> {
  try {
    const response = await fetch(page.url);
    if (!response.ok) {
      return { wordCount: 0, faqCount: 0 };
    }

    const html = await response.text();

    // Simple word count from HTML (strip tags)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

    // Count FAQs by looking for FAQ schema or details elements
    const faqMatches = html.match(/<details/gi) || [];
    const schemaFaqMatches = html.match(/"@type":\s*"Question"/gi) || [];
    const faqCount = Math.max(faqMatches.length, schemaFaqMatches.length);

    return { wordCount, faqCount };
  } catch (error) {
    return { wordCount: 0, faqCount: 0 };
  }
}

export async function runThinContentDetector(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Sample pages for testing (full run would be too slow)
  // For cities, sample 50 random ones
  const staticPages = pages.filter(p => p.type === 'static');
  const accidentPages = pages.filter(p => p.type === 'accident');
  const statePages = pages.filter(p => p.type === 'state');
  const blogPages = pages.filter(p => p.type === 'blog');
  const cityPages = pages.filter(p => p.type === 'city');

  // Sample 50 city pages randomly
  const sampledCityPages = cityPages
    .sort(() => Math.random() - 0.5)
    .slice(0, 50);

  const pagesToCheck = [
    ...staticPages,
    ...accidentPages,
    ...statePages,
    ...blogPages,
    ...sampledCityPages,
  ];

  console.log(`    Checking ${pagesToCheck.length} pages for thin content...`);

  for (const page of pagesToCheck) {
    const { wordCount, faqCount } = await fetchPageWordCount(page);

    // Check word count threshold
    if (wordCount < page.wordThreshold) {
      const severity = wordCount < page.wordThreshold / 2 ? 'critical' : 'warning';
      issues.push(
        createIssue(
          page.url,
          'thin-content',
          severity,
          `Page has ${wordCount} words, below threshold of ${page.wordThreshold}`,
          { wordCount, threshold: page.wordThreshold, pageType: page.type }
        )
      );
    }

    // Check FAQ count (except static pages)
    if (page.type !== 'static' && faqCount < 5) {
      issues.push(
        createIssue(
          page.url,
          'insufficient-faqs',
          'warning',
          `Page has only ${faqCount} FAQs, minimum recommended is 5`,
          { faqCount, pageType: page.type }
        )
      );
    }
  }

  return createAgentResult('thin-content', startTime, pagesToCheck.length, issues);
}

// CLI execution
if (require.main === module) {
  runThinContentDetector().then(result => {
    console.log(`\nThin Content Detector Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nIssues:');
      for (const issue of result.issues.slice(0, 10)) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
      if (result.issues.length > 10) {
        console.log(`  ... and ${result.issues.length - 10} more`);
      }
    }
  });
}
