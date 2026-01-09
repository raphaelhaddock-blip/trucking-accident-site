/**
 * Agent 30: Build Error Checker
 * TypeScript/ESLint errors
 */

import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runBuildErrorChecker(): Promise<AgentResult> {
  const startTime = new Date();
  const issues: AuditIssue[] = [];

  console.log(`    Running build checks...`);

  // Run TypeScript type checking
  try {
    console.log(`      Checking TypeScript...`);
    await execAsync('npx tsc --noEmit', { timeout: 120000 });
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string };
    const output = err.stdout || err.stderr || '';

    // Parse TypeScript errors
    const errorLines = output.split('\n').filter(line => line.includes('error TS'));
    for (const line of errorLines.slice(0, 10)) {
      const match = line.match(/(.+)\((\d+),(\d+)\):\s*error\s*(TS\d+):\s*(.+)/);
      if (match) {
        issues.push(createIssue(`file://${match[1]}`, 'typescript-error', 'critical', `${match[4]}: ${match[5]} (line ${match[2]})`, { file: match[1], line: match[2], code: match[4] }));
      }
    }

    if (errorLines.length > 10) {
      issues.push(createIssue('typescript', 'many-ts-errors', 'critical', `TypeScript found ${errorLines.length} errors (showing first 10)`, { total: errorLines.length }));
    }

    if (errorLines.length === 0 && output.includes('error')) {
      issues.push(createIssue('typescript', 'typescript-failed', 'critical', 'TypeScript check failed', { output: output.substring(0, 500) }));
    }
  }

  // Run ESLint
  try {
    console.log(`      Checking ESLint...`);
    const { stdout } = await execAsync('npx eslint src --format json --max-warnings 100', { timeout: 120000 });

    const results = JSON.parse(stdout);
    let errorCount = 0;
    let warningCount = 0;

    for (const result of results) {
      for (const message of result.messages || []) {
        if (message.severity === 2) { // Error
          errorCount++;
          if (errorCount <= 10) {
            issues.push(createIssue(`file://${result.filePath}`, 'eslint-error', 'warning', `${message.ruleId}: ${message.message} (line ${message.line})`, { file: result.filePath, rule: message.ruleId, line: message.line }));
          }
        } else if (message.severity === 1) { // Warning
          warningCount++;
        }
      }
    }

    if (errorCount > 10) {
      issues.push(createIssue('eslint', 'many-eslint-errors', 'warning', `ESLint found ${errorCount} errors (showing first 10)`, { total: errorCount }));
    }

    if (warningCount > 50) {
      issues.push(createIssue('eslint', 'many-eslint-warnings', 'info', `ESLint found ${warningCount} warnings`, { total: warningCount }));
    }

  } catch (error) {
    const err = error as { stdout?: string; stderr?: string };
    // ESLint exits with error code if it finds issues
    if (err.stdout) {
      try {
        const results = JSON.parse(err.stdout);
        let errorCount = 0;

        for (const result of results) {
          for (const message of result.messages || []) {
            if (message.severity === 2) {
              errorCount++;
              if (errorCount <= 5) {
                issues.push(createIssue(`file://${result.filePath}`, 'eslint-error', 'warning', `${message.ruleId}: ${message.message}`, { rule: message.ruleId }));
              }
            }
          }
        }

        if (errorCount > 5) {
          issues.push(createIssue('eslint', 'many-eslint-errors', 'warning', `ESLint found ${errorCount} errors`, { total: errorCount }));
        }
      } catch {
        // Non-JSON output
      }
    }
  }

  // Test build (quick check)
  try {
    console.log(`      Testing build...`);
    await execAsync('npm run build 2>&1 | head -100', { timeout: 300000 });
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string };
    const output = err.stdout || err.stderr || '';

    if (output.includes('Build error') || output.includes('Error:')) {
      issues.push(createIssue('build', 'build-failed', 'critical', 'Build failed', { output: output.substring(0, 1000) }));
    }
  }

  return createAgentResult('build-errors', startTime, 3, issues);
}

if (require.main === module) {
  runBuildErrorChecker().then(result => {
    console.log(`\nBuild Error Results:`);
    console.log(`  Checks run: ${result.pagesAudited}`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
