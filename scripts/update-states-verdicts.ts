import * as fs from 'fs';
import * as path from 'path';

const statesDir = path.join(__dirname, '../src/lib/states-content');

// Get all state files (excluding types.ts and index.ts)
const stateFiles = fs.readdirSync(statesDir)
  .filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');

console.log(`Found ${stateFiles.length} state files to update`);

const today = new Date().toISOString().split('T')[0]; // "2026-01-08"

let updated = 0;
let errors = 0;

for (const file of stateFiles) {
  const filePath = path.join(statesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if file has notableVerdicts
  if (!content.includes('notableVerdicts')) {
    console.log(`Skipping ${file} - no notableVerdicts found`);
    continue;
  }

  // Remove the notableVerdicts array (multiline pattern)
  // Pattern: notableVerdicts: [ ... ],
  const verdictPattern = /\n\s*notableVerdicts:\s*\[\s*[\s\S]*?\n\s*\],?\n/g;

  if (verdictPattern.test(content)) {
    content = content.replace(verdictPattern, '\n');
  } else {
    // Try alternative pattern for single-line or different formatting
    const altPattern = /notableVerdicts:\s*\[[\s\S]*?\],?\n/g;
    content = content.replace(altPattern, '');
  }

  // Add lastUpdated after courtInfo
  if (!content.includes('lastUpdated')) {
    content = content.replace(
      /courtInfo:\s*`[^`]*`,?\n/,
      (match) => match + `\n  lastUpdated: '${today}',\n`
    );
  }

  // Write back
  try {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated ${file}`);
    updated++;
  } catch (err) {
    console.error(`✗ Error updating ${file}:`, err);
    errors++;
  }
}

console.log(`\nDone: ${updated} files updated, ${errors} errors`);
