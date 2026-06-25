# PR3 — Pro Image Generation Pack

The redesign Claude session has **no image generator**. This doc is the complete spec for Raphy/Codex to generate the pro assets. The app is already wired: **drop a correctly-named file into `public/brand/photo/` and the next `npm run build` auto-detects it** (a `prebuild` step scans the folder and regenerates `src/lib/brand-images.generated.ts`). No code change needed.

## How the wiring resolves (already built — `src/lib/brand-images.ts`)
- **Visible hero** (`heroPhoto`): city photo → state photo → (index motif) → global hero → **null = command treatment** (never Sanity).
- **OG/social** (`ogImage`): most-specific page photo → **`og-default.png`** (already shipped). Never Sanity.
- A missing file simply falls back. Nothing breaks. Nothing is fake-wired.

## File format & size (one spec for all)
- **Format:** `.webp` (preferred), `.avif`, `.jpg`, or `.png` all accepted. Use `.webp`.
- **Dimensions:** **2400 × 1260** (≈1.9:1 — doubles as the OG/social crop and the full-bleed hero).
- **Weight:** target < 350 KB each (these are hero/social, not print).
- Filenames are **exact and case-sensitive** — they must match the patterns below.

## Base prompt (prepend to every image)
> Photorealistic documentary infrastructure image for a premium national trucking accident legal response platform. Cinematic blue-hour/dusk lighting, muted navy/steel/amber color grade, full-frame editorial photography, fine film grain, serious and authoritative. **No people, no faces, no crash wreckage, no injured persons, no courtroom, no gavel, no stock-photo handshakes, no readable text, no watermark, no logos, no fake signage, no license plates, no purple/cyan neon.**

---

## PRIORITY ORDER (generate top-down — each tier lights up more pages)

### P0 — Global (1 file unlocks every page's hero fallback)
| File | Scene modifier (append to base prompt) |
|------|----------------------------------------|
| `hero-interstate.webp` | "Aerial drone view of a multi-level interstate highway interchange at dusk, long-exposure freight-truck light trails sweeping through the curves, deep navy sky, warm amber sodium-lamp accents, fog in the low distance, wide cinematic shot." |

### P1 — Index hubs (2 files)
| File | Scene modifier |
|------|----------------|
| `network-corridor.webp` | "High-altitude night view of a continental highway corridor network, glowing amber arterial roads over dark terrain, subtle topography, command-center map aesthetic, no labels." |
| `evidence-records.webp` | "Overhead low-key still-life on a dark steel surface: a black electronic logging device, a tire-tread depth gauge, a coiled measuring tape, blank unmarked clipboards — dramatic side light, amber rim light. Absolutely no readable text or data." |

### P2 — Accident-type headers (20 files: `accident-header-{slug}.webp`)
Mechanism/setting only — **never a crash in progress, never victims.**
| File | Scene modifier |
|------|----------------|
| `accident-header-jackknife-accidents.webp` | empty rain-slicked highway S-curve at dusk, wet reflective asphalt |
| `accident-header-rollover-accidents.webp` | steep banked highway off-ramp curve, low sun, guardrail |
| `accident-header-underride-accidents.webp` | foggy low underpass / trailer-height clearance gantry at dusk (no text on signs) |
| `accident-header-rear-end-collisions.webp` | congested interstate at dusk seen from above, brake-light trails, heavy spacing |
| `accident-header-head-on-collisions.webp` | undivided two-lane rural highway at dusk, faded center line, oncoming lanes |
| `accident-header-t-bone-accidents.webp` | wide rural highway intersection at blue hour, empty |
| `accident-header-wide-turn-accidents.webp` | tight urban intersection with truck turning radius curb, dusk |
| `accident-header-blind-spot-accidents.webp` | multi-lane freeway from a low side angle, long trailer, dusk |
| `accident-header-sideswipe-accidents.webp` | narrowing lane / merge zone with cones at dusk (no readable signs) |
| `accident-header-override-accidents.webp` | freeway approach with stopped-traffic gantry at dusk |
| `accident-header-brake-failure.webp` | long mountain downgrade with a runaway-truck escape ramp shape, dusk |
| `accident-header-tire-blowout.webp` | sun-baked desert interstate shoulder with tire debris, heat haze |
| `accident-header-driver-fatigue.webp` | empty night highway, headlight pools, lane markings receding, drowsy blue tone |
| `accident-header-distracted-driving.webp` | dusk highway through a windshield-perspective frame (no phone, no person) |
| `accident-header-speeding-accidents.webp` | motion-blurred fast highway at dusk, long light trails |
| `accident-header-cargo-spill-accidents.webp` | freeway with scattered freight pallets on the shoulder, dusk (no brands) |
| `accident-header-hazmat-accidents.webp` | tanker on a remote highway at dusk, amber hazard glow (no readable placards) |
| `accident-header-drunk-driving.webp` | night highway, weaving lane markings, cold blue + amber |
| `accident-header-runaway-truck.webp` | mountain runaway-truck arrester gravel ramp at dusk |
| `accident-header-improper-maintenance.webp` | truck service bay / underside inspection pit, low amber light (no people) |

### P3 — State headers (`state-{slug}.webp`) — homepage 10 first, then all 50
Featured 10: `state-texas.webp`, `state-california.webp`, `state-florida.webp`, `state-georgia.webp`, `state-pennsylvania.webp`, `state-ohio.webp`, `state-illinois.webp`, `state-north-carolina.webp`, `state-tennessee.webp`, `state-indiana.webp`.
Remaining 40 follow the same `state-{kebab-slug}.webp` pattern (e.g. `state-new-york.webp`, `state-new-jersey.webp`).
> Modifier: "Signature interstate/freight corridor of {State} at golden hour — e.g. I-35 plains for Texas, I-95 coastal for Florida, Appalachian I-81 for Pennsylvania — wide cinematic landscape, freight trucks at distance, no readable signage."

### P4 — City hubs (`city-{stateSlug}-{citySlug}.webp`) — optional, falls back to state
Generate only for the biggest hubs first, e.g. `city-texas-houston.webp`, `city-texas-dallas.webp`, `city-illinois-chicago.webp`, `city-arizona-phoenix.webp`.
> Modifier: "{City} metro freight artery / beltway at dusk, recognizable skyline silhouette at distance, no readable signage or logos."

---

## After generating
1. Drop files into `public/brand/photo/` (exact names).
2. `npm run build` — the prebuild step prints how many it found and wires them.
3. Visible heroes upgrade from the command treatment to the photo (darkened layer keeps text legible); per-page OG/social switch to the specific photo.

## Honest status at PR3 close
- **Generated this session:** `og-default.png` only (rasterized from the brand kit). 0 photoreal photos — none could be generated here.
- **Wired & waiting:** all of the above filenames resolve automatically once present.
- Until then, every page renders the command treatment (ink + freight-network motif) — premium and brand-consistent, just not photographic.
