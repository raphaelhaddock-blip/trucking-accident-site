# P4 Tier B — Generation QA Notes (2026-06-25)

Generated via `npm run images:generate --only <5 Tier B>` (fal-ai/flux-pro/v1.1, landscape_16_9). 5/5 succeeded. Tier A + Houston untouched. Est. cost ~$0.20–0.25.

## Per-image review (each inspected directly)

| Slug | Scene read | People/face | Wreck/victim | Readable text/sign | Plate | Logo | Fake legal evidence | Verdict |
|---|---|---|---|---|---|---|---|---|
| city-texas-dallas | Aerial curving stack interchange + light trails, skyline silhouette left, sunset band | none | none | none | none | none | none | PASS |
| city-illinois-chicago | Eye-level truck on rail line by water, skyline across water, blue hour | none | none | none | none (cab front dark, no number) | none | none | PASS |
| city-georgia-atlanta | Aerial interchange + light trails through dark tree canopy, skyline on horizon | none | none | none | none | none | none | PASS |
| city-new-york-new-york-city | Steel arch-truss bridge over river at dusk, skyline on far bank, deck light trails | none | none | none | none | none | none | PASS |
| city-pennsylvania-philadelphia | Aerial refinery/industrial corridor + river, smokestacks, sunset | none | none | none | none | none | none | PASS |

## Variety judgment (skyline look-alike gate — mandatory for Tier B)
Across Tier B: bridge (NYC) · refinery/industrial (Philly) · truck-on-rail-by-water (Chicago) · aerial stack (Dallas) · aerial forested interchange (Atlanta). NYC, Philly, Chicago are strongly distinct.

**Caveat — closest pair in the whole P4 set: Dallas vs Atlanta.** Both are "aerial interchange + light trails + distant skyline at dusk." They differ (Dallas = open/urban ground, skyline left; Atlanta = green tree canopy, skyline center) so both are kept — neither is generic. But the aerial-interchange-with-skyline composition is now used **twice**. The skyline vocabulary is saturated: a *third* skyline city would read as a repeat.

Against Tier A (desert/snow-mountain/coastal/port/plain): no clash — Tier B adds bridge, industrial, and aerial-interchange compositions not present in Tier A.

## Result
- Rejected: 0. Regenerated: 0. Re-rolls used: 0.
- All 5 work as darkened heroes (dark skies / bright trails → overlay text legible).

## Recommendation
**City image system COMPLETE.** 11 city heroes (Houston + 5 Tier A + 5 Tier B) span every distinct freight-visual archetype available without repetition. Do **not** add more skyline cities (Dallas/Atlanta already double up the aerial-interchange look). Generate a custom city image later only if a *specific* high-value page needs a one-off visual — not for breadth.

## Screenshot note (rule-forced substitution)
Same as Tier A: browser page-screenshots of new local images would require a local server (forbidden by `vercel-only`) or a deploy (forbidden this task); playwright/ImageMagick not installed. Substituted: direct image inspection (above) + `contact-sheet.html` (this folder) + built-HTML hero/OG proof (NYC + Chicago, see report).
