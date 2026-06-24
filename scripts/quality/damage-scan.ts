/**
 * damage-scan.ts
 *
 * Read-only forensic scan of city-content damage from the interrupted
 * "City Enhancement Agent v2.0.0" run.
 *
 * For every modified city content file (and any file whose committed HEAD
 * version is itself broken), it compares the working tree against HEAD:
 *   - placeholder marker present? (`[NEEDS ENHANCEMENT]`)
 *   - word count
 *   - a verdict that NEVER recommends overwriting good content with a stub
 *
 * Output: scripts/reports/damage-scan.json  (consumed by the damage report doc)
 *
 * This script does NOT modify, restore, or stage anything. It is a reporter.
 *
 * Run: npx tsx scripts/quality/damage-scan.ts
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const MARKER = '[NEEDS ENHANCEMENT]';
const CITY_GLOB = 'src/lib/cities-content';
const WORD_FLOOR = 2000; // CLAUDE.md city floor

type Verdict =
  | 'RESTORE_FROM_HEAD' // WT stubbed, HEAD has real content -> restore
  | 'REGEN'             // both WT and HEAD broken -> needs regeneration
  | 'KEEP_WT_FIX'       // WT fixed a committed-broken HEAD -> commit WT
  | 'KEEP_WT'           // WT enhanced/equal, neither broken -> keep, do nothing
  | 'REVIEW';           // WT shorter than HEAD but no stub -> human review

interface Row {
  file: string;
  wtExists: boolean;
  wtWords: number;
  wtMarker: boolean;
  headExists: boolean;
  headWords: number;
  headMarker: boolean;
  verdict: Verdict;
  note: string;
}

function sh(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

function wordCount(s: string): number {
  const m = s.trim().match(/\S+/g);
  return m ? m.length : 0;
}

// Union of: modified city .ts files + any city file broken at HEAD
const modified = sh(`git diff --name-only -- '${CITY_GLOB}/**/*.ts'`)
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

const brokenAtHead = sh(`git grep -l "NEEDS ENHANCEMENT" HEAD -- '${CITY_GLOB}/'`)
  .split('\n')
  .map((s) => s.replace(/^HEAD:/, '').trim())
  .filter(Boolean);

const files = Array.from(new Set([...modified, ...brokenAtHead])).sort();

const rows: Row[] = files.map((file) => {
  const wt = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const wtExists = wt.length > 0;
  const head = sh(`git show HEAD:${file}`);
  const headExists = head.length > 0;

  const wtMarker = wt.includes(MARKER);
  const headMarker = head.includes(MARKER);
  const wtWords = wordCount(wt);
  const headWords = wordCount(head);

  let verdict: Verdict;
  let note = '';
  if (wtMarker && !headMarker && headExists) {
    verdict = 'RESTORE_FROM_HEAD';
    note = `WT stubbed (${wtWords}w) but HEAD has real content (${headWords}w).`;
  } else if (wtMarker && headMarker) {
    verdict = 'REGEN';
    note = `Both WT (${wtWords}w) and HEAD (${headWords}w) are broken stubs.`;
  } else if (!wtMarker && headMarker) {
    verdict = 'KEEP_WT_FIX';
    note = `WT (${wtWords}w) repairs a committed-broken HEAD (${headWords}w stub). Commit WT to fix main.`;
  } else if (!wtMarker && !headMarker && wtWords >= headWords) {
    verdict = 'KEEP_WT';
    note = `WT (${wtWords}w) >= HEAD (${headWords}w), no stub. Genuine enhancement — do not restore.`;
  } else {
    verdict = 'REVIEW';
    note = `WT (${wtWords}w) shorter than HEAD (${headWords}w) but no stub. Inspect manually.`;
  }

  return { file, wtExists, wtWords, wtMarker, headExists, headWords, headMarker, verdict, note };
});

const byVerdict = rows.reduce<Record<string, Row[]>>((acc, r) => {
  (acc[r.verdict] ||= []).push(r);
  return acc;
}, {});

const summary = {
  scannedAt_note: 'timestamp omitted (deterministic output)',
  totalFilesScanned: rows.length,
  wtStubbed: rows.filter((r) => r.wtMarker).length,
  headBroken: rows.filter((r) => r.headMarker).length,
  belowWordFloor_wt: rows.filter((r) => r.wtWords < WORD_FLOOR).length,
  verdictCounts: Object.fromEntries(Object.entries(byVerdict).map(([k, v]) => [k, v.length])),
  wordFloor: WORD_FLOOR,
};

const outDir = join('scripts', 'reports');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const out = { summary, rows };
writeFileSync(join(outDir, 'damage-scan.json'), JSON.stringify(out, null, 2));

// Console summary
console.log('=== DAMAGE SCAN SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));
console.log('\n=== RESTORE_FROM_HEAD candidates (proposed, NOT executed) ===');
for (const r of byVerdict['RESTORE_FROM_HEAD'] ?? []) {
  console.log(`git checkout HEAD -- ${r.file}   # ${r.wtWords}w -> ${r.headWords}w`);
}
console.log('\n=== KEEP_WT_FIX (commit working tree to repair main) ===');
for (const r of byVerdict['KEEP_WT_FIX'] ?? []) console.log(`${r.file}  (${r.note})`);
console.log('\n=== REGEN (both broken — needs source-grounded regeneration) ===');
for (const r of byVerdict['REGEN'] ?? []) console.log(`${r.file}  (${r.note})`);
console.log('\n=== REVIEW ===');
for (const r of byVerdict['REVIEW'] ?? []) console.log(`${r.file}  (${r.note})`);
console.log(`\nKEEP_WT (enhanced, leave alone): ${(byVerdict['KEEP_WT'] ?? []).length} files`);
console.log('\nWrote scripts/reports/damage-scan.json');
