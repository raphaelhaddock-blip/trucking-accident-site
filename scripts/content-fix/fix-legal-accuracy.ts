/**
 * Fix Agent 1: Legal Accuracy Fixer
 * Corrects statute of limitations and negligence rules in state files
 */

import * as fs from 'fs';
import * as path from 'path';

interface LegalFix {
  state: string;
  file: string;
  fixes: {
    type: 'sol' | 'negligence';
    field: string;
    oldValue: string;
    newValue: string;
    oldRegex: RegExp;
    newText: string;
  }[];
}

// Define the fixes needed based on verified legal data
const LEGAL_FIXES: LegalFix[] = [
  {
    state: 'Colorado',
    file: 'colorado.ts',
    fixes: [
      {
        type: 'sol',
        field: 'personalInjury',
        oldValue: '2 Years',
        newValue: '3 Years',
        oldRegex: /personalInjury: '2 Years'/g,
        newText: "personalInjury: '3 Years'"
      },
      {
        type: 'sol',
        field: 'heroText SOL reference',
        oldValue: 'two-year statute',
        newValue: 'three-year statute',
        oldRegex: /two-year statute of limitations/g,
        newText: 'three-year statute of limitations'
      },
      {
        type: 'sol',
        field: 'statuteOfLimitations.details',
        oldValue: 'two-year statute of limitations',
        newValue: 'three-year statute of limitations',
        oldRegex: /has a two-year statute of limitations for personal injury claims/g,
        newText: 'has a three-year statute of limitations for personal injury claims'
      },
      {
        type: 'sol',
        field: 'statuteOfLimitations.details',
        oldValue: 'within two years',
        newValue: 'within three years',
        oldRegex: /within two years of the accident date/g,
        newText: 'within three years of the accident date'
      },
      {
        type: 'sol',
        field: 'FAQ answer',
        oldValue: 'two-year',
        newValue: 'three-year',
        oldRegex: /Colorado has a two-year statute of limitations for personal injury/g,
        newText: 'Colorado has a three-year statute of limitations for personal injury'
      }
    ]
  },
  {
    state: 'Minnesota',
    file: 'minnesota.ts',
    fixes: [
      {
        type: 'sol',
        field: 'personalInjury',
        oldValue: '2 Years',
        newValue: '6 Years',
        oldRegex: /personalInjury: '2 Years'/g,
        newText: "personalInjury: '6 Years'"
      },
      {
        type: 'sol',
        field: 'heroText SOL reference',
        oldValue: 'two-year statute',
        newValue: 'six-year statute',
        oldRegex: /The state has a two-year statute of limitations for personal injury claims/g,
        newText: 'The state has a six-year statute of limitations for personal injury claims'
      },
      {
        type: 'sol',
        field: 'statuteOfLimitations.details',
        oldValue: 'two-year',
        newValue: 'six-year',
        oldRegex: /Minnesota has a two-year statute of limitations for personal injury claims arising from truck accidents under Minn\. Stat\. § 541\.07/g,
        newText: 'Minnesota has a six-year statute of limitations for personal injury claims arising from truck accidents under Minn. Stat. § 541.05'
      },
      {
        type: 'sol',
        field: 'statuteOfLimitations.details',
        oldValue: 'within two years',
        newValue: 'within six years',
        oldRegex: /within two years of the accident date/g,
        newText: 'within six years of the accident date'
      },
      {
        type: 'sol',
        field: 'FAQ answer',
        oldValue: 'two-year',
        newValue: 'six-year',
        oldRegex: /Minnesota has a two-year statute of limitations for personal injury/g,
        newText: 'Minnesota has a six-year statute of limitations for personal injury'
      }
    ]
  }
];

// Also need to fix the audit agent's reference data
const AUDIT_AGENT_FIX = {
  file: 'scripts/content-audit/legal-accuracy.ts',
  fixes: [
    {
      description: 'Fix Florida SOL from 4 to 2 (2023 tort reform)',
      oldRegex: /'florida': 4,/g,
      newText: "'florida': 2,"
    }
  ]
};

async function fixStateFile(fix: LegalFix): Promise<{ success: boolean; changes: number }> {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'states-content', fix.file);

  if (!fs.existsSync(filePath)) {
    console.log(`    ⚠️  File not found: ${filePath}`);
    return { success: false, changes: 0 };
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = 0;

  for (const fixItem of fix.fixes) {
    const matches = content.match(fixItem.oldRegex);
    if (matches && matches.length > 0) {
      content = content.replace(fixItem.oldRegex, fixItem.newText);
      changes += matches.length;
      console.log(`    ✓ Fixed ${fixItem.field}: "${fixItem.oldValue}" → "${fixItem.newValue}"`);
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`    💾 Saved ${fix.file} with ${changes} changes`);
  } else {
    console.log(`    ℹ️  No changes needed in ${fix.file}`);
  }

  return { success: true, changes };
}

async function fixAuditAgent(): Promise<{ success: boolean; changes: number }> {
  const filePath = path.join(process.cwd(), AUDIT_AGENT_FIX.file);

  if (!fs.existsSync(filePath)) {
    console.log(`    ⚠️  File not found: ${filePath}`);
    return { success: false, changes: 0 };
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = 0;

  for (const fix of AUDIT_AGENT_FIX.fixes) {
    const matches = content.match(fix.oldRegex);
    if (matches && matches.length > 0) {
      content = content.replace(fix.oldRegex, fix.newText);
      changes += matches.length;
      console.log(`    ✓ ${fix.description}`);
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`    💾 Saved legal-accuracy.ts with ${changes} changes`);
  }

  return { success: true, changes };
}

export async function runLegalAccuracyFixer(): Promise<{
  statesFixed: number;
  totalChanges: number;
  errors: string[];
}> {
  console.log('\n🔧 Legal Accuracy Fixer\n');
  console.log('=' .repeat(50));

  let statesFixed = 0;
  let totalChanges = 0;
  const errors: string[] = [];

  // Fix state files
  console.log('\n📄 Fixing State Content Files:\n');

  for (const fix of LEGAL_FIXES) {
    console.log(`  ${fix.state}:`);
    const result = await fixStateFile(fix);
    if (result.success && result.changes > 0) {
      statesFixed++;
      totalChanges += result.changes;
    } else if (!result.success) {
      errors.push(`Failed to fix ${fix.state}`);
    }
    console.log('');
  }

  // Fix audit agent reference
  console.log('📄 Fixing Audit Agent Reference Data:\n');
  const auditResult = await fixAuditAgent();
  if (auditResult.changes > 0) {
    totalChanges += auditResult.changes;
  }

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('\n📊 Summary:\n');
  console.log(`  States fixed: ${statesFixed}`);
  console.log(`  Total changes: ${totalChanges}`);
  if (errors.length > 0) {
    console.log(`  Errors: ${errors.length}`);
    for (const error of errors) {
      console.log(`    - ${error}`);
    }
  }
  console.log('\n✅ Legal accuracy fixes complete!\n');
  console.log('Next: Run "npm run audit" to verify the fixes.\n');

  return { statesFixed, totalChanges, errors };
}

// CLI execution
import { fileURLToPath } from 'url';

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  runLegalAccuracyFixer().catch(console.error);
}
