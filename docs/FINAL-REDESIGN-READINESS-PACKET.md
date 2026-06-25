# Final Redesign Readiness Packet — National Truck Accident Response

**For:** human review before any deploy. **This is not a deploy.** Nothing here pushes, deploys, or changes Vercel.
**Date:** 2026-06-25
**Branch:** `redesign/next-gen-legal-platform` (worktree `/Users/raphyhaddock/trucking-redesign`)
**Verified live this session** (git/ls/build/audit at HEAD), not from memory.

> **The live trucking site is still the original/pre-redesign code.** This redesign is local-only and has never been deployed (the worktree has no `.vercel` link).

---

## 1. Branch and commit range
- Branch: `redesign/next-gen-legal-platform`
- Base (fork point, exclusive): `883727d` (PR12 Growth OS packet, on the prior line)
- HEAD: `6585a71`
- Working tree: clean.
- Range under review: `883727d..6585a71` — 14 commits.

## 2. Redesign commits, PR1 → P4 Tier B (oldest first)
| Commit | What |
|---|---|
| `1473c56` | PR1 — next-gen "National Truck Accident Response" redesign (first pass) |
| `8a1cc5c` | PR2 — brand OG raster, mobile/conversion polish, favicon |
| `f1935be` | PR3 — local pro-image system (auto-wired by slug) + index hubs + mobile excerpt |
| `d368f4a` | PR4 — fal.ai Flux Pro generator (port) + extension-agnostic resolver |
| `7bc3f9f` | PR4B — 6 Flux Pro hero images generated + wired, overlay tuned |
| `6ea1e09` | Growth OS taxonomy+ontology standard + PR5 image-expansion plan (docs) |
| `a1c2557` | PR5A — 19 accident-header images (all 20 types covered) |
| `2e1517b` | PR5B (P3a) — 9 priority-state hero images |
| `7c8792f` | P4 city-hub image plan (plan only, no spend) |
| `fff62dd` | Trucking handoff doc (Vercel/domain map, safe target, gates) |
| `2647a29` | P4 plan — final approval-ready (2 tiers, exact prompts, gates) |
| `d30076a` | Prep fix — explicit `CITY_SCENE` map + `--dry-run` (no generation) |
| `99dea6b` | P4 Tier A — 5 distinct city-hub heroes (generated, wired, QA-passed) |
| `6585a71` | P4 Tier B — 5 skyline city-hub heroes (generated, wired); city image system complete |

## 3. What changed — visual + structural

**Visual**
- **Type system:** dropped Geist (the Next.js-starter tell). Newsreader (editorial serif, headers), Inter (body/UI, tabular figures), IBM Plex Mono (eyebrows/stat units).
- **Color language:** command-center semantic tokens — `ink` (blue-black), `steel` (cool neutrals), warm `paper` surfaces, `accent` amber CTA, `signal` hazard orange-red. Removed the OS dark-mode flip that would have broken the warm-paper design.
- **Brand kit** (`/public/brand/`): hand-built SVG logo/lockup/favicon, freight-network + records-grid + road-texture + section-divider motifs, and a raster `og-default.png`. Replaces the old Sanity stock look.
- **Components:** new `Logo`, `MobileStickyCTA`, a single stroked `Icon` set (killed all emoji + ~8 copy-pasted SVGs), `Section`, `Stat`, and `CommandHero` (cinematic dark hero replacing the Sanity stock hero).
- **Pages restyled:** header, footer, sticky mobile CTA, homepage, contact, case-evaluation form (behavior preserved), and the state / city / accident templates.

**Structural**
- **Local pro-image system:** `src/lib/brand-images.ts` resolves a hero + OG image by slug, extension-agnostic, with a safe fallback chain (`city-{state}-{city}` → `state-{state}` → `hero-interstate`); visible heroes never fall back to Sanity.
- **Image pipeline:** `scripts/generate-brand-images.ts` (fal Flux Pro v1.1) writes local files; a prebuild step (`gen-image-manifest.ts`) wires them into `src/lib/brand-images.generated.ts`.
- **P4 prep fix:** explicit `CITY_SCENE` map (no slug parsing for approved cities; fixes the `new-york-new-york-city` mangling) + a `--dry-run` mode that prints prompts without calling fal.
- **SEO preserved:** every route, schema block (LegalService/FAQPage/BreadcrumbList), canonical, sitemap entry, and content field is intact. Zero `cdn.sanity.io` in the rendered/hero/OG path.

## 4. Image inventory (`public/brand/photo/`)
All generated with the same compliance negative (no people/faces/wreckage/text/plates/logos/legal clichés).

- **Global / core (3):** `hero-interstate`, `network-corridor`, `evidence-records`.
- **Accident headers (20):** all 20 accident types (`accident-header-*`).
- **Priority state heroes (10):** california, florida, georgia, illinois, indiana, north-carolina, ohio, pennsylvania, tennessee, texas.
- **City hubs (11):** houston (PR4B); Tier A — phoenix, salt-lake-city, miami, los-angeles, kansas-city; Tier B — dallas, chicago, atlanta, new-york-city, philadelphia.
- **Brand SVG/OG kit (9, `public/brand/`):** logo-mark, logo-lockup, favicon, interstate-network, records-grid, road-texture, section-divider (SVG) + og-default.png + README.

**Held / skipped (by design):**
- **P3b — ~40 remaining state heroes:** HELD. Premium but too similar to each other; not worth the look-alike risk.
- **City long tail (~1,600 cities):** intentionally NOT imaged — each falls back cleanly to its state image, then the global hero. No UX gap.
- **Protected/dirty-content cities excluded:** Seattle, Denver, Detroit (visually ideal) and others stay parked until their content files are cleaned.
- **City image system is COMPLETE.** Dallas & Atlanta already double the aerial-interchange-with-skyline look, so no further skyline cities. Add a one-off only if a specific high-value page later needs it.

## 5. Verification summary
| Check | Result | Evidence |
|---|---|---|
| Build (`npm run build`) | ✅ PASS at `6585a71` | Full route tree, 1613 city pages SSG; tree unchanged since |
| `audit:legaltone` | ✅ PASS (re-run this session) | "no banned phrasing in committed source or built output" |
| Hero wiring | ✅ verified | Built HTML `<img src="/brand/photo/city-…jpg">` for Phoenix, Miami, NYC, Chicago |
| OG wiring | ✅ verified | Built HTML absolute `og:image` for the same 4 city pages |
| Image compliance QA | ✅ PASS, 0 rejected | Each of the 10 P4 images inspected directly — see `after-p4-tierA/QA-NOTES.md`, `after-p4-tierB/QA-NOTES.md` |
| Multi-word slug fix | ✅ verified end-to-end | NYC page resolves `city-new-york-new-york-city.jpg` (no "York New York City") |

**Known limitation — no page screenshots.** Browser screenshots of the *new local* images would require running a local server (forbidden by the repo `vercel-only` rule) or a deploy (not allowed). playwright + ImageMagick are not installed. Substituted: direct image inspection + per-tier `contact-sheet.html` + built-HTML hero/OG proof. **A human still needs to eyeball the rendered pages on a preview deploy before production.**

## 6. Deployment mapping
| | Value |
|---|---|
| **Correct deploy target** | Vercel project **`trucking-accident-site`** (projectId `prj_PDI3oqSvw0EGLzGeaZblClnNweoa`) — the only valid trucking target |
| **Public URL** | `https://trucking-accident-site.vercel.app` (currently serves the **original** site) |
| **⚠️ Wrong / misnamed** | **`trucking-accident-site-814t`** — name looks like trucking but it **serves NY Construction** ("NY Construction Advocate", verified HTTP 200 this session). **Never deploy trucking here** — it would clobber NY Construction. |
| **Live vs local** | Live = original/pre-redesign. Redesign = local-only, never deployed (no `.vercel` link in the worktree). |

## 7. Remaining blockers before deploy
0. **Real phone number (ACTIVE BLOCKER, 2026-06-25)** — preview uses placeholder `1-800-555-0123` in 14 file-level consts + 26 display lines across 17 files. Needs Raphy's real intake number before production; fix is a 2-string replace (see [PREVIEW-QA-2026-06-25.md](PREVIEW-QA-2026-06-25.md)). No number will be invented.
1. **Human visual review** — ✅ desktop done on the preview 2026-06-25 (7 pages clean, 0 broken images, 0 overflow). Mobile *pixel* pass still owed (blocked in-tool; see QA doc) — a 60-sec human/device-mode check.
2. **Vercel project/domain sanity check** — ✅ CONFIRMED: `trucking-accident-site` is git-connected to this repo, production branch = `main`; the preview deployed there, not `-814t`.
3. **Legal-tone / Fable review if required** — `audit:legaltone` is green. This is a public marketing site (no tenant/authz/PHI/crypto/migration/money), so a Fable safety verdict isn't strictly triggered; a human content/tone pass on the new hero copy is the real gate.
4. **Growth OS taxonomy/ontology engine — NOT implemented.** Documented standard only (`docs/GROWTH-OS-TAXONOMY-ONTOLOGY.md`).
5. **Content scaling still blocked** by #4. Images are UI infrastructure and were allowed to proceed; written-page expansion is not, until the engine exists. (This redesign does **not** scale content — it restyles existing pages.)

## 8. Recommended deployment sequence — DO NOT EXECUTE
For human approval and execution later, in order:
1. **Open a PR** from `redesign/next-gen-legal-platform` → the repo's production branch. Review the diff (UI + 44 images + manifest).
2. **Preview deploy only**, to the **`trucking-accident-site`** project (git-integration preview, or `vercel` CLI linked to that project — confirm the link first). Never `-814t`.
3. **Verify preview pages:** homepage, one state (e.g. /states/texas), 2–3 city hubs **including NYC and Chicago**, one accident page, and /contact. Confirm new heroes/OG render and the page is trucking content (not NY Construction).
4. **Production approval** only after the preview passes human review — then merge/promote to production on `trucking-accident-site`.

## 9. Stop conditions (abort the deploy if any is true)
- The Vercel target is **anything other than `trucking-accident-site`** (especially `-814t`).
- The preview shows **NY Construction content** (wrong project linked).
- **`.env.local`** would be staged/committed/deployed (it must stay gitignored + untracked).
- **Build or `audit:legaltone` fails** on the deploy branch.
- **Any image fails human visual review** (compliance or quality).

---

*Documentation only. No image/content generation, no push, no deploy, no Vercel changes, no secrets read, original protected files untouched.*
