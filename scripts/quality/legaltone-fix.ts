/**
 * legaltone-fix.ts — deterministic, tone-only neutralization of legal-ADVICE phrasing in
 * rendered content. Replaces fixed banned substrings with neutral public-record/process
 * wording. Does NOT change any legal NUMBER or fact (SOL years, negligence rule values),
 * and NEVER touches the 21 preserved dirty files. Reviewable: the full map is below.
 *
 * Run: npx tsx scripts/quality/legaltone-fix.ts [--dry]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// 21 preserved dirty files (must stay byte-exact) — never edited here.
const PRESERVED = new Set(
  execSync(`git status --porcelain`, { encoding: 'utf8' })
    .split('\n').map((l) => l.slice(3).trim()).filter((p) => p.endsWith('.ts') && p.includes('cities-content'))
);

// Ordered longest-first so specific variants match before generic ones. Each pair is a
// PURE tone change — no legal number or fact is altered.
const MAP: Array<[string, string]> = [
  // --- "bars your claim forever" family (city SOL FAQ) ---
  ['Missing this deadline typically bars your claim forever, regardless of how serious your injuries are', 'These filing time limits depend on the type of claim and the facts'],
  ['Missing this deadline typically bars your claim forever, regardless of how severe your injuries are', 'These filing time limits depend on the type of claim and the facts'],
  ['Missing this deadline typically bars your claim forever, regardless of injury severity', 'These filing time limits depend on the type of claim and the facts'],
  ['Missing this deadline typically bars your claim forever', 'These filing time limits depend on the type of claim and the facts'],
  ['Missing this deadline bars your claim forever', 'These filing time limits depend on the type of claim and the facts'],
  ['Missing the deadline by even one day usually bars your claim', 'These time limits depend on the type of claim and the facts'],
  ['Missing this deadline means losing your right to compensation forever', 'These filing time limits depend on the type of claim and the facts'],
  ['Missing this deadline means losing your right to compensation', 'These filing time limits depend on the type of claim and the facts'],
  // --- state SOL "strictly enforced ... bars your claim forever" ---
  ['missing the deadline by even one day typically bars your claim forever, regardless of how serious your injuries are or how clear the trucking company', 'the exact time limit depends on the type of claim and the facts; a licensed attorney can confirm how it applies, regardless of the trucking company'],
  // --- state jurisdiction "Your case may be filed in" ---
  ['Your case may be filed in', 'A truck claim may be brought in'],
  // --- "must file your lawsuit / lose your right to sue" (state pages) ---
  ['a deadline by which you must file your lawsuit or lose your right to sue forever', 'a filing time limit that depends on the type of claim and the facts'],
  ['you must file your lawsuit within', 'the filing deadline generally falls within'],
  ['you must file a lawsuit within', 'the filing deadline generally falls within'],
  // --- "ensure your claim is filed on time" ---
  ['Contact a lawyer promptly to ensure your claim is filed on time', 'A licensed attorney can confirm the deadlines that apply'],
  ['to ensure your claim is filed on time', 'to confirm the deadlines that apply'],
  ['ensure your claim is filed on time', 'confirm the deadlines that apply'],
  // --- "best venue" (city legalInfo / state pages) ---
  ['can advise on the best venue for your case', 'can explain how the court process works'],
  ['advise on the best venue for your case', 'explain how the court process works'],
  ['the best venue for your case', 'how the court process works'],
  ['best venue', 'court process'],
  // --- contributory/comparative "completely barred" (state pages) ---
  ['If you are found even 1% at fault, you may be completely barred from recovery under the traditional rule', 'Some states limit or reduce recovery when the injured person shares fault, and how that applies depends on the facts and the state'],
  ['you may be completely barred from recovery', 'recovery may be limited or reduced depending on the facts and the state'],
  ['your recovery be completely barred', 'your recovery be limited or reduced'],
  ['may be completely barred', 'may be limited or reduced'],
  ['completely barred from recovery', 'limited or reduced in recovery'],
  // --- judges/juries (general) ---
  ['can be effectively presented and understood by judges and juries', 'can be presented clearly as the case develops'],
  ['presented and understood by judges and juries', 'presented clearly as the case develops'],
  ['by judges and juries', 'as the case develops'],
  ['judges and juries', 'the court process'],
  ['local judges', 'the local court process'],
  // --- mild scare softeners ---
  ['the stronger your case will be', 'the better the evidence is preserved'],
];

const DIRS = ['src/lib/cities-content', 'src/lib/states-content', 'src/lib/accidents-content', 'src/lib/blog-content', 'src/app/states'];

function listFiles(): string[] {
  return execSync(`find ${DIRS.join(' ')} -name '*.ts' -o -name '*.tsx'`, { encoding: 'utf8' })
    .split('\n').map((s) => s.trim()).filter(Boolean);
}

function main() {
  const dry = process.argv.includes('--dry');
  const perPhrase = new Map<string, number>();
  let filesChanged = 0, preservedSkipped = 0;
  for (const file of listFiles()) {
    if (PRESERVED.has(file)) { preservedSkipped++; continue; }
    let text = readFileSync(file, 'utf8');
    const before = text;
    for (const [bad, good] of MAP) {
      if (!text.includes(bad)) continue;
      const count = text.split(bad).length - 1;
      perPhrase.set(bad, (perPhrase.get(bad) ?? 0) + count);
      text = text.split(bad).join(good);
    }
    if (text !== before) { filesChanged++; if (!dry) writeFileSync(file, text); }
  }
  console.log(`=== LEGAL-TONE FIX ${dry ? '(dry run)' : ''} ===`);
  console.log(`files changed: ${filesChanged} | preserved skipped: ${preservedSkipped}`);
  console.log('replacements by phrase:');
  [...perPhrase.entries()].sort((a, b) => b[1] - a[1]).forEach(([p, n]) => console.log(`  ${String(n).padStart(5)}  "${p.slice(0, 56)}${p.length > 56 ? '…' : ''}"`));
}
main();
