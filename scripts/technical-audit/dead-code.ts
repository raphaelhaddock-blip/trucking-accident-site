/**
 * Agent 29: Dead Code Detector
 * Find unused CSS/JS (simplified checks)
 */

import { getAllPages } from '../lib/page-crawler';
import { createAgentResult, createIssue, AgentResult, AuditIssue } from '../lib/reporter';
import * as fs from 'fs';
import * as path from 'path';

async function findUnusedExports(): Promise<AuditIssue[]> {
  const issues: AuditIssue[] = [];
  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    return issues;
  }

  // Find all exported functions/components
  const exportedItems = new Map<string, string>(); // item -> file
  const importedItems = new Set<string>();

  function scanDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');

          // Find exports
          const exportMatches = content.matchAll(/export\s+(?:const|function|class|type|interface)\s+(\w+)/g);
          for (const match of exportMatches) {
            exportedItems.set(match[1], fullPath);
          }

          // Find named exports
          const namedExports = content.matchAll(/export\s+\{\s*([^}]+)\s*\}/g);
          for (const match of namedExports) {
            const items = match[1].split(',').map(s => s.trim().split(' ')[0]);
            for (const item of items) {
              if (item) exportedItems.set(item, fullPath);
            }
          }

          // Find imports
          const importMatches = content.matchAll(/import\s+\{([^}]+)\}\s+from/g);
          for (const match of importMatches) {
            const items = match[1].split(',').map(s => s.trim().split(' ')[0]);
            for (const item of items) {
              if (item) importedItems.add(item);
            }
          }

          // Find default imports
          const defaultImports = content.matchAll(/import\s+(\w+)\s+from/g);
          for (const match of defaultImports) {
            importedItems.add(match[1]);
          }

        } catch {
          // File read error
        }
      }
    }
  }

  try {
    scanDirectory(srcDir);

    // Find exports that are never imported
    for (const [item, file] of exportedItems) {
      // Skip common patterns that are used by Next.js
      if (['default', 'metadata', 'generateMetadata', 'generateStaticParams', 'revalidate'].includes(item)) {
        continue;
      }

      if (!importedItems.has(item)) {
        // Double-check: might be used via default export
        const relativePath = path.relative(process.cwd(), file);
        issues.push(createIssue(`file://${file}`, 'potentially-unused-export', 'info', `Export "${item}" may be unused (${relativePath})`, { item, file: relativePath }));
      }
    }
  } catch {
    // Error scanning
  }

  return issues;
}

export async function runDeadCodeDetector(): Promise<AgentResult> {
  const startTime = new Date();
  const issues: AuditIssue[] = [];

  console.log(`    Scanning for unused code...`);

  // Check for unused exports
  const unusedExportIssues = await findUnusedExports();

  // Limit to first 20 issues to avoid noise
  issues.push(...unusedExportIssues.slice(0, 20));

  if (unusedExportIssues.length > 20) {
    issues.push(createIssue('project', 'many-unused-exports', 'info', `Found ${unusedExportIssues.length} potentially unused exports (showing first 20)`, { total: unusedExportIssues.length }));
  }

  return createAgentResult('dead-code', startTime, 1, issues);
}

if (require.main === module) {
  runDeadCodeDetector().then(result => {
    console.log(`\nDead Code Detector Results:`);
    console.log(`  Issues found: ${result.issues.length}`);
  });
}
