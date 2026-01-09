/**
 * Agent 21: JavaScript Error Checker
 * Find runtime JS errors (simplified - checks for common patterns)
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function checkJavaScriptPatterns(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Check for common JS errors in inline scripts
    const inlineScripts = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of inlineScripts) {
      const script = match[1];

      // Check for console.log (shouldn't be in production)
      if (/console\.(log|debug|info)\(/i.test(script) && !/\/\/.*console/i.test(script)) {
        issues.push(createIssue(url, 'console-log-in-prod', 'info', 'console.log found in inline script', {}));
      }

      // Check for debugger statements
      if (/\bdebugger\b/i.test(script)) {
        issues.push(createIssue(url, 'debugger-statement', 'warning', 'debugger statement found in script', {}));
      }
    }

    // Check for failed script loads (404s)
    const externalScripts = html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi);
    for (const match of externalScripts) {
      const src = match[1];
      // Only check same-origin scripts
      if (src.startsWith('/') || src.includes('trucking-accident-site')) {
        try {
          const scriptUrl = src.startsWith('/')
            ? `https://trucking-accident-site.vercel.app${src}`
            : src;
          const scriptResponse = await fetch(scriptUrl, { method: 'HEAD' });
          if (!scriptResponse.ok) {
            issues.push(createIssue(url, 'failed-script-load', 'critical', `Script returns ${scriptResponse.status}: ${src}`, { src, status: scriptResponse.status }));
          }
        } catch {
          issues.push(createIssue(url, 'unreachable-script', 'warning', `Script unreachable: ${src}`, { src }));
        }
      }
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runJavascriptErrorChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static').slice(0, 5),
    ...pages.filter(p => p.type === 'accident').slice(0, 5),
    ...pages.filter(p => p.type === 'state').slice(0, 5),
    ...pages.filter(p => p.type === 'city').slice(0, 10),
  ];

  console.log(`    Checking JavaScript on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkJavaScriptPatterns(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('javascript-errors', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runJavascriptErrorChecker().then(result => {
    console.log(`\nJavaScript Error Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
