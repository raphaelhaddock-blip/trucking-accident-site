/**
 * audit-legaltone.ts — CI gate. Fails (exit 1) if banned legal-ADVICE or court/jury/venue
 * PERSUASION phrasing appears in rendered content source OR in the built published surface
 * (HTML/RSC under .next/server/app).
 *
 * Implementation note (PR11C): the scan is Node-native (fs read + RegExp), NOT shelling out to
 * grep. Two reasons. (1) Speed: the interactive shell's `grep` is a `ugrep` function, but
 * execSync's /bin/sh resolves to BSD grep 2.6, which takes ~35s to recurse the 18k-file .next
 * tree (~110s end-to-end) — over the CI budget. Reading the 1.7k .html + .rsc files and testing
 * one combined RegExp does the same work in ~1s. (2) Correctness: the PR11 gate was a silent
 * no-op because it called execSync without importing it and a try/catch swallowed the throw, so
 * it reported "clean" while checking nothing. A pure fs+RegExp scan removes the subprocess
 * entirely; any unreadable directory throws and fails the gate CLOSED (exit 2), never "clean".
 *
 * Allowlisted: the preserved dirty files (held uncommitted on this branch — reported as
 * preserved-only deployment blockers, NOT counted clean), docs/ (packets quote the phrases),
 * and the tone scripts themselves (they list the phrases by design).
 *
 * Banned = ADVICE/scare wording ("losing your right") AND court/jury/venue PERSUASION
 * ("judges who will hear your case", "juries evaluate", "jury pools", "judicial tendencies",
 * "local fact-finders", "choosing the right venue"). NOT neutral process terms like "statute
 * of limitations", "deadline", or naming a state's "court system".
 *
 * Run: npx tsx scripts/quality/audit-legaltone.ts   (npm run audit:legaltone)
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Fixed-string bans (matched literally, case-insensitive).
const BANNED_FIXED = [
  'bars your claim', 'losing your right', 'lose your right to sue', 'hard cutoff',
  'must file your lawsuit', 'must file a lawsuit', 'your case may be filed', 'your case will be filed',
  'best venue', 'judges and juries', 'local judges', 'jury tendenc', 'jury tendencies',
  'ensure your claim is filed', 'ends the case no matter', 'would ordinarily be filed',
  'venue typically falls', 'right to compensation forever', 'completely barred', 'stronger your case will be',
];

// Regex bans (case-insensitive) — court/jury/venue persuasion incl. singular/plural/possessive.
const BANNED_REGEX = [
  'judges? who will hear (your|the) case',
  'juries evaluate',
  'jury pools?',
  'judicial tendenc(y|ies)',
  'local fact-?finders?',
  'local juries?',
  'what evidence resonates',
  'choosing the right venue',
  // PR11D — jury-verdict / damage-award PREDICTION (claims about how a county's juries decide or
  // what they award). NOT factual statements like "jury verdicts are public record".
  'county juries',                       // "Harris County juries", "Dallas County juries"
  'county jury (verdict|award|pool)',    // "New York County jury verdicts"
  'juries (understand|are (generally |usually )?familiar|have awarded)', // "juries understand…", "juries have awarded"
  'historically award',                  // "juries historically award(ing)"
  '(jury )?verdict trends?',             // "jury verdict trends", "verdict trends"
  'reputation for [a-z ]{0,30}verdicts?',// "reputation for significant verdicts"
  'substantial (jury )?awards?',         // "substantial jury awards", "substantial awards"
  'significant verdicts?',               // "significant verdicts"
  'awarded (millions|substantial)',      // "have awarded millions/substantial"
  'damage awards exceed',                // "damage awards exceeding the average"
];

// Allowlist: preserved files (HARD-CODED — must not derive from git status, which would
// balloon as other files get edited), plus docs/ and the tone scripts (which quote the phrases
// by design). Preserved enhancements are held uncommitted on this branch and may still contain
// old phrasing — reported separately as preserved-only blockers, never counted clean.
const PRESERVED = new Set([
  'arizona/tucson', 'california/san-francisco', 'colorado/denver', 'indiana/indianapolis',
  'kentucky/louisville', 'massachusetts/boston', 'michigan/detroit', 'nevada/las-vegas',
  'new-mexico/albuquerque', 'new-york/brookhaven', 'new-york/buffalo', 'new-york/islip',
  'new-york/oyster-bay', 'north-carolina/charlotte', 'oregon/portland', 'tennessee/memphis',
  'tennessee/nashville', 'texas/el-paso', 'washington/seattle',
].map((c) => `src/lib/cities-content/${c}.ts`));
const ALLOW_PREFIX = ['docs/', 'scripts/quality/legaltone-fix.ts', 'scripts/quality/audit-legaltone.ts'];

// Built artifacts of a preserved city source share its route slug. A source
// src/lib/cities-content/<state>/<city>.ts compiles to .next/...states/<state>/<city>.{html,rsc},
// so derive a built-path needle "states/<state>/<city>" to recognise its rendered output too.
const BUILT_NEEDLES = [...PRESERVED].map((p) =>
  p.replace(/^src\/lib\/cities-content\//, 'states/').replace(/\.ts$/, ''),
);
const isPreservedBuilt = (path: string) =>
  path.startsWith('.next/') && BUILT_NEEDLES.some((n) => path.includes(n));
const allowedSource = (path: string) =>
  PRESERVED.has(path) || ALLOW_PREFIX.some((a) => path.startsWith(a));

// One combined case-insensitive RegExp over all bans. Fixed phrases are regex-escaped first.
const escape = (s: string) => s.replace(/[.[\]()*+?^$|{}\\]/g, '\\$&');
const COMBINED = new RegExp([...BANNED_FIXED.map(escape), ...BANNED_REGEX].join('|'), 'gi');

// Recursively list files with one of the given extensions. Throws on an unreadable dir so the
// gate fails CLOSED rather than silently reporting a clean surface (the original no-op bug).
function listFiles(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p, exts));
    else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

// file -> sorted unique matched snippets, for every non-allowlisted offender.
function scan(roots: string[], exts: string[], allow: (p: string) => boolean) {
  const offenders = new Map<string, string[]>();
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const file of listFiles(root, exts)) {
      if (allow(file)) continue;
      const matches = readFileSync(file, 'utf8').match(COMBINED);
      if (matches) offenders.set(file, [...new Set(matches.map((m) => m.toLowerCase()))].sort());
    }
  }
  return offenders;
}

function main() {
  const SRC_ROOTS = [
    'src/lib/cities-content', 'src/lib/states-content', 'src/lib/accidents-content',
    'src/lib/blog-content', 'src/app',
  ];
  let srcOff: Map<string, string[]>;
  let builtOff: Map<string, string[]>;
  let preservedBuilt: Map<string, string[]>;
  try {
    srcOff = scan(SRC_ROOTS, ['.ts', '.tsx'], allowedSource);
    // Built: separate genuine committed-route offenders from preserved-dirty render artifacts.
    const allBuilt = existsSync('.next/server/app')
      ? scan(['.next/server/app'], ['.html', '.rsc'], () => false)
      : new Map<string, string[]>();
    builtOff = new Map([...allBuilt].filter(([f]) => !isPreservedBuilt(f)));
    preservedBuilt = new Map([...allBuilt].filter(([f]) => isPreservedBuilt(f)));
  } catch (e) {
    console.error(`\nERROR — legal-tone scan could not complete; failing closed.\n${e}`);
    process.exitCode = 2;
    return;
  }

  // Preserved-dirty source offenders, reported separately (not counted clean, not a build fail).
  // String.match with a /g/ regex ignores lastIndex, so no stateful-regex footgun here.
  const preservedSrc = [...PRESERVED].filter(
    (f) => existsSync(f) && readFileSync(f, 'utf8').match(COMBINED) !== null,
  );

  console.log('=== LEGAL-TONE AUDIT ===');
  console.log(`banned: ${BANNED_FIXED.length} fixed + ${BANNED_REGEX.length} regex | preserved allowlist: ${PRESERVED.size}`);
  console.log(`committed source offenders: ${srcOff.size} files | committed built offenders: ${builtOff.size} files`);
  const dump = (label: string, off: Map<string, string[]>) => {
    if (!off.size) { console.log(`  ${label}: clean ✓`); return; }
    console.log(`  ${label} FAILURES:`);
    [...off.entries()].slice(0, 40).forEach(([f, ps]) => console.log(`    ${f}  ←  ${ps.join(', ')}`));
    if (off.size > 40) console.log(`    …and ${off.size - 40} more`);
  };
  dump('committed source', srcOff);
  dump('committed built', builtOff);

  if (preservedSrc.length || preservedBuilt.size) {
    console.log(`\n  PRESERVED-DIRTY (uncommitted, NOT counted clean — deployment blockers for PR13+):`);
    preservedSrc.forEach((f) => console.log(`    ${f}`));
    if (preservedBuilt.size) console.log(`    + ${preservedBuilt.size} rendered artifact(s) from the above`);
  }

  if (srcOff.size || builtOff.size) {
    console.log('\nFAIL — banned legal-advice / court-jury-venue persuasion present in committed surface.');
    process.exitCode = 1;
  } else {
    console.log('\nPASS — no banned phrasing in committed source or built output (excl. preserved-dirty/docs).');
  }
}
main();
