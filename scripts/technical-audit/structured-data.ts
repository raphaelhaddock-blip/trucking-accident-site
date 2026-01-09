/**
 * Agent 26: Structured Data Validator
 * Rich results eligibility
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function validateStructuredData(url: string, pageType: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Extract all JSON-LD scripts
    const jsonLdMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    const schemas: Record<string, unknown>[] = [];

    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]);
        schemas.push(data);
      } catch {
        issues.push(createIssue(url, 'invalid-json-ld', 'warning', 'Invalid JSON in structured data', {}));
      }
    }

    const schemaTypes = schemas.map(s => s['@type']).filter(Boolean);

    // Check for expected schemas based on page type
    if (pageType === 'accident' || pageType === 'state' || pageType === 'city') {
      if (!schemaTypes.includes('FAQPage')) {
        issues.push(createIssue(url, 'missing-faq-schema', 'info', 'Page could benefit from FAQPage schema for rich results', {}));
      }
      if (!schemaTypes.includes('LegalService')) {
        issues.push(createIssue(url, 'missing-legal-service-schema', 'info', 'Page could benefit from LegalService schema', {}));
      }
    }

    if (pageType === 'blog') {
      if (!schemaTypes.includes('Article') && !schemaTypes.includes('BlogPosting')) {
        issues.push(createIssue(url, 'missing-article-schema', 'warning', 'Blog post should have Article schema', {}));
      }
    }

    // Validate FAQPage schema if present
    const faqSchema = schemas.find(s => s['@type'] === 'FAQPage');
    if (faqSchema) {
      const mainEntity = faqSchema.mainEntity as Array<Record<string, unknown>> | undefined;
      if (!mainEntity || !Array.isArray(mainEntity) || mainEntity.length === 0) {
        issues.push(createIssue(url, 'empty-faq-schema', 'warning', 'FAQPage schema has no questions', {}));
      } else if (mainEntity.length < 3) {
        issues.push(createIssue(url, 'few-faq-questions', 'info', `FAQPage has only ${mainEntity.length} questions (recommend 5+)`, {}));
      }
    }

    // Check for breadcrumb schema
    if (!schemaTypes.includes('BreadcrumbList') && pageType !== 'static') {
      issues.push(createIssue(url, 'missing-breadcrumb-schema', 'info', 'Page could benefit from BreadcrumbList schema', {}));
    }

    // Check for Organization schema on homepage
    if (url.endsWith('/') || url.endsWith('.app')) {
      if (!schemaTypes.includes('Organization') && !schemaTypes.includes('WebSite')) {
        issues.push(createIssue(url, 'missing-organization-schema', 'info', 'Homepage should have Organization or WebSite schema', {}));
      }
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runStructuredDataValidator(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static').slice(0, 3),
    ...pages.filter(p => p.type === 'accident').slice(0, 10),
    ...pages.filter(p => p.type === 'state').slice(0, 10),
    ...pages.filter(p => p.type === 'blog'),
    ...pages.filter(p => p.type === 'city').slice(0, 15),
  ];

  console.log(`    Validating structured data on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await validateStructuredData(page.url, page.type);
    allIssues.push(...issues);
  }

  return createAgentResult('structured-data', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runStructuredDataValidator().then(result => {
    console.log(`\nStructured Data Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
