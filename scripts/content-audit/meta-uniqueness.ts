/**
 * Agent 7: Meta Uniqueness Checker
 * Find duplicate meta titles/descriptions
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

interface MetaData {
  url: string;
  title: string;
  description: string;
}

async function extractMeta(url: string): Promise<MetaData | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    return { url, title, description };
  } catch {
    return null;
  }
}

export async function runMetaUniquenessChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  console.log(`    Extracting meta tags from ${pages.length} pages...`);

  // Extract all meta data
  const metaData: MetaData[] = [];

  // Process in batches
  const batchSize = 50;
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(p => extractMeta(p.url)));
    for (const result of results) {
      if (result) metaData.push(result);
    }
  }

  // Check for duplicates
  const titleToUrls = new Map<string, string[]>();
  const descToUrls = new Map<string, string[]>();

  for (const data of metaData) {
    // Track titles
    if (data.title) {
      const normalized = data.title.toLowerCase().trim();
      if (!titleToUrls.has(normalized)) {
        titleToUrls.set(normalized, []);
      }
      titleToUrls.get(normalized)!.push(data.url);
    }

    // Track descriptions
    if (data.description) {
      const normalized = data.description.toLowerCase().trim();
      if (!descToUrls.has(normalized)) {
        descToUrls.set(normalized, []);
      }
      descToUrls.get(normalized)!.push(data.url);
    }

    // Check title length
    if (data.title && data.title.length > 60) {
      issues.push(
        createIssue(
          data.url,
          'title-too-long',
          'warning',
          `Meta title is ${data.title.length} chars, should be under 60`,
          { title: data.title, length: data.title.length }
        )
      );
    }

    // Check description length
    if (data.description) {
      if (data.description.length < 120) {
        issues.push(
          createIssue(
            data.url,
            'description-too-short',
            'info',
            `Meta description is ${data.description.length} chars, recommend 120-160`,
            { description: data.description, length: data.description.length }
          )
        );
      } else if (data.description.length > 160) {
        issues.push(
          createIssue(
            data.url,
            'description-too-long',
            'info',
            `Meta description is ${data.description.length} chars, recommend 120-160`,
            { description: data.description, length: data.description.length }
          )
        );
      }
    }
  }

  // Report duplicate titles
  for (const [title, urls] of titleToUrls) {
    if (urls.length > 1) {
      issues.push(
        createIssue(
          urls[0],
          'duplicate-title',
          'critical',
          `Title duplicated across ${urls.length} pages: "${title.substring(0, 50)}..."`,
          { title, duplicateCount: urls.length, pages: urls }
        )
      );
    }
  }

  // Report duplicate descriptions
  for (const [desc, urls] of descToUrls) {
    if (urls.length > 1) {
      issues.push(
        createIssue(
          urls[0],
          'duplicate-description',
          'warning',
          `Description duplicated across ${urls.length} pages`,
          { description: desc.substring(0, 100), duplicateCount: urls.length, pages: urls }
        )
      );
    }
  }

  return createAgentResult('meta-uniqueness', startTime, metaData.length, issues);
}

// CLI execution
if (require.main === module) {
  runMetaUniquenessChecker().then(result => {
    console.log(`\nMeta Uniqueness Checker Results:`);
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
