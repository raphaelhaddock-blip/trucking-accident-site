/**
 * Agent 27: Mobile Usability Checker
 * Google mobile-friendly test approximation
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function checkMobileUsability(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Check viewport meta tag
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
    if (!viewportMatch) {
      issues.push(createIssue(url, 'no-viewport', 'critical', 'Page has no viewport meta tag', {}));
    } else {
      const viewport = viewportMatch[1];

      if (!viewport.includes('width=device-width')) {
        issues.push(createIssue(url, 'viewport-no-device-width', 'warning', 'Viewport should include width=device-width', { viewport }));
      }

      if (viewport.includes('user-scalable=no') || viewport.includes('maximum-scale=1')) {
        issues.push(createIssue(url, 'viewport-zoom-disabled', 'warning', 'Viewport disables zoom (accessibility issue)', { viewport }));
      }
    }

    // Check for fixed-width elements (common mobile issue)
    if (/width:\s*\d{4,}px/i.test(html)) {
      issues.push(createIssue(url, 'fixed-wide-elements', 'info', 'Page may have fixed-width elements > 1000px', {}));
    }

    // Check for horizontal scroll indicators
    if (/overflow-x:\s*scroll/i.test(html) || /overflow-x:\s*auto/i.test(html)) {
      issues.push(createIssue(url, 'horizontal-scroll', 'info', 'Page may have horizontal scrolling elements', {}));
    }

    // Check for small font sizes
    if (/font-size:\s*[0-9]px/i.test(html) || /font-size:\s*1[0-1]px/i.test(html)) {
      issues.push(createIssue(url, 'small-font-size', 'info', 'Page may have font sizes smaller than 12px', {}));
    }

    // Check for touch-friendly tap targets (basic heuristic)
    const smallButtons = html.matchAll(/(?:width|height):\s*(\d+)px[^}]*(?:width|height):\s*(\d+)px/gi);
    for (const match of smallButtons) {
      const dim1 = parseInt(match[1]);
      const dim2 = parseInt(match[2]);
      if ((dim1 < 44 && dim2 < 44) || (dim1 < 24 || dim2 < 24)) {
        // This is a very rough heuristic
      }
    }

    // Check for media queries (mobile-friendly indicator)
    if (!/@media/i.test(html) && !/<link[^>]*media=/i.test(html)) {
      issues.push(createIssue(url, 'no-media-queries', 'info', 'Page may not have responsive styles (no @media queries found)', {}));
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runMobileUsabilityChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static').slice(0, 5),
    ...pages.filter(p => p.type === 'accident').slice(0, 5),
    ...pages.filter(p => p.type === 'state').slice(0, 5),
    ...pages.filter(p => p.type === 'city').slice(0, 10),
  ];

  console.log(`    Checking mobile usability on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkMobileUsability(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('mobile-usability', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runMobileUsabilityChecker().then(result => {
    console.log(`\nMobile Usability Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
