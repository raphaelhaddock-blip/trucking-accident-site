# TRUCKING — HANDOFF

**Date:** 2026-06-25
**Branch:** `redesign/next-gen-legal-platform` (worktree `/Users/raphyhaddock/trucking-redesign`)
**Scope of this doc:** documentation only. Nothing here was pushed, deployed, promoted, aliased, or changed in Vercel.

---

## 1. Current verdict

The redesign is real, builds clean, and lives entirely on a local branch. It is **not live anywhere.**

> The live trucking site is still the original/pre-redesign code unless a later deployment proves otherwise.

The redesign worktree has never been deployed — there is no `.vercel` link in it (verified this session). The public trucking URL still serves the old template.

The earlier confusion came from a misnamed Vercel project. The dashboard project `trucking-accident-site-814t` looks like it belongs to trucking by its name, but it actually serves the **NY Construction** site. Deploying the trucking redesign there would overwrite NY Construction. Don't.

The correct, clean trucking project is `trucking-accident-site` (projectId `prj_PDI3oqSvw0EGLzGeaZblClnNweoa`). That is the only valid future deploy target for trucking.

---

## 2. Repo map

| Thing | Path / value |
|---|---|
| Original trucking repo (live code) | `/Users/raphyhaddock/trucking-accident-site` |
| Original repo Vercel link | `.vercel/project.json` → project `trucking-accident-site`, projectId `prj_PDI3oqSvw0EGLzGeaZblClnNweoa` |
| Redesign worktree | `/Users/raphyhaddock/trucking-redesign` |
| Redesign branch | `redesign/next-gen-legal-platform` |
| Redesign Vercel link | **none** — no `.vercel` dir, never deployed |
| Redesign packet | `docs/REDESIGN-PACKET.md` |
| This handoff | `docs/TRUCKING-HANDOFF.md` |

The original repo holds protected dirty files. They were not touched. All redesign work is committed on the redesign branch; the worktree is clean.

---

## 3. Vercel / domain map

Verified live this session (read-only HTTP GET, no Vercel commands):

| Domain | Serves (live `<title>`) | Status |
|---|---|---|
| `trucking-accident-site.vercel.app` | Trucking — "Truck Injury Lawyers \| Free Consultation" | **HTTP 200**, production |
| `trucking-accident-site-814t.vercel.app` | NY Construction — "Construction Accident Lawyer NY \| NY Construction Advocate" | **HTTP 200**, production — **misnamed, NOT trucking** |
| `ny-construction-site-22qr.vercel.app` | (docs said construction) | **HTTP 404** this session — does not resolve to a live page; confirm in dashboard before relying on it |

Project ↔ URL truth:
- Real trucking public URL: `https://trucking-accident-site.vercel.app`
- Real trucking Vercel project: `trucking-accident-site`
- Real trucking projectId: `prj_PDI3oqSvw0EGLzGeaZblClnNweoa`
- `trucking-accident-site-814t` is misnamed and serves NY Construction. It is **not** a trucking project despite the name.

---

## 4. Safe deploy target

**Only** the clean `trucking-accident-site` project (projectId `prj_PDI3oqSvw0EGLzGeaZblClnNweoa`).

- **Never** deploy the trucking redesign to `trucking-accident-site-814t` — that is NY Construction and would be clobbered.
- The redesign worktree has no `.vercel` link. A future deploy must link it to `trucking-accident-site` deliberately, not to whatever a stray dashboard link suggests.
- No deploy is authorized by this doc. This is the target *if and when* a deploy is later approved.

---

## 5. What is live vs what is local-only

**Live now (public):** the original/pre-redesign trucking code at `trucking-accident-site.vercel.app`. The old navy-and-amber template, old hero, old assets.

**Local-only (not live anywhere):**
- The entire next-gen redesign on `redesign/next-gen-legal-platform`.
- Every generated image (Flux Pro hero set, accident headers, priority-state heroes).
- The new brand asset system in `/public/brand/`.
- All docs in `docs/` including this one, the redesign packet, the Growth OS standard, and the P4 plan.

Nothing on the redesign branch reaches a user until someone deploys it to `trucking-accident-site`. That has not happened.

---

## 6. Completed redesign / image work

All committed on `redesign/next-gen-legal-platform` (verified against `git log` this session):

| Work | Commit | State |
|---|---|---|
| PR1 — next-gen UI redesign (first pass) | `1473c56` | done, local |
| PR2 — brand OG / mobile / conversion polish | `8a1cc5c` | done, local |
| PR3 — local pro-image system (auto-wired by slug) | `f1935be` | done, local |
| PR4 — fal.ai Flux Pro generator (port) | `d368f4a` | done, local |
| PR4B — 6 real Flux Pro hero images generated + wired | `7bc3f9f` | done, local |
| PR5A — 19 accident-header images (all 20 types covered) | `a1c2557` | done, local |
| PR5B (P3a) — 9 priority-state hero images | `2e1517b` | done, local |
| Growth OS taxonomy + ontology standard documented | `6ea1e09` | doc only, not implemented |
| P4 city-hub image plan (plan only, no spend) | `7c8792f` | plan only |

Held / not done on purpose:
- **P3b — remaining ~40 state hero images:** intentionally held. Not generated.
- **P4 — city hubs:** images not generated. The **plan exists** at `docs/P4-CITY-HUB-IMAGE-PLAN.md`; generation is the next step and has not run.

Build state at last check: `npm run build` exits 0; `npm run audit:legaltone` passes (per `docs/REDESIGN-PACKET.md`). Re-verify before any deploy.

---

## 7. SEO Growth OS taxonomy / ontology requirement

This is a required standard, documented but **not yet implemented**: `docs/GROWTH-OS-TAXONOMY-ONTOLOGY.md`.

The rule it sets: **content scaling is gated on the taxonomy/ontology engine.** You don't mass-produce city/state/accident pages until the taxonomy and ontology layer exists to keep them distinct, interlinked, and non-duplicative.

Images are treated as UI infrastructure and may proceed independently of this gate. Content cannot.

Practical read: finishing images (P4) is allowed; scaling written pages is not, until the Growth OS engine is built.

---

## 8. What NOT to do

- Do **not** push.
- Do **not** deploy, promote, or alias anything.
- Do **not** change domains.
- Do **not** modify Vercel project settings.
- Do **not** deploy the trucking redesign to `trucking-accident-site-814t` (it's NY Construction).
- Do **not** touch the protected dirty files in `/Users/raphyhaddock/trucking-accident-site`.
- Do **not** read or print secrets (e.g. `.vercel/.env.development.local` in the original repo).
- Do **not** generate images or content as part of a handoff/doc task.
- Do **not** scale content before the Growth OS taxonomy/ontology engine exists.

---

## 9. Next recommended work

In order:

1. **Finish the P4 city-hub image *plan*** — the plan, not the generation. `docs/P4-CITY-HUB-IMAGE-PLAN.md` exists; tighten it to a ship-ready spec (hub list, prompts, count, budget) so generation is a one-command, pre-approved run later.
2. **Decide whether to deploy the redesign** later to the correct `trucking-accident-site` project. This is a human call (see §11). If yes, link the worktree to that project deliberately and re-run build + tone audit first.
3. **Fix the misleading Vercel project name** `trucking-accident-site-814t` → something honest like `ny-construction-site`, in the **dashboard only**, and only after human approval. (Renaming touches NY Construction's live project — treat with care.)
4. **Implement the Growth OS taxonomy/ontology engine** before any content scaling. It's the gate on everything written.

---

## 10. Open risks

- **Name trap.** `trucking-accident-site-814t` reads as trucking but serves NY Construction. Any tool or person grounding on the name instead of the live title will deploy to the wrong project. The fix in §9.3 closes this; until then, the risk is live.
- **`-22qr` unknown.** `ny-construction-site-22qr.vercel.app` returned 404 this session, contradicting docs that called it construction. Don't act on it until confirmed in the dashboard.
- **Redesign is unproven in production.** It builds locally; it has never run on Vercel. First deploy could surface env/config/asset-path issues not visible locally. Treat the first deploy as a test, ideally to a preview before production.
- **Content-scaling temptation.** The pages look ready to multiply, but the Growth OS gate (§7) is not built. Scaling now creates duplicate-content debt.
- **P4 spend.** Image generation costs money per image. Generation should stay gated behind explicit approval and a counted budget, not triggered by a "finish the plan" task.

---

## 11. Human approval gates

These need Raphy's explicit go before anyone acts:

- [ ] **Deploy the redesign** to `trucking-accident-site` (production) — one-way-ish, replaces the live site.
- [ ] **Generate P4 city-hub images** — costs money; plan first, spend on approval.
- [ ] **Generate P3b remaining state images** — currently held on purpose.
- [ ] **Rename `trucking-accident-site-814t`** in the Vercel dashboard — touches NY Construction's live project.
- [ ] **Scale content** — blocked until the Growth OS taxonomy/ontology engine is implemented.

Until each box is checked by a human, the default is: leave it as-is.

---

*Generated as documentation only. No push, no deploy, no Vercel changes, no secrets read, no images or content generated.*
