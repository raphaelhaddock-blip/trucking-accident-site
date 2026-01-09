/**
 * Agent 5: Schema Validator
 * Validate JSON-LD structured data
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

interface SchemaValidation {
  type: string;
  valid: boolean;
  errors: string[];
}

function validateFAQPage(schema: Record<string, unknown>): SchemaValidation {
  const errors: string[] = [];

  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    errors.push('FAQPage missing mainEntity array');
  } else {
    const questions = schema.mainEntity as Array<Record<string, unknown>>;
    if (questions.length < 3) {
      errors.push(`FAQPage has only ${questions.length} questions, recommend 5+`);
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.name || typeof q.name !== 'string') {
        errors.push(`Question ${i + 1} missing name property`);
      }
      if (!q.acceptedAnswer || typeof (q.acceptedAnswer as Record<string, unknown>).text !== 'string') {
        errors.push(`Question ${i + 1} missing acceptedAnswer.text`);
      }
    }
  }

  return { type: 'FAQPage', valid: errors.length === 0, errors };
}

function validateLegalService(schema: Record<string, unknown>): SchemaValidation {
  const errors: string[] = [];

  if (!schema.name) errors.push('LegalService missing name');
  if (!schema.description) errors.push('LegalService missing description');
  if (!schema.areaServed) errors.push('LegalService missing areaServed');

  return { type: 'LegalService', valid: errors.length === 0, errors };
}

function validateArticle(schema: Record<string, unknown>): SchemaValidation {
  const errors: string[] = [];

  if (!schema.headline) errors.push('Article missing headline');
  if (!schema.author) errors.push('Article missing author');
  if (!schema.datePublished) errors.push('Article missing datePublished');
  if (!schema.dateModified) errors.push('Article missing dateModified');

  return { type: 'Article', valid: errors.length === 0, errors };
}

async function extractAndValidateSchemas(url: string): Promise<SchemaValidation[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const html = await response.text();
    const validations: SchemaValidation[] = [];

    // Extract JSON-LD scripts
    const schemaMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);

    for (const match of schemaMatches) {
      try {
        const data = JSON.parse(match[1]);
        const schemas = Array.isArray(data) ? data : [data];

        for (const schema of schemas) {
          const type = schema['@type'];
          if (type === 'FAQPage') {
            validations.push(validateFAQPage(schema));
          } else if (type === 'LegalService') {
            validations.push(validateLegalService(schema));
          } else if (type === 'Article') {
            validations.push(validateArticle(schema));
          }
        }
      } catch {
        validations.push({
          type: 'JSON-LD',
          valid: false,
          errors: ['Invalid JSON in schema script'],
        });
      }
    }

    // Check for missing expected schemas
    const hasTypes = validations.map(v => v.type);
    if (!hasTypes.includes('FAQPage') && !url.includes('/contact') && !url.includes('/privacy')) {
      validations.push({
        type: 'FAQPage',
        valid: false,
        errors: ['Missing FAQPage schema (recommended for SEO)'],
      });
    }

    return validations;
  } catch {
    return [];
  }
}

export async function runSchemaValidator(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Check all non-static pages
  const pagesToCheck = pages.filter(p =>
    p.type === 'accident' || p.type === 'state' || p.type === 'city' || p.type === 'blog'
  );

  // Sample for speed
  const sampled = [
    ...pagesToCheck.filter(p => p.type !== 'city'),
    ...pagesToCheck.filter(p => p.type === 'city').slice(0, 30),
  ];

  console.log(`    Validating schemas on ${sampled.length} pages...`);

  for (const page of sampled) {
    const validations = await extractAndValidateSchemas(page.url);

    for (const validation of validations) {
      if (!validation.valid) {
        for (const error of validation.errors) {
          const severity = error.includes('Invalid JSON') || error.includes('missing') ? 'warning' : 'info';
          issues.push(
            createIssue(
              page.url,
              'schema-error',
              severity,
              `${validation.type}: ${error}`,
              { schemaType: validation.type, error }
            )
          );
        }
      }
    }
  }

  return createAgentResult('schema-validator', startTime, sampled.length, issues);
}

// CLI execution
if (require.main === module) {
  runSchemaValidator().then(result => {
    console.log(`\nSchema Validator Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nSchema Issues:');
      for (const issue of result.issues.slice(0, 15)) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
    }
  });
}
