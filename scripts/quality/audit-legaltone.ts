/**
 * audit-legaltone.ts — CI gate. Fails (exit 1) if banned legal-ADVICE or court/jury/venue
 * PERSUASION phrasing appears in rendered content source OR in the built published surface
 * (HTML/RSC/JSON-LD under .next).
 *
 * Allowlisted: the preserved dirty files (cannot be edited this branch), one PR13-flagged
 * city FAQ (pennsylvania/philadelphia — pervasive jury-sympathy/venue-strategy prose whose
 * neutralization needs legal judgment, deferred to Fable/Raphy), docs/ (packets quote the
 * phrases), and the tone scripts themselves (they list the phrases by design).
 *
 * Banned = ADVICE/scare wording ("losing your right") AND court/jury/venue PERSUASION
 * ("judges who will hear your case", "juries evaluate", "jury pools", "judicial tendencies",
 * "local fact-finders", "choosing the right venue"). NOT neutral process terms like "statute
 * of limitations", "deadline", or naming a state's "court system".
 *
 * Run: npx tsx scripts/quality/audit-legaltone.ts   (npm run audit:legaltone)
 */
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Fixed-string bans (matched literally, case-insensitive).
const BANNED_FIXED = [
  'bars your claim', 'losing your right', 'lose your right to sue', 'hard cutoff',
  'must file your lawsuit', 'must file a lawsuit', 'your case may be filed', 'your case will be filed',
  'best venue', 'judges and juries', 'local judges', 'jury tendenc', 'jury tendencies',
  'ensure your claim is filed', 'ends the case no matter', 'would ordinarily be filed',
  'venue typically falls', 'right to compensation forever', 'completely barred', 'stronger your case will be',
];

// Regex bans (ERE, case-insensitive) — court/jury/venue persuasion incl. singular/plural/possessive.
const BANNED_REGEX = [
  'judges? who will hear (your|the) case',
  'juries evaluate',
  'jury pools?',
  'judicial tendenc(y|ies)',
  'local fact-?finders?',
  'local juries?',
  'what evidence resonates',
  'choosing the right venue',
];

// Allowlist: preserved files (HARD-CODED — must not derive from git status, which would
// balloon as other files get edited), one PR13-deferred city FAQ, plus docs/ and the tone
// scripts (which quote the phrases by design). Preserved enhancements are held uncommitted on
// this branch and may still contain old phrasing — out of scope until separately addressed.
const PRESERVED = new Set([
  'arizona/tucson', 'california/san-francisco', 'colorado/denver', 'indiana/indianapolis',
  'kentucky/louisville', 'massachusetts/boston', 'michigan/detroit', 'nevada/las-vegas',
  'new-mexico/albuquerque', 'new-york/brookhaven', 'new-york/buffalo', 'new-york/islip',
  'new-york/oyster-bay', 'north-carolina/charlotte', 'oregon/portland', 'tennessee/memphis',
  'tennessee/nashville', 'texas/el-paso', 'washington/seattle',
].map((c) => `src/lib/cities-content/${c}.ts`));
// PR13: city FAQ answers built on predicting local jury sympathy / verdict tendencies. These
// are pervasive (woven through whole answers), not single-clause swaps — neutralizing them
// needs legal judgment on permissible attorney-advertising claims, deferred to Fable/Raphy.
const PR13_DEFERRED = new Set([
  'src/lib/cities-content/pennsylvania/philadelphia.ts',
  'src/lib/cities-content/texas/houston.ts',
  'src/lib/cities-content/texas/austin.ts',
]);
const ALLOW_PREFIX = ['docs/', 'scripts/quality/legaltone-fix.ts', 'scripts/quality/audit-legaltone.ts'];

// Built artifacts of an allowlisted city source share its route slug. A source
// src/lib/cities-content/<state>/<city>.ts compiles to .next/...states/<state>/<city>.{html,rsc,…},
// so derive a built-path needle "states/<state>/<city>" for every allowlisted city to exclude
// its rendered output too (the source allowlist matches src/ paths only).
const BUILT_NEEDLES = [...PRESERVED, ...PR13_DEFERRED]
  .map((p) => p.replace(/^src\/lib\/cities-content\//, 'states/').replace(/\.ts$/, ''));
const allowed = (path: string) => {
  if (PRESERVED.has(path) || PR13_DEFERRED.has(path)) return true;
  if (ALLOW_PREFIX.some((a) => path.startsWith(a))) return true;
  if (path.startsWith('.next/')) return BUILT_NEEDLES.some((n) => path.includes(n));
  return false;
};
const preserved = PRESERVED;

// ERE-escape a fixed phrase so it can be alternated into one combined regex.
const ereEscape = (s: string) => s.replace(/[.[\]()*+?^$|{}\\]/g, '\\$&');
// One combined case-insensitive ERE over all bans — keeps the scan to a SINGLE grep spawn
// per root set (per-spawn sandbox cost is ~1s, so 28 greps would stall the gate for ~30s).
const COMBINED = [...BANNED_FIXED.map(ereEscape), ...BANNED_REGEX].join('|');

function scan(_label: string, roots: string) {
  const offenders = new Map<string, string[]>(); // file -> matched snippets
  // Pass 1 — fast file list (-l stops at first match per file; cheap even over the 1600-page .next).
  let files: string[] = [];
  try {
    files = execSync(`grep -rIlEi ${JSON.stringify(COMBINED)} ${roots} 2>/dev/null || true`, { encoding: 'utf8' })
      .split('\n').map((s) => s.trim()).filter(Boolean);
  } catch { files = []; }
  for (const file of files) {
    if (allowed(file)) continue;
    // Pass 2 — label matched snippets, but ONLY for real (non-allowlisted) offenders, so the
    // expensive -o scan never touches the full tree when the surface is clean.
    let matches: string[] = [];
    try {
      matches = execSync(`grep -IohEi ${JSON.stringify(COMBINED)} ${JSON.stringify(file)} 2>/dev/null || true`, { encoding: 'utf8' })
        .split('\n').map((s) => s.trim().toLowerCase()).filter(Boolean);
    } catch { matches = []; }
    offenders.set(file, [...new Set(matches)]);
  }
  return offenders;
}

function main() {
  const SRC_ROOTS = 'src/lib/cities-content src/lib/states-content src/lib/accidents-content src/lib/blog-content src/app';
  const srcOff = scan('source', SRC_ROOTS);
  const builtOff = existsSync('.next/server/app') ? scan('built', '.next/server/app') : new Map();

  console.log('=== LEGAL-TONE AUDIT ===');
  console.log(`banned: ${BANNED_FIXED.length} fixed + ${BANNED_REGEX.length} regex | allowlisted preserved: ${preserved.size} | PR13-deferred: ${PR13_DEFERRED.size}`);
  console.log(`source offenders: ${srcOff.size} files | built offenders: ${builtOff.size} files`);
  const dump = (label: string, off: Map<string, string[]>) => {
    if (!off.size) { console.log(`  ${label}: clean ✓`); return; }
    console.log(`  ${label} FAILURES:`);
    [...off.entries()].slice(0, 40).forEach(([f, ps]) => console.log(`    ${f}  ←  ${[...new Set(ps)].join(', ')}`));
    if (off.size > 40) console.log(`    …and ${off.size - 40} more`);
  };
  dump('source', srcOff);
  dump('built', builtOff);

  if (srcOff.size || builtOff.size) {
    console.log('\nFAIL — banned legal-advice / court-jury-venue persuasion present in published surface.');
    process.exitCode = 1;
  } else {
    console.log('\nPASS — no banned phrasing in source or built output (excl. preserved/docs/PR13).');
  }
}
main();
