/**
 * audit-legaltone.ts — CI gate. Fails (exit 1) if banned legal-ADVICE phrasing appears in
 * rendered content source OR in the built published surface (HTML/RSC/JSON-LD under .next).
 *
 * Allowlisted: the 21 preserved dirty files (cannot be edited this branch), docs/ (packets
 * quote the phrases), and the tone scripts themselves (they list the phrases by design).
 *
 * Banned phrases are ADVICE/scare wording — NOT neutral terms like "statute of limitations"
 * or "deadline", which are fine in process context.
 *
 * Run: npx tsx scripts/quality/audit-legaltone.ts   (npm run audit:legaltone)
 */
import { existsSync } from 'node:fs';

const BANNED = [
  'bars your claim', 'losing your right', 'lose your right to sue', 'hard cutoff',
  'must file your lawsuit', 'must file a lawsuit', 'your case may be filed', 'your case will be filed',
  'best venue', 'judges and juries', 'local judges', 'jury tendenc', 'jury tendencies',
  'ensure your claim is filed', 'ends the case no matter', 'would ordinarily be filed',
  'venue typically falls', 'right to compensation forever', 'completely barred', 'stronger your case will be',
];

// Allowlist: the 21 preserved files (HARD-CODED — must not derive from git status, which
// would balloon as other files get edited), plus docs/ and the tone scripts (which quote
// the phrases by design). These preserved enhancements are held uncommitted on this branch
// and may still contain old phrasing — they are out of scope until separately addressed.
const PRESERVED = new Set([
  'arizona/tucson', 'california/san-francisco', 'colorado/denver', 'indiana/indianapolis',
  'kentucky/louisville', 'massachusetts/boston', 'michigan/detroit', 'nevada/las-vegas',
  'new-mexico/albuquerque', 'new-york/brookhaven', 'new-york/buffalo', 'new-york/islip',
  'new-york/oyster-bay', 'north-carolina/charlotte', 'oregon/portland', 'tennessee/memphis',
  'tennessee/nashville', 'texas/el-paso', 'washington/seattle',
].map((c) => `src/lib/cities-content/${c}.ts`));
const ALLOW_PREFIX = ['docs/', 'scripts/quality/legaltone-fix.ts', 'scripts/quality/audit-legaltone.ts'];
const allowed = (path: string) => PRESERVED.has(path) || ALLOW_PREFIX.some((a) => path.startsWith(a));
const preserved = PRESERVED;

function grepFiles(roots: string, banned: string): string[] {
  // -I skip binary; -l list files; -F fixed string; case-insensitive
  try {
    return execSync(`grep -rIliF ${JSON.stringify(banned)} ${roots} 2>/dev/null || true`, { encoding: 'utf8' })
      .split('\n').map((s) => s.trim()).filter(Boolean);
  } catch { return []; }
}

function scan(label: string, roots: string) {
  const offenders = new Map<string, string[]>(); // file -> phrases
  for (const phrase of BANNED) {
    for (const file of grepFiles(roots, phrase)) {
      if (allowed(file)) continue;
      (offenders.get(file) ?? offenders.set(file, []).get(file)!).push(phrase);
    }
  }
  return offenders;
}

function main() {
  const SRC_ROOTS = 'src/lib/cities-content src/lib/states-content src/lib/accidents-content src/lib/blog-content src/app';
  const srcOff = scan('source', SRC_ROOTS);
  const builtOff = existsSync('.next/server/app') ? scan('built', '.next/server/app') : new Map();

  console.log('=== LEGAL-TONE AUDIT ===');
  console.log(`banned phrases: ${BANNED.length} | allowlisted preserved files: ${preserved.size}`);
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
    console.log('\nFAIL — banned legal-advice phrasing present in published surface.');
    process.exitCode = 1;
  } else {
    console.log('\nPASS — no banned legal-advice phrasing in source or built output (excl. preserved/docs).');
  }
}
main();
