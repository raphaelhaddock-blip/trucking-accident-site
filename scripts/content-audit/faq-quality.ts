/**
 * Agent 6: FAQ Quality Checker
 * Ensure FAQs aren't thin/duplicated
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

interface FAQData {
  url: string;
  questions: Array<{ question: string; answerLength: number }>;
}

async function extractFAQs(url: string): Promise<FAQData> {
  try {
    const response = await fetch(url);
    if (!response.ok) return { url, questions: [] };

    const html = await response.text();
    const questions: Array<{ question: string; answerLength: number }> = [];

    // Extract from FAQPage schema
    const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?FAQPage[\s\S]*?)<\/script>/i);
    if (schemaMatch) {
      try {
        const schema = JSON.parse(schemaMatch[1]);
        if (schema.mainEntity && Array.isArray(schema.mainEntity)) {
          for (const q of schema.mainEntity) {
            if (q.name && q.acceptedAnswer?.text) {
              questions.push({
                question: q.name,
                answerLength: q.acceptedAnswer.text.length,
              });
            }
          }
        }
      } catch {
        // Invalid JSON
      }
    }

    // Fallback: extract from details/summary elements
    if (questions.length === 0) {
      const detailsMatches = html.matchAll(/<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi);
      for (const match of detailsMatches) {
        const question = match[1].replace(/<[^>]+>/g, '').trim();
        const answer = match[2].replace(/<[^>]+>/g, '').trim();
        if (question && answer) {
          questions.push({ question, answerLength: answer.length });
        }
      }
    }

    return { url, questions };
  } catch {
    return { url, questions: [] };
  }
}

export async function runFaqQualityChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Check pages that should have FAQs
  const pagesToCheck = pages.filter(p =>
    p.type === 'accident' || p.type === 'state' || p.type === 'city' || p.type === 'blog'
  );

  // Sample for speed
  const sampled = [
    ...pagesToCheck.filter(p => p.type !== 'city'),
    ...pagesToCheck.filter(p => p.type === 'city').slice(0, 50),
  ];

  console.log(`    Checking FAQ quality on ${sampled.length} pages...`);

  const allFAQData: FAQData[] = [];

  for (const page of sampled) {
    const faqData = await extractFAQs(page.url);
    allFAQData.push(faqData);

    // Check FAQ count
    if (faqData.questions.length < 5) {
      issues.push(
        createIssue(
          page.url,
          'insufficient-faqs',
          'warning',
          `Page has only ${faqData.questions.length} FAQs, minimum 5 recommended`,
          { faqCount: faqData.questions.length }
        )
      );
    }

    // Check answer length
    for (const q of faqData.questions) {
      if (q.answerLength < 50) {
        issues.push(
          createIssue(
            page.url,
            'thin-faq-answer',
            'warning',
            `FAQ answer too short (${q.answerLength} chars): "${q.question.substring(0, 50)}..."`,
            { question: q.question, answerLength: q.answerLength }
          )
        );
      }
    }

    // Check if questions end with ?
    for (const q of faqData.questions) {
      if (!q.question.trim().endsWith('?')) {
        issues.push(
          createIssue(
            page.url,
            'faq-formatting',
            'info',
            `FAQ question doesn't end with ?: "${q.question.substring(0, 50)}..."`,
            { question: q.question }
          )
        );
      }
    }
  }

  // Check for duplicate questions across pages
  const questionToUrls = new Map<string, string[]>();
  for (const data of allFAQData) {
    for (const q of data.questions) {
      const normalized = q.question.toLowerCase().trim();
      if (!questionToUrls.has(normalized)) {
        questionToUrls.set(normalized, []);
      }
      questionToUrls.get(normalized)!.push(data.url);
    }
  }

  for (const [question, urls] of questionToUrls) {
    if (urls.length > 3) {
      issues.push(
        createIssue(
          urls[0],
          'duplicate-faq',
          'warning',
          `FAQ question duplicated across ${urls.length} pages: "${question.substring(0, 50)}..."`,
          { question, duplicateCount: urls.length, pages: urls.slice(0, 5) }
        )
      );
    }
  }

  return createAgentResult('faq-quality', startTime, sampled.length, issues);
}

// CLI execution
if (require.main === module) {
  runFaqQualityChecker().then(result => {
    console.log(`\nFAQ Quality Checker Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nIssues:');
      for (const issue of result.issues.slice(0, 15)) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.message}`);
      }
    }
  });
}
