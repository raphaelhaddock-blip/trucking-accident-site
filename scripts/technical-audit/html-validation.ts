/**
 * Agent 19: HTML Validator
 * Check for common HTML issues
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function validateHtml(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Check for doctype
    if (!html.trim().toLowerCase().startsWith('<!doctype html')) {
      issues.push(createIssue(url, 'missing-doctype', 'warning', 'Page missing HTML5 doctype', {}));
    }

    // Check for duplicate IDs
    const idMatches = html.matchAll(/\bid=["']([^"']+)["']/gi);
    const ids = new Map<string, number>();
    for (const match of idMatches) {
      const id = match[1];
      ids.set(id, (ids.get(id) || 0) + 1);
    }
    for (const [id, count] of ids) {
      if (count > 1) {
        issues.push(createIssue(url, 'duplicate-id', 'warning', `Duplicate ID found: "${id}" (${count} times)`, { id, count }));
      }
    }

    // Check heading hierarchy
    const headings: number[] = [];
    const headingMatches = html.matchAll(/<h([1-6])[^>]*>/gi);
    for (const match of headingMatches) {
      headings.push(parseInt(match[1]));
    }

    // Check for multiple H1s
    const h1Count = headings.filter(h => h === 1).length;
    if (h1Count === 0) {
      issues.push(createIssue(url, 'missing-h1', 'warning', 'Page has no H1 heading', {}));
    } else if (h1Count > 1) {
      issues.push(createIssue(url, 'multiple-h1', 'info', `Page has ${h1Count} H1 headings (recommend 1)`, { count: h1Count }));
    }

    // Check for skipped heading levels
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i - 1] + 1) {
        issues.push(createIssue(url, 'skipped-heading', 'info', `Heading hierarchy skipped from H${headings[i - 1]} to H${headings[i]}`, { from: headings[i - 1], to: headings[i] }));
        break; // Only report first instance
      }
    }

    // Check for lang attribute
    if (!/<html[^>]*lang=/i.test(html)) {
      issues.push(createIssue(url, 'missing-lang', 'warning', 'HTML tag missing lang attribute', {}));
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runHtmlValidator(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static'),
    ...pages.filter(p => p.type === 'accident').slice(0, 10),
    ...pages.filter(p => p.type === 'state').slice(0, 10),
    ...pages.filter(p => p.type === 'city').slice(0, 20),
  ];

  console.log(`    Validating HTML on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await validateHtml(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('html-validation', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runHtmlValidator().then(result => {
    console.log(`\nHTML Validation Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
