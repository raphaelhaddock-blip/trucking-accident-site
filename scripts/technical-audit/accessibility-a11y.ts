/**
 * Agent 20: Accessibility (a11y) Checker
 * Basic WCAG compliance checks
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function checkAccessibility(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Check for skip navigation link
    if (!/<a[^>]*skip[^>]*>/i.test(html) && !/<a[^>]*href="#main/i.test(html)) {
      issues.push(createIssue(url, 'missing-skip-link', 'info', 'Page missing skip navigation link', {}));
    }

    // Check images for alt text
    const imgWithoutAlt = html.match(/<img(?![^>]*alt=)[^>]*>/gi) || [];
    if (imgWithoutAlt.length > 0) {
      issues.push(createIssue(url, 'images-without-alt', 'warning', `${imgWithoutAlt.length} image(s) missing alt attribute`, { count: imgWithoutAlt.length }));
    }

    // Check form labels
    const inputs = html.matchAll(/<input[^>]*type=["'](?:text|email|tel|password|number)["'][^>]*>/gi);
    for (const input of inputs) {
      const inputHtml = input[0];
      const idMatch = inputHtml.match(/id=["']([^"']+)["']/i);
      if (idMatch) {
        const labelRegex = new RegExp(`<label[^>]*for=["']${idMatch[1]}["']`, 'i');
        if (!labelRegex.test(html) && !/aria-label/i.test(inputHtml)) {
          issues.push(createIssue(url, 'input-without-label', 'warning', `Input "${idMatch[1]}" missing associated label`, { inputId: idMatch[1] }));
        }
      }
    }

    // Check for ARIA landmarks
    const hasMain = /<main/i.test(html) || /role=["']main["']/i.test(html);
    const hasNav = /<nav/i.test(html) || /role=["']navigation["']/i.test(html);
    if (!hasMain) {
      issues.push(createIssue(url, 'missing-main-landmark', 'info', 'Page missing <main> landmark', {}));
    }
    if (!hasNav) {
      issues.push(createIssue(url, 'missing-nav-landmark', 'info', 'Page missing <nav> landmark', {}));
    }

    // Check for buttons without accessible names
    const emptyButtons = html.match(/<button[^>]*>\s*<\/button>/gi) || [];
    const iconOnlyButtons = html.match(/<button[^>]*>(?:\s*<(?:svg|i|span)[^>]*>[^<]*<\/(?:svg|i|span)>\s*)<\/button>/gi) || [];
    if (emptyButtons.length > 0 || iconOnlyButtons.length > 0) {
      const count = emptyButtons.length + iconOnlyButtons.length;
      issues.push(createIssue(url, 'buttons-without-text', 'warning', `${count} button(s) may lack accessible names`, { count }));
    }

    // Check for focus visible styles (basic check)
    if (/:focus\s*\{[^}]*outline:\s*none/i.test(html) || /:focus\s*\{[^}]*outline:\s*0/i.test(html)) {
      issues.push(createIssue(url, 'focus-outline-removed', 'warning', 'Focus outline may be removed (accessibility issue)', {}));
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runAccessibilityChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static'),
    ...pages.filter(p => p.type === 'accident').slice(0, 10),
    ...pages.filter(p => p.type === 'state').slice(0, 10),
    ...pages.filter(p => p.type === 'city').slice(0, 10),
  ];

  console.log(`    Checking accessibility on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkAccessibility(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('accessibility-a11y', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runAccessibilityChecker().then(result => {
    console.log(`\nAccessibility Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
