/**
 * Agent 9: Legal Accuracy Checker
 * Verify legal claims are accurate
 */

import { getAllPages, PageInfo } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';

// Known statute of limitations by state (years)
const STATUTE_OF_LIMITATIONS: Record<string, number> = {
  'alabama': 2, 'alaska': 2, 'arizona': 2, 'arkansas': 3, 'california': 2,
  'colorado': 3, 'connecticut': 2, 'delaware': 2, 'florida': 2, 'georgia': 2,
  'hawaii': 2, 'idaho': 2, 'illinois': 2, 'indiana': 2, 'iowa': 2,
  'kansas': 2, 'kentucky': 1, 'louisiana': 1, 'maine': 6, 'maryland': 3,
  'massachusetts': 3, 'michigan': 3, 'minnesota': 6, 'mississippi': 3, 'missouri': 5,
  'montana': 3, 'nebraska': 4, 'nevada': 2, 'new-hampshire': 3, 'new-jersey': 2,
  'new-mexico': 3, 'new-york': 3, 'north-carolina': 3, 'north-dakota': 6, 'ohio': 2,
  'oklahoma': 2, 'oregon': 2, 'pennsylvania': 2, 'rhode-island': 3, 'south-carolina': 3,
  'south-dakota': 3, 'tennessee': 1, 'texas': 2, 'utah': 4, 'vermont': 3,
  'virginia': 2, 'washington': 3, 'west-virginia': 2, 'wisconsin': 3, 'wyoming': 4,
};

// Negligence rules by state
const NEGLIGENCE_RULES: Record<string, string> = {
  'alabama': 'contributory', 'alaska': 'pure-comparative', 'arizona': 'pure-comparative',
  'arkansas': 'modified-50', 'california': 'pure-comparative', 'colorado': 'modified-50',
  'connecticut': 'modified-51', 'delaware': 'modified-51', 'florida': 'modified-51',
  'georgia': 'modified-50', 'hawaii': 'modified-51', 'idaho': 'modified-50',
  'illinois': 'modified-51', 'indiana': 'modified-51', 'iowa': 'modified-51',
  'kansas': 'modified-50', 'kentucky': 'pure-comparative', 'louisiana': 'pure-comparative',
  'maine': 'modified-51', 'maryland': 'contributory', 'massachusetts': 'modified-51',
  'michigan': 'modified-51', 'minnesota': 'modified-51', 'mississippi': 'pure-comparative',
  'missouri': 'pure-comparative', 'montana': 'modified-51', 'nebraska': 'modified-50',
  'nevada': 'modified-51', 'new-hampshire': 'modified-51', 'new-jersey': 'modified-51',
  'new-mexico': 'pure-comparative', 'new-york': 'pure-comparative', 'north-carolina': 'contributory',
  'north-dakota': 'modified-50', 'ohio': 'modified-51', 'oklahoma': 'modified-51',
  'oregon': 'modified-51', 'pennsylvania': 'modified-51', 'rhode-island': 'pure-comparative',
  'south-carolina': 'modified-51', 'south-dakota': 'modified-51', 'tennessee': 'modified-50',
  'texas': 'modified-51', 'utah': 'modified-50', 'vermont': 'modified-51',
  'virginia': 'contributory', 'washington': 'pure-comparative', 'west-virginia': 'modified-51',
  'wisconsin': 'modified-51', 'wyoming': 'modified-51',
};

// Problematic legal claim patterns
const PROHIBITED_CLAIMS = [
  /guaranteed?\s*(settlement|recovery|outcome)/i,
  /we\s*(will|can)\s*win\s*your\s*case/i,
  /100%\s*success\s*rate/i,
  /no\s*win.*no\s*fee.*guarantee/i,
  /you\s*(will|are\s*entitled\s*to)\s*receive\s*\$[\d,]+/i,
];

async function checkLegalAccuracy(url: string, stateSlug?: string): Promise<{
  statuteClaimed: number | null;
  negligenceClaimed: string | null;
  prohibitedClaims: string[];
}> {
  try {
    const response = await fetch(url);
    if (!response.ok) return { statuteClaimed: null, negligenceClaimed: null, prohibitedClaims: [] };

    const html = await response.text();
    const text = html.replace(/<[^>]+>/g, ' ').toLowerCase();

    // Extract statute of limitations claims
    let statuteClaimed: number | null = null;
    const statuteMatch = text.match(/statute\s*of\s*limitations.*?(\d+)\s*years?/i);
    if (statuteMatch) {
      statuteClaimed = parseInt(statuteMatch[1]);
    }

    // Extract negligence rule claims
    let negligenceClaimed: string | null = null;
    if (text.includes('pure comparative')) negligenceClaimed = 'pure-comparative';
    else if (text.includes('modified comparative') || text.includes('51%') || text.includes('51 percent'))
      negligenceClaimed = 'modified-51';
    else if (text.includes('50%') || text.includes('50 percent')) negligenceClaimed = 'modified-50';
    else if (text.includes('contributory negligence')) negligenceClaimed = 'contributory';

    // Check for prohibited claims
    const prohibitedClaims: string[] = [];
    for (const pattern of PROHIBITED_CLAIMS) {
      const match = html.match(pattern);
      if (match) {
        prohibitedClaims.push(match[0]);
      }
    }

    return { statuteClaimed, negligenceClaimed, prohibitedClaims };
  } catch {
    return { statuteClaimed: null, negligenceClaimed: null, prohibitedClaims: [] };
  }
}

export async function runLegalAccuracyChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const pages = getAllPages();
  const issues: AuditIssue[] = [];

  // Check state pages primarily
  const statePages = pages.filter(p => p.type === 'state');

  console.log(`    Checking legal accuracy on ${statePages.length} state pages...`);

  for (const page of statePages) {
    const stateSlug = page.slug;
    const { statuteClaimed, negligenceClaimed, prohibitedClaims } = await checkLegalAccuracy(page.url, stateSlug);

    // Verify statute of limitations
    if (statuteClaimed !== null && STATUTE_OF_LIMITATIONS[stateSlug]) {
      const actual = STATUTE_OF_LIMITATIONS[stateSlug];
      if (statuteClaimed !== actual) {
        issues.push(
          createIssue(
            page.url,
            'incorrect-statute',
            'critical',
            `Statute of limitations claimed as ${statuteClaimed} years, but ${stateSlug} is ${actual} years`,
            { claimed: statuteClaimed, actual, state: stateSlug }
          )
        );
      }
    }

    // Verify negligence rule
    if (negligenceClaimed !== null && NEGLIGENCE_RULES[stateSlug]) {
      const actual = NEGLIGENCE_RULES[stateSlug];
      if (negligenceClaimed !== actual) {
        issues.push(
          createIssue(
            page.url,
            'incorrect-negligence-rule',
            'critical',
            `Negligence rule claimed as ${negligenceClaimed}, but ${stateSlug} uses ${actual}`,
            { claimed: negligenceClaimed, actual, state: stateSlug }
          )
        );
      }
    }

    // Check for prohibited claims
    for (const claim of prohibitedClaims) {
      issues.push(
        createIssue(
          page.url,
          'prohibited-legal-claim',
          'critical',
          `Contains potentially prohibited claim: "${claim}"`,
          { claim }
        )
      );
    }
  }

  // Also check accident pages for prohibited claims
  const accidentPages = pages.filter(p => p.type === 'accident');
  for (const page of accidentPages) {
    const { prohibitedClaims } = await checkLegalAccuracy(page.url);
    for (const claim of prohibitedClaims) {
      issues.push(
        createIssue(
          page.url,
          'prohibited-legal-claim',
          'critical',
          `Contains potentially prohibited claim: "${claim}"`,
          { claim }
        )
      );
    }
  }

  return createAgentResult('legal-accuracy', startTime, statePages.length + accidentPages.length, issues);
}

// CLI execution
if (require.main === module) {
  runLegalAccuracyChecker().then(result => {
    console.log(`\nLegal Accuracy Checker Results:`);
    console.log(`  Pages checked: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
    if (result.issues.length > 0) {
      console.log('\nLegal Issues:');
      for (const issue of result.issues) {
        console.log(`  - ${issue.severity.toUpperCase()}: ${issue.url}`);
        console.log(`    ${issue.message}`);
      }
    } else {
      console.log('\n  ✅ No legal accuracy issues found');
    }
  });
}
