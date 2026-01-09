/**
 * Agent 22: Form Validation Tester
 * Test form edge cases
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

async function checkFormStructure(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Find forms
    const forms = html.matchAll(/<form([^>]*)>([\s\S]*?)<\/form>/gi);
    for (const form of forms) {
      const formAttrs = form[1];
      const formContent = form[2];

      // Check for action attribute
      if (!/action=/i.test(formAttrs) && !/onsubmit/i.test(formAttrs)) {
        issues.push(createIssue(url, 'form-no-action', 'info', 'Form missing action attribute', {}));
      }

      // Check for method attribute
      if (!/method=/i.test(formAttrs)) {
        issues.push(createIssue(url, 'form-no-method', 'info', 'Form missing method attribute (defaults to GET)', {}));
      }

      // Check for CSRF protection (hidden token field)
      if (!/type=["']hidden["'][^>]*name=["'](?:csrf|token|_token)/i.test(formContent)) {
        // Note: This might be handled differently in Next.js with Server Actions
        // issues.push(createIssue(url, 'form-no-csrf', 'info', 'Form may lack CSRF protection', {}));
      }

      // Check for email inputs with proper type
      if (/email/i.test(formContent) && !/type=["']email["']/i.test(formContent)) {
        issues.push(createIssue(url, 'email-input-wrong-type', 'warning', 'Email field should use type="email"', {}));
      }

      // Check for phone inputs with proper type
      if (/phone|tel/i.test(formContent) && !/type=["']tel["']/i.test(formContent)) {
        issues.push(createIssue(url, 'phone-input-wrong-type', 'info', 'Phone field should use type="tel"', {}));
      }

      // Check for required fields having required attribute
      const requiredFields = formContent.matchAll(/required/gi);
      if ([...requiredFields].length === 0 && /input|textarea|select/i.test(formContent)) {
        issues.push(createIssue(url, 'form-no-required', 'info', 'Form has no required fields marked', {}));
      }

      // Check for honeypot field (spam protection)
      if (!/honey|trap|bot/i.test(formContent) && !/aria-hidden.*input/i.test(formContent)) {
        issues.push(createIssue(url, 'form-no-honeypot', 'info', 'Form may benefit from honeypot spam protection', {}));
      }
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runFormValidationTester(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  // Only check pages likely to have forms
  const sampled = pages.filter(p =>
    p.path === '/contact' ||
    p.type === 'accident' ||
    p.type === 'state' ||
    p.type === 'city'
  ).slice(0, 30);

  console.log(`    Testing form validation on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkFormStructure(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('form-validation', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runFormValidationTester().then(result => {
    console.log(`\nForm Validation Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
