# P4 Tier A — Generation QA Notes (2026-06-25)

Generated via `npm run images:generate --only <5 Tier A>` (fal-ai/flux-pro/v1.1, landscape_16_9). 5/5 succeeded. Houston untouched. Est. cost ~$0.20–0.25.

## Per-image review (each inspected directly, not via a server)

| Slug | Scene read | People/face | Wreckage/victim | Readable text/sign | Plate | Logo | Fake legal evidence | Verdict |
|---|---|---|---|---|---|---|---|---|
| city-arizona-phoenix | Aerial desert interstate at sunset, truck convoy, distant ranges, saguaro silhouettes | none | none | none | none | none | none | PASS |
| city-utah-salt-lake-city | Road into snow-capped mountain front, blue hour, single truck + light trails | none | none | none | none | none | none | PASS |
| city-florida-miami | Elevated causeway over water at dusk, distant port cranes, palms, poles | none | none | none | none | none | none | PASS |
| city-california-los-angeles | Port/container yard, crane row, sweeping interchange light trails, warm sunset | none | none | none | none | none | none | PASS |
| city-missouri-kansas-city | Wide flat rail/warehouse logistics plain at dusk, light trails, big sky | none | none | none | none | none | none | PASS |

## Variety judgment (the Tier B gate)
Distinct by **scene** (desert / snowy mountains / coastal causeway / port-containers / flat logistics plain), **palette** (orange · cold blue · teal · warm amber · blue-pink), and **composition** (aerial · eye-level · elevated 3/4 · high overlook · wide plain). This is the opposite of the P3b "premium but too similar" failure. **PASS — clears the gate for Tier B.**

## Result
- Rejected: 0. Regenerated: 0. Re-rolls used: 0.
- All 5 are usable as darkened heroes (dark skies, bright road/sky accents → text overlay legible).

## Screenshot note (rule-forced substitution)
Browser page-screenshots of the *new local* images are **not possible** without violating the repo `vercel-only` rule (no local dev/start server) or deploying (forbidden this task); playwright + ImageMagick are not installed. Substituted, server-free:
- Direct image inspection (above) — the actual safety + variety gate.
- `contact-sheet.html` in this folder — open in any browser (file://) for the side-by-side.
- Built-HTML hero/OG wiring proof (see commit / report) instead of pixels.
