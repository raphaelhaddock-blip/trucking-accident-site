/**
 * Agent 12: Mobile Responsive Checker
 * Find viewport/touch issues
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function checkMobileResponsive(url: string): Promise<{
  hasViewport: boolean;
  viewportContent: string | null;
  hasTouchIcons: boolean;
}> {
  try {
    const response = await fetch(url);
    if (!response.ok) return { hasViewport: false, viewportContent: null, hasTouchIcons: false };

    const html = await response.text();

    // Check viewport meta tag
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
    const hasViewport = !!viewportMatch;
    const viewportContent = viewportMatch ? viewportMatch[1] : null;

    // Check for touch icons
    const hasTouchIcons = /apple-touch-icon/i.test(html) || /icon.*sizes/i.test(html);

    return { hasViewport, viewportContent, hasTouchIcons };
  } catch {
    return { hasViewport: false, viewportContent: null, hasTouchIcons: false };
  }
}

export async function runMobileResponsiveChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Sample pages
  const sampled = [
    ...pages.filter(p => p.type === 'static').slice(0, 5),
    ...pages.filter(p => p.type === 'accident').slice(0, 5),
    ...pages.filter(p => p.type === 'state').slice(0, 5),
    ...pages.filter(p => p.type === 'city').slice(0, 10),
  ];

  console.log(`    Checking mobile responsiveness on ${sampled.length} pages...`);

  for (const page of sampled) {
    const { hasViewport, viewportContent, hasTouchIcons } = await checkMobileResponsive(page.url);

    if (!hasViewport) {
      issues.push(
        createIssue(
          page.url,
          'missing-viewport',
          'critical',
          'Page missing viewport meta tag',
          {}
        )
      );
    } else if (viewportContent) {
      // Check viewport configuration
      if (!viewportContent.includes('width=device-width')) {
        issues.push(
          createIssue(
            page.url,
            'incorrect-viewport',
            'warning',
            'Viewport should include width=device-width',
            { viewportContent }
          )
        );
      }
      if (!viewportContent.includes('initial-scale=1')) {
        issues.push(
          createIssue(
            page.url,
            'incorrect-viewport',
            'info',
            'Viewport should include initial-scale=1',
            { viewportContent }
          )
        );
      }
    }

    if (!hasTouchIcons && page.path === '/') {
      issues.push(
        createIssue(
          page.url,
          'missing-touch-icons',
          'info',
          'Homepage missing apple-touch-icon for mobile bookmarks',
          {}
        )
      );
    }
  }

  return createAgentResult('mobile-responsive', startTime, sampled.length, issues);
}

// CLI execution
if (require.main === module) {
  runMobileResponsiveChecker().then(result => {
    console.log(`\nMobile Responsive Checker Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
