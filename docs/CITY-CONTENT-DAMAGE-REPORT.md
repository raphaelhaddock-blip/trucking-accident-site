# City Content Damage Report

Date: 2026-06-24
Scope: forensic, read-only. Nothing was restored, staged, committed, or reverted.
Source of truth: `scripts/reports/damage-scan.json` (regenerate with `npx tsx scripts/quality/damage-scan.ts`).

## What happened

An interrupted "City Enhancement Agent v2.0.0" run left the working tree in a **mixed** state. It did not uniformly damage files — it stubbed some, improved others, and even repaired two files that were already broken in `main`. A blanket `git checkout` either way would have destroyed real work. This report classifies every affected file so the restore is surgical.

## Summary (verified)

| Verdict | Count | Meaning | Action |
|---|---|---|---|
| `RESTORE_FROM_HEAD` | **30** | WT is a `[NEEDS ENHANCEMENT]` stub (~416–464w); HEAD holds the real prior content (~1,947–2,317w) | Restore from HEAD — pending your approval |
| `KEEP_WT` | **19** | WT was genuinely enhanced (longer than HEAD, no stub) | Leave alone. Do **not** restore |
| `KEEP_WT_FIX` | **2** | WT repairs a file that is **committed broken on `main`** | Commit WT to fix `main` |
| `REVIEW` | **1** | WT shorter than HEAD but not a stub | Human eyeball before deciding |
| `REGEN` | **0** | Broken in both WT and HEAD (unrecoverable from git) | None — nothing is unrecoverable |
| **Total scanned** | **52** | | |

Two independent facts worth stating plainly:
- **No content is unrecoverable.** Every stub has a good HEAD version, and the two committed-broken files are already fixed in the working tree.
- **Restoring fixes the *stub* problem, not the *duplication* problem.** The 30 restored pages are the ~2,000-word templated clones that fail the duplication gate (see `CONTENT-QUALITY-AND-REPAIR-PLAN.md`). Restore stops the bleeding; it does not make these pages good.

## 1. RESTORE_FROM_HEAD — proposed restore list (30 files, NOT executed)

Each line recovers real content over a placeholder stub. Risk per file: **LOW** — the only thing discarded is the `[NEEDS ENHANCEMENT]` stub, which holds no real content, and the action is reversible (the stubs remain in reflog and can be regenerated later if you ever want a v2 rewrite).

```bash
git checkout HEAD -- src/lib/cities-content/alaska/anchorage.ts            # 416w -> 1947w
git checkout HEAD -- src/lib/cities-content/arizona/mesa.ts               # 416w -> 2037w
git checkout HEAD -- src/lib/cities-content/california/anaheim.ts         # 416w -> 2166w
git checkout HEAD -- src/lib/cities-content/california/bakersfield.ts     # 416w -> 2166w
git checkout HEAD -- src/lib/cities-content/california/fresno.ts          # 432w -> 2124w
git checkout HEAD -- src/lib/cities-content/california/long-beach.ts      # 447w -> 2094w
git checkout HEAD -- src/lib/cities-content/california/oakland.ts         # 416w -> 2167w
git checkout HEAD -- src/lib/cities-content/california/riverside.ts       # 416w -> 2166w
git checkout HEAD -- src/lib/cities-content/california/sacramento.ts      # 432w -> 2184w
git checkout HEAD -- src/lib/cities-content/california/stockton.ts        # 420w -> 2177w
git checkout HEAD -- src/lib/cities-content/colorado/aurora.ts            # 416w -> 2038w
git checkout HEAD -- src/lib/cities-content/colorado/colorado-springs.ts  # 447w -> 2095w
git checkout HEAD -- src/lib/cities-content/florida/miami.ts              # 432w -> 2231w
git checkout HEAD -- src/lib/cities-content/florida/tampa.ts              # 432w -> 2231w
git checkout HEAD -- src/lib/cities-content/georgia/atlanta.ts            # 432w -> 2242w
git checkout HEAD -- src/lib/cities-content/hawaii/honolulu.ts            # 416w -> 1948w
git checkout HEAD -- src/lib/cities-content/kansas/wichita.ts             # 416w -> 2145w
git checkout HEAD -- src/lib/cities-content/louisiana/new-orleans.ts      # 460w -> 2098w
git checkout HEAD -- src/lib/cities-content/minnesota/minneapolis.ts      # 432w -> 2254w
git checkout HEAD -- src/lib/cities-content/missouri/st-louis.ts          # 464w -> 2317w
git checkout HEAD -- src/lib/cities-content/new-jersey/newark.ts          # 424w -> 2200w
git checkout HEAD -- src/lib/cities-content/north-carolina/raleigh.ts     # 424w -> 2178w
git checkout HEAD -- src/lib/cities-content/ohio/cincinnati.ts            # 432w -> 2255w
git checkout HEAD -- src/lib/cities-content/ohio/cleveland.ts             # 432w -> 2255w
git checkout HEAD -- src/lib/cities-content/oklahoma/oklahoma-city.ts     # 460w -> 2301w
git checkout HEAD -- src/lib/cities-content/oklahoma/tulsa.ts             # 416w -> 2043w
git checkout HEAD -- src/lib/cities-content/pennsylvania/pittsburgh.ts    # 432w -> 2138w
git checkout HEAD -- src/lib/cities-content/texas/corpus-christi.ts       # 443w -> 2144w
git checkout HEAD -- src/lib/cities-content/virginia/virginia-beach.ts    # 447w -> 2224w
git checkout HEAD -- src/lib/cities-content/wisconsin/milwaukee.ts        # 432w -> 2224w
```

## 2. KEEP_WT_FIX — commit the working tree to repair `main` (2 files)

These two are the only city files **committed broken on `main`** (they were the Jan "failed enhancement" pair noted in `docs/CONTENT_INVENTORY.md`). The working tree already fixes both. The action here is the opposite of a restore — **commit** the WT version; do not `git checkout` these.

- `src/lib/cities-content/california/san-jose.ts` — HEAD 464w stub → WT 4,359w (fixed)
- `src/lib/cities-content/texas/san-antonio.ts` — HEAD 460w stub → WT 5,018w (fixed)

## 3. KEEP_WT — genuine enhancements, do not touch (19 files)

These are longer than HEAD and carry no stub. Restoring any of them would **delete real work**. They are the v2.0.0 run's successes:

`arizona/tucson` · `california/san-francisco` · `colorado/denver` · `indiana/indianapolis` · `kentucky/louisville` · `massachusetts/boston` · `michigan/detroit` · `nevada/las-vegas` · `new-mexico/albuquerque` · `new-york/brookhaven` · `new-york/buffalo` · `new-york/islip` · `new-york/oyster-bay` · `north-carolina/charlotte` · `oregon/portland` · `tennessee/memphis` · `tennessee/nashville` · `texas/el-paso` · `washington/seattle`

(Caveat: "enhanced" here means *longer and not a stub*. Several still fail the duplication gate — length is not differentiation. See the quality report.)

## 4. REVIEW — manual decision (1 file)

- `src/lib/cities-content/new-york/new-york.ts` — WT 3,756w vs HEAD 4,360w, no stub either side. The working tree is **shorter** than HEAD but not broken. Could be an intentional trim or a partial overwrite. Eyeball a diff before deciding; default is to keep whichever reads better, not auto-restore.

## Restore decision needed

Per your instruction, nothing is restored until you approve the **exact file list**. The proposed list is the 30 `RESTORE_FROM_HEAD` files in §1. The 2 fixes (§2) and 19 enhancements (§3) must be preserved, not restored.

Approve with: "restore the 30" (or name exclusions). The fix-commit for §2 and the §4 review can ride along or be handled separately.
