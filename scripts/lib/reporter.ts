/**
 * Reporter Module - Generate JSON and Markdown audit reports
 */

import * as fs from 'fs';
import * as path from 'path';

export type Severity = 'critical' | 'warning' | 'info';

export interface AuditIssue {
  url: string;
  type: string;
  severity: Severity;
  message: string;
  details?: Record<string, unknown>;
}

export interface AgentResult {
  agent: string;
  startTime: Date;
  endTime: Date;
  pagesAudited: number;
  issues: AuditIssue[];
  summary: string;
}

export interface AuditReport {
  timestamp: string;
  duration: string;
  summary: {
    totalPages: number;
    pagesAudited: number;
    issuesFound: number;
    critical: number;
    warnings: number;
    info: number;
  };
  byAgent: Record<string, {
    issues: number;
    critical: number;
    warnings: number;
    duration: string;
    pages: string[];
  }>;
  issues: AuditIssue[];
}

/**
 * Calculate duration string from milliseconds
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Aggregate results from multiple agents into a single report
 */
export function aggregateResults(
  results: AgentResult[],
  totalPages: number,
  startTime: Date
): AuditReport {
  const endTime = new Date();
  const duration = formatDuration(endTime.getTime() - startTime.getTime());

  const allIssues: AuditIssue[] = [];
  const byAgent: AuditReport['byAgent'] = {};

  for (const result of results) {
    allIssues.push(...result.issues);

    const agentDuration = formatDuration(
      result.endTime.getTime() - result.startTime.getTime()
    );

    const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
    const warningCount = result.issues.filter(i => i.severity === 'warning').length;

    byAgent[result.agent] = {
      issues: result.issues.length,
      critical: criticalCount,
      warnings: warningCount,
      duration: agentDuration,
      pages: [...new Set(result.issues.map(i => i.url))],
    };
  }

  const pagesAudited = Math.max(...results.map(r => r.pagesAudited));

  return {
    timestamp: new Date().toISOString(),
    duration,
    summary: {
      totalPages,
      pagesAudited,
      issuesFound: allIssues.length,
      critical: allIssues.filter(i => i.severity === 'critical').length,
      warnings: allIssues.filter(i => i.severity === 'warning').length,
      info: allIssues.filter(i => i.severity === 'info').length,
    },
    byAgent,
    issues: allIssues,
  };
}

/**
 * Write report to JSON file
 */
export function writeJsonReport(report: AuditReport, outputPath?: string): string {
  const filePath = outputPath || path.join(process.cwd(), 'scripts', 'reports', 'audit-report.json');

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  return filePath;
}

/**
 * Generate markdown report from audit data
 */
export function generateMarkdownReport(report: AuditReport): string {
  const lines: string[] = [];

  // Header
  lines.push('# Site Audit Report');
  lines.push('');
  lines.push(`**Generated:** ${report.timestamp}`);
  lines.push(`**Duration:** ${report.duration}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Total Pages | ${report.summary.totalPages} |`);
  lines.push(`| Pages Audited | ${report.summary.pagesAudited} |`);
  lines.push(`| Issues Found | ${report.summary.issuesFound} |`);
  lines.push(`| Critical | ${report.summary.critical} |`);
  lines.push(`| Warnings | ${report.summary.warnings} |`);
  lines.push(`| Info | ${report.summary.info} |`);
  lines.push('');

  // Status
  if (report.summary.critical > 0) {
    lines.push('### Status: FAILED');
    lines.push('');
    lines.push(`Found ${report.summary.critical} critical issue(s) that need immediate attention.`);
  } else if (report.summary.warnings > 0) {
    lines.push('### Status: PASSED WITH WARNINGS');
    lines.push('');
    lines.push(`Found ${report.summary.warnings} warning(s) to review.`);
  } else {
    lines.push('### Status: PASSED');
    lines.push('');
    lines.push('No critical issues or warnings found.');
  }
  lines.push('');

  // By Agent
  lines.push('## Results by Agent');
  lines.push('');
  lines.push('| Agent | Issues | Critical | Warnings | Duration |');
  lines.push('|-------|--------|----------|----------|----------|');

  for (const [agent, data] of Object.entries(report.byAgent)) {
    const status = data.critical > 0 ? '❌' : data.warnings > 0 ? '⚠️' : '✅';
    lines.push(`| ${status} ${agent} | ${data.issues} | ${data.critical} | ${data.warnings} | ${data.duration} |`);
  }
  lines.push('');

  // Critical Issues
  const criticalIssues = report.issues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    lines.push('## Critical Issues');
    lines.push('');
    for (const issue of criticalIssues) {
      lines.push(`### ❌ ${issue.type}`);
      lines.push('');
      lines.push(`**URL:** ${issue.url}`);
      lines.push('');
      lines.push(`**Issue:** ${issue.message}`);
      lines.push('');
      if (issue.details) {
        lines.push('**Details:**');
        lines.push('```json');
        lines.push(JSON.stringify(issue.details, null, 2));
        lines.push('```');
        lines.push('');
      }
    }
  }

  // Warning Issues (first 20)
  const warningIssues = report.issues.filter(i => i.severity === 'warning');
  if (warningIssues.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    const displayWarnings = warningIssues.slice(0, 20);
    for (const issue of displayWarnings) {
      lines.push(`- **${issue.type}** - ${issue.url}`);
      lines.push(`  ${issue.message}`);
    }
    if (warningIssues.length > 20) {
      lines.push('');
      lines.push(`*...and ${warningIssues.length - 20} more warnings. See JSON report for full list.*`);
    }
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Generated by Site Audit System*');

  return lines.join('\n');
}

/**
 * Write markdown report to file
 */
export function writeMarkdownReport(report: AuditReport, outputPath?: string): string {
  const filePath = outputPath || path.join(process.cwd(), 'scripts', 'reports', 'audit-report.md');

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const markdown = generateMarkdownReport(report);
  fs.writeFileSync(filePath, markdown);
  return filePath;
}

/**
 * Print console summary with colors
 */
export function printConsoleSummary(report: AuditReport): void {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    AUDIT REPORT SUMMARY                    ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Duration:      ${report.duration}`);
  console.log(`  Pages Audited: ${report.summary.pagesAudited}/${report.summary.totalPages}`);
  console.log('');
  console.log('  Issues Found:');
  console.log(`    Critical: ${report.summary.critical}`);
  console.log(`    Warnings: ${report.summary.warnings}`);
  console.log(`    Info:     ${report.summary.info}`);
  console.log('');

  // Status
  if (report.summary.critical > 0) {
    console.log('  Status: ❌ FAILED');
  } else if (report.summary.warnings > 0) {
    console.log('  Status: ⚠️  PASSED WITH WARNINGS');
  } else {
    console.log('  Status: ✅ PASSED');
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n');
}

/**
 * Create an agent result object
 */
export function createAgentResult(
  agent: string,
  startTime: Date,
  pagesAudited: number,
  issues: AuditIssue[]
): AgentResult {
  return {
    agent,
    startTime,
    endTime: new Date(),
    pagesAudited,
    issues,
    summary: `${issues.length} issue(s) found`,
  };
}

/**
 * Create an audit issue
 */
export function createIssue(
  url: string,
  type: string,
  severity: Severity,
  message: string,
  details?: Record<string, unknown>
): AuditIssue {
  return { url, type, severity, message, details };
}
