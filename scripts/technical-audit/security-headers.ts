/**
 * Agent 28: Security Headers Checker
 * Verify security headers
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const SECURITY_HEADERS = [
  { name: 'Strict-Transport-Security', severity: 'warning' as const, description: 'HSTS header for HTTPS enforcement' },
  { name: 'X-Content-Type-Options', severity: 'info' as const, description: 'Prevents MIME sniffing' },
  { name: 'X-Frame-Options', severity: 'info' as const, description: 'Clickjacking protection' },
  { name: 'Content-Security-Policy', severity: 'info' as const, description: 'CSP for XSS protection' },
  { name: 'Referrer-Policy', severity: 'info' as const, description: 'Controls referrer information' },
  { name: 'Permissions-Policy', severity: 'info' as const, description: 'Controls browser features' },
];

async function checkSecurityHeaders(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);

    for (const header of SECURITY_HEADERS) {
      const value = response.headers.get(header.name);
      if (!value) {
        issues.push(createIssue(url, `missing-${header.name.toLowerCase()}`, header.severity, `Missing ${header.name} header (${header.description})`, {}));
      }
    }

    // Check for X-Powered-By (should be hidden)
    if (response.headers.get('X-Powered-By')) {
      issues.push(createIssue(url, 'x-powered-by-exposed', 'info', 'X-Powered-By header exposes server technology', { value: response.headers.get('X-Powered-By') }));
    }

    // Check HSTS configuration if present
    const hsts = response.headers.get('Strict-Transport-Security');
    if (hsts) {
      if (!hsts.includes('max-age')) {
        issues.push(createIssue(url, 'hsts-no-max-age', 'warning', 'HSTS header missing max-age directive', { hsts }));
      } else {
        const maxAgeMatch = hsts.match(/max-age=(\d+)/);
        if (maxAgeMatch && parseInt(maxAgeMatch[1]) < 31536000) {
          issues.push(createIssue(url, 'hsts-short-max-age', 'info', 'HSTS max-age is less than 1 year (31536000)', { hsts }));
        }
      }
    }

    // Check CSP configuration if present
    const csp = response.headers.get('Content-Security-Policy');
    if (csp) {
      if (csp.includes("'unsafe-inline'")) {
        issues.push(createIssue(url, 'csp-unsafe-inline', 'info', "CSP allows 'unsafe-inline' (reduces XSS protection)", {}));
      }
      if (csp.includes("'unsafe-eval'")) {
        issues.push(createIssue(url, 'csp-unsafe-eval', 'info', "CSP allows 'unsafe-eval' (reduces XSS protection)", {}));
      }
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runSecurityHeadersChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  // Only need to check a few pages - headers should be consistent
  const sampled = [
    pages.find(p => p.path === '/')!,
    pages.find(p => p.type === 'accident')!,
    pages.find(p => p.type === 'state')!,
  ].filter(Boolean);

  console.log(`    Checking security headers on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkSecurityHeaders(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('security-headers', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runSecurityHeadersChecker().then(result => {
    console.log(`\nSecurity Headers Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
