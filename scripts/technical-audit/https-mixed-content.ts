/**
 * Agent 18: HTTPS/Mixed Content Checker
 * Find insecure resources
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

async function checkMixedContent(url: string): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];

  try {
    const response = await fetch(url);
    if (!response.ok) return issues;

    const html = await response.text();

    // Check for http:// resources
    const httpResources = html.matchAll(/(?:src|href)=["'](http:\/\/[^"']+)["']/gi);
    for (const match of httpResources) {
      const resource = match[1];
      // Ignore localhost and development URLs
      if (!resource.includes('localhost') && !resource.includes('127.0.0.1')) {
        issues.push(createIssue(url, 'mixed-content', 'warning', `Insecure resource loaded over HTTP: ${resource.substring(0, 80)}`, { resource }));
      }
    }

    // Check for protocol-relative URLs (//example.com)
    const protocolRelative = html.matchAll(/(?:src|href)=["'](\/\/[^"']+)["']/gi);
    for (const match of protocolRelative) {
      issues.push(createIssue(url, 'protocol-relative', 'info', `Protocol-relative URL found: ${match[1].substring(0, 80)}`, { resource: match[1] }));
    }

  } catch {
    // Network error
  }

  return issues;
}

export async function runHttpsMixedContentChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const allIssues: AuditIssue[] = [];

  const sampled = [
    ...pages.filter(p => p.type === 'static'),
    ...pages.filter(p => p.type === 'accident').slice(0, 10),
    ...pages.filter(p => p.type === 'state').slice(0, 10),
    ...pages.filter(p => p.type === 'city').slice(0, 20),
  ];

  console.log(`    Checking for mixed content on ${sampled.length} pages...`);

  for (const page of sampled) {
    const issues = await checkMixedContent(page.url);
    allIssues.push(...issues);
  }

  return createAgentResult('https-mixed-content', startTime, sampled.length, allIssues);
}

if (require.main === module) {
  runHttpsMixedContentChecker().then(result => {
    console.log(`\nHTTPS/Mixed Content Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
