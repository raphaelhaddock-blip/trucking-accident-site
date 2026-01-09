#!/usr/bin/env npx ts-node
/**
 * Site Audit Orchestrator
 *
 * Usage:
 *   npx ts-node scripts/run-audit.ts --all              # Run all 30 agents
 *   npx ts-node scripts/run-audit.ts --content          # Run 10 content agents
 *   npx ts-node scripts/run-audit.ts --technical        # Run 20 technical agents
 *   npx ts-node scripts/run-audit.ts --agent=thin       # Run single agent
 *   npx ts-node scripts/run-audit.ts --parallel=10      # Max concurrent agents
 */

import { program } from 'commander';
import pLimit from 'p-limit';
import { getAllPages, getPageSummary } from './lib/page-crawler';
import {
  AgentResult,
  AuditReport,
  aggregateResults,
  writeJsonReport,
  writeMarkdownReport,
  printConsoleSummary,
} from './lib/reporter';

// Import all agents
import { runThinContentDetector } from './content-audit/thin-content-detector';
import { runDuplicateChecker } from './content-audit/duplicate-checker';
import { runKeywordStuffingDetector } from './content-audit/keyword-stuffing';
import { runBrokenLinkChecker } from './content-audit/broken-links';
import { runSchemaValidator } from './content-audit/schema-validator';
import { runFaqQualityChecker } from './content-audit/faq-quality';
import { runMetaUniquenessChecker } from './content-audit/meta-uniqueness';
import { runContentFreshnessChecker } from './content-audit/content-freshness';
import { runLegalAccuracyChecker } from './content-audit/legal-accuracy';
import { runInternalLinkingAnalyzer } from './content-audit/internal-linking';

import { runLighthouseBatch } from './technical-audit/lighthouse-batch';
import { runMobileResponsiveChecker } from './technical-audit/mobile-responsive';
import { runCoreWebVitalsChecker } from './technical-audit/core-web-vitals';
import { runMetaTagsValidator } from './technical-audit/meta-tags';
import { runImageOptimizationChecker } from './technical-audit/image-optimization';
import { runCanonicalChecker } from './technical-audit/canonical-checker';
import { runRobotsSitemapValidator } from './technical-audit/robots-sitemap';
import { runHttpsMixedContentChecker } from './technical-audit/https-mixed-content';
import { runHtmlValidator } from './technical-audit/html-validation';
import { runAccessibilityChecker } from './technical-audit/accessibility-a11y';
import { runJavascriptErrorChecker } from './technical-audit/javascript-errors';
import { runFormValidationTester } from './technical-audit/form-validation';
import { runApiHealthChecker } from './technical-audit/api-health';
import { runRedirectChainChecker } from './technical-audit/redirect-chains';
import { runPageSpeedChecker } from './technical-audit/page-speed';
import { runStructuredDataValidator } from './technical-audit/structured-data';
import { runMobileUsabilityChecker } from './technical-audit/mobile-usability';
import { runSecurityHeadersChecker } from './technical-audit/security-headers';
import { runDeadCodeDetector } from './technical-audit/dead-code';
import { runBuildErrorChecker } from './technical-audit/build-errors';

// Agent definitions
interface AgentDef {
  name: string;
  type: 'content' | 'technical';
  run: () => Promise<AgentResult>;
}

const CONTENT_AGENTS: AgentDef[] = [
  { name: 'thin-content', type: 'content', run: runThinContentDetector },
  { name: 'duplicate-checker', type: 'content', run: runDuplicateChecker },
  { name: 'keyword-stuffing', type: 'content', run: runKeywordStuffingDetector },
  { name: 'broken-links', type: 'content', run: runBrokenLinkChecker },
  { name: 'schema-validator', type: 'content', run: runSchemaValidator },
  { name: 'faq-quality', type: 'content', run: runFaqQualityChecker },
  { name: 'meta-uniqueness', type: 'content', run: runMetaUniquenessChecker },
  { name: 'content-freshness', type: 'content', run: runContentFreshnessChecker },
  { name: 'legal-accuracy', type: 'content', run: runLegalAccuracyChecker },
  { name: 'internal-linking', type: 'content', run: runInternalLinkingAnalyzer },
];

const TECHNICAL_AGENTS: AgentDef[] = [
  { name: 'lighthouse-batch', type: 'technical', run: runLighthouseBatch },
  { name: 'mobile-responsive', type: 'technical', run: runMobileResponsiveChecker },
  { name: 'core-web-vitals', type: 'technical', run: runCoreWebVitalsChecker },
  { name: 'meta-tags', type: 'technical', run: runMetaTagsValidator },
  { name: 'image-optimization', type: 'technical', run: runImageOptimizationChecker },
  { name: 'canonical-checker', type: 'technical', run: runCanonicalChecker },
  { name: 'robots-sitemap', type: 'technical', run: runRobotsSitemapValidator },
  { name: 'https-mixed-content', type: 'technical', run: runHttpsMixedContentChecker },
  { name: 'html-validation', type: 'technical', run: runHtmlValidator },
  { name: 'accessibility-a11y', type: 'technical', run: runAccessibilityChecker },
  { name: 'javascript-errors', type: 'technical', run: runJavascriptErrorChecker },
  { name: 'form-validation', type: 'technical', run: runFormValidationTester },
  { name: 'api-health', type: 'technical', run: runApiHealthChecker },
  { name: 'redirect-chains', type: 'technical', run: runRedirectChainChecker },
  { name: 'page-speed', type: 'technical', run: runPageSpeedChecker },
  { name: 'structured-data', type: 'technical', run: runStructuredDataValidator },
  { name: 'mobile-usability', type: 'technical', run: runMobileUsabilityChecker },
  { name: 'security-headers', type: 'technical', run: runSecurityHeadersChecker },
  { name: 'dead-code', type: 'technical', run: runDeadCodeDetector },
  { name: 'build-errors', type: 'technical', run: runBuildErrorChecker },
];

const ALL_AGENTS = [...CONTENT_AGENTS, ...TECHNICAL_AGENTS];

async function runAgents(
  agents: AgentDef[],
  parallel: number
): Promise<AgentResult[]> {
  const limit = pLimit(parallel);
  const results: AgentResult[] = [];

  console.log(`\nRunning ${agents.length} agent(s) with parallelism ${parallel}...\n`);

  const tasks = agents.map(agent =>
    limit(async () => {
      console.log(`  ▶ Starting ${agent.name}...`);
      try {
        const result = await agent.run();
        const issueCount = result.issues.length;
        const status = issueCount === 0 ? '✅' : result.issues.some(i => i.severity === 'critical') ? '❌' : '⚠️';
        console.log(`  ${status} ${agent.name} complete (${issueCount} issues)`);
        return result;
      } catch (error) {
        console.log(`  ❌ ${agent.name} failed: ${error}`);
        return {
          agent: agent.name,
          startTime: new Date(),
          endTime: new Date(),
          pagesAudited: 0,
          issues: [],
          summary: `Agent failed: ${error}`,
        };
      }
    })
  );

  const completed = await Promise.all(tasks);
  results.push(...completed);

  return results;
}

async function main() {
  program
    .option('--all', 'Run all 30 agents')
    .option('--content', 'Run 10 content audit agents')
    .option('--technical', 'Run 20 technical audit agents')
    .option('--agent <name>', 'Run a single agent by name')
    .option('--parallel <number>', 'Max concurrent agents', '5')
    .option('--json-only', 'Output JSON only, no markdown')
    .option('--quiet', 'Suppress console output')
    .parse();

  const opts = program.opts();
  const parallel = parseInt(opts.parallel, 10);

  // Determine which agents to run
  let agentsToRun: AgentDef[] = [];

  if (opts.agent) {
    const agent = ALL_AGENTS.find(a => a.name === opts.agent);
    if (!agent) {
      console.error(`Unknown agent: ${opts.agent}`);
      console.error(`Available agents: ${ALL_AGENTS.map(a => a.name).join(', ')}`);
      process.exit(1);
    }
    agentsToRun = [agent];
  } else if (opts.content) {
    agentsToRun = CONTENT_AGENTS;
  } else if (opts.technical) {
    agentsToRun = TECHNICAL_AGENTS;
  } else if (opts.all) {
    agentsToRun = ALL_AGENTS;
  } else {
    // Default to all
    agentsToRun = ALL_AGENTS;
  }

  // Get page inventory
  const pages = getAllPages();
  const summary = getPageSummary();

  if (!opts.quiet) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    SITE AUDIT SYSTEM                       ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log(`  Total Pages:    ${summary.total}`);
    console.log(`  Static:         ${summary.static}`);
    console.log(`  Accidents:      ${summary.accident}`);
    console.log(`  States:         ${summary.state}`);
    console.log(`  Cities:         ${summary.city}`);
    console.log(`  Blog:           ${summary.blog}`);
    console.log('');
    console.log(`  Agents to Run:  ${agentsToRun.length}`);
    console.log(`  Parallelism:    ${parallel}`);
    console.log('');
  }

  const startTime = new Date();

  // Run agents
  const results = await runAgents(agentsToRun, parallel);

  // Aggregate results
  const report = aggregateResults(results, summary.total, startTime);

  // Write reports
  const jsonPath = writeJsonReport(report);
  if (!opts.quiet) {
    console.log(`\n  📄 JSON report: ${jsonPath}`);
  }

  if (!opts.jsonOnly) {
    const mdPath = writeMarkdownReport(report);
    if (!opts.quiet) {
      console.log(`  📄 Markdown report: ${mdPath}`);
    }
  }

  // Print summary
  if (!opts.quiet) {
    printConsoleSummary(report);
  }

  // Exit with appropriate code
  if (report.summary.critical > 0) {
    process.exit(2);
  } else if (report.summary.warnings > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Audit failed:', error);
  process.exit(1);
});
