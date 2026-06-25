# P4 — City-Hub Image Plan (FINAL, approval-ready — PLAN ONLY, no generation, no spend)

Bounded plan for custom city-hub hero/OG images, chosen only where a photo adds **real visual distinctiveness + commercial value** over the state/global fallback. Nothing is generated here. No FAL_KEY is used. Awaiting an explicit "go P4."

**Verified this session (ground truth, not recall):**
- Generator: `scripts/generate-brand-images.ts` → `fal-ai/flux-pro/v1.1`, `image_size: landscape_16_9`, `num_images: 1`, `enable_safety_checker: true`. Exact `BASE_PROMPT` + `NEGATIVE` are reused verbatim below.
- Resolver: `src/lib/brand-images.ts`. A city file `city-{state}-{city}.{ext}` overrides the city page **hero** (`heroPhoto`, used in `src/app/states/[slug]/[city]/page.tsx:281`) **and** the **OG/social image** (`ogImage`, used in that page's `openGraph`/`twitter` at lines 73–90). Fallback chain: `city-{state}-{city}` → `state-{state}` → `hero-interstate`. The long tail keeps that fallback — no UX gap for un-imaged cities.
- Existing city image coverage: **only `city-texas-houston.jpg`** exists (PR4B). Plus 20 accident headers, 10 state images, and 3 fixed brand scenes. No other city images, no protected-city images on disk.
- All 10 candidates below exist as real pages (1,613 city files total; each candidate file confirmed present).

---

## The P3b lesson drives this plan
P3b (40 remaining state images) was parked because the images were **premium but too similar** — dusk highway after dusk highway. The 5 skyline-led cities here carry that exact risk: "skyline silhouette behind a highway at dusk" repeated five times reads as one image. So the plan does two things the old draft didn't:

1. **The foreground is the differentiator, not the skyline.** Each prompt leads with a signature foreground (a five-level stack, a desert plain, a mountain front, a port, a rail yard, a bridge span). The skyline, where present, is demoted to a distant silhouette.
2. **Two tiers with a hard gate.** Generate the 5 geography-distinct cities first, review them side by side, and only spend on the 5 skyline cities if Tier A proves the pipeline produces distinguishable images. If Tier A already looks samey, stop before Tier B.

---

## Required code change before any run — ✅ DONE 2026-06-25 (prep fix, no generation)
The generic city-prompt builder was not fit to run as-is:
- It **mis-parsed multi-word states**: `city-new-york-new-york-city` titleized to *"York New York City"* (it only dropped the first slug token).
- It emitted **one generic line for every city** ("metro freight artery / beltway … recognizable skyline silhouette") — the look-alike trap.

**Fix landed** in `scripts/generate-brand-images.ts` (code only, no spend, model/settings/negative unchanged):
- Added `CITY_SCENE: Record<string,string>` — explicit per-basename scene for all 10 approved cities, taken from this doc. The `city-` branch now uses `CITY_SCENE[basename]` first; only unknown city slugs fall through to the old generic parse. No slug parsing for P4 cities.
- Added a **dry-run/list mode** (`--dry-run` / `--print`, honoring `--only`) that prints the exact final prompt and exits **before** any `FAL_KEY` read or fal.ai call.

**Verified this session** (`npm run images:generate -- --dry-run --only <all 10>`, run with `FAL_KEY` unset):
- No "York New York City" artifact — NYC prompt is the explicit bridge-approach scene.
- 10/10 scene lines distinct; full safety negative on all 10.
- No banned element requested — every "signage" mention is "no readable signage" / "no fake signage".
- No API call, no files written (photo dir unchanged: Houston is still the only `city-*` image).

---

## Final recommended city list (10 max, two tiers)

### Tier A — generate first (geography-distinct, low look-alike risk)

| # | City slug | File basename | Why (commercial + freight) | Visual direction |
|---|---|---|---|---|
| 1 | `arizona/phoenix` | `city-arizona-phoenix` | Southwest hub; I-10 desert freight backbone | Desert plain + saguaro, distant low mountains, **no skyline** |
| 2 | `utah/salt-lake-city` | `city-utah-salt-lake-city` | I-80 × I-15 mountain crossroads, intermountain distribution | Snow-dusted Wasatch front directly behind the valley |
| 3 | `florida/miami` | `city-florida-miami` | Top coastal port market; FL high-fatality state | Causeway + container-port silhouette over water, palms |
| 4 | `california/los-angeles` | `city-california-los-angeles` | Largest CA market; Port of LA/Long Beach; I-5/I-110 | Freeway interchange + distant port cranes, hazy amber |
| 5 | `missouri/kansas-city` | `city-missouri-kansas-city` | Geographic distribution + rail hub | Rail yards + warehouse rows beside an interstate, **no skyline** |

### Tier B — only if Tier A passes the gate (skyline-led, foreground must carry it)

| # | City slug | File basename | Why (commercial + freight) | Visual direction (foreground signature) |
|---|---|---|---|---|
| 6 | `texas/dallas` | `city-texas-dallas` | Sun Belt mega-market; DFW freight; TX #1 truck-fatality market | **Five-level stack interchange** in front; skyline distant |
| 7 | `illinois/chicago` | `city-illinois-chicago` | National rail/freight crossroads; Great Lakes | **Lakefront rail/freight corridor**; cold steel palette |
| 8 | `georgia/atlanta` | `city-georgia-atlanta` | Southeast nexus (I-285/75/85) | **Perimeter interchange through pine treeline**; humid light |
| 9 | `new-york/new-york-city` | `city-new-york-new-york-city` | Largest US market; bridge/tunnel freight | **Bridge truck-approach span over a river**; skyline beyond |
| 10 | `pennsylvania/philadelphia` | `city-pennsylvania-philadelphia` | NE corridor + Delaware River port | **River port + refinery corridor**; industrial amber |

Diversification: max 1 city per state. TX carries 2 only because Houston is already done (PR4B) and Dallas is the #1 market. (`texas/houston` is NOT regenerated.)

**Excluded — protected/dirty content (do-not-touch), revisit only after their content files are cleaned:** tucson, san-francisco, denver, indianapolis, louisville, boston, detroit, las-vegas, albuquerque, brookhaven, buffalo, islip, oyster-bay, charlotte, portland, memphis, nashville, el-paso, seattle. Note: **Seattle (port + mountains), Denver (Rockies), Detroit (Great Lakes industrial) are visually ideal** and would beat some Tier-B picks — they stay parked purely because their content is protected, not for visual reasons.

---

## Exact proposed image prompts
Each is `BASE_PROMPT` + the per-city scene line + `NEGATIVE`, exactly as the generator concatenates them.

**BASE_PROMPT** (verbatim):
> Photorealistic documentary infrastructure image for a premium national trucking accident legal response platform. Cinematic blue-hour/dusk lighting, muted navy/steel/amber color grade, full-frame editorial photography, fine film grain, serious and authoritative.

**NEGATIVE** (verbatim, appended to every prompt):
> No people, no faces, no crash wreckage, no injured persons, no courtroom, no gavel, no stock-photo handshakes, no readable text, no watermark, no logos, no fake signage, no license plates, no purple or cyan neon.

Per-city scene lines (the `CITY_SCENE` map to add):

1. **Phoenix** — `A wide Sonoran-desert interstate at dusk cutting across a saguaro-dotted plain toward distant low desert mountains, dry amber heat haze, freight trucks small in the distance, no city skyline.`
2. **Salt Lake City** — `A broad valley interstate at dusk running toward the snow-dusted Wasatch mountain front rising directly behind, cold blue peaks against warm valley light, freight trucks at a distance.`
3. **Miami** — `A coastal causeway at dusk over calm reflective water with a distant container-port crane silhouette and a palm-lined horizon, warm amber light, no readable signage.`
4. **Los Angeles** — `A sprawling multi-lane freeway interchange at dusk with distant container-port cranes silhouetted on a hazy horizon, warm smoggy amber light, skyline minimal.`
5. **Kansas City** — `A ground-level logistics corridor at dusk: rail yards and rows of distribution warehouses beside an interstate over rolling plains, steel-and-amber tones, no prominent skyline.`
6. **Dallas** — `A multi-level stacked highway interchange (five-level stack) in the foreground at dusk, the city skyline a distant silhouette beyond a flat plains horizon, warm amber light.`
7. **Chicago** — `An industrial rail and freight corridor along a lakefront at blue hour, the city skyline a cold-steel silhouette in the far distance, gray-blue Great Lakes tones, colder palette.`
8. **Atlanta** — `A busy multi-lane perimeter-interstate interchange at dusk threading through a dense pine treeline, the city skyline a distant silhouette above the trees, humid warm light.`
9. **New York City** — `A major bridge truck-approach span in the foreground at dusk crossing a wide river, the distant city skyline a silhouette beyond, steel-blue river reflections, no readable signage.`
10. **Philadelphia** — `A Delaware-River industrial port and refinery corridor at dusk with an interstate alongside, the city skyline a small distant silhouette, amber industrial glow.`

---

## Render target (each city)
- File: `public/brand/photo/city-{state}-{city}.{ext}` (extension-agnostic; fal writes `.jpg`).
- Wires to: that city's page `/states/{state}/{city}` — **hero** (darkened CommandHero overlay) **and** the page's **OG/social image**. Overrides the state fallback for that one city only.

---

## Estimated cost
- fal Flux Pro v1.1, `landscape_16_9`, 1 image/call. List price ~$0.04–0.05/image (confirm current fal rate at run; never assume).
- 10 images ≈ **$0.40–0.50**. With a 1-re-roll-per-image contingency, **hard cap ≈ $1.00**. Tier A alone ≈ $0.20–0.25.

---

## Can a city image safely show skyline / port / logistics / corridor?
Yes, within these limits (already enforced by `NEGATIVE` + scene wording):
- **Skylines:** allowed only as a **recognizable silhouette at a distance** — never a single trademarked named building in sharp focus, never a postcard fake.
- **Ports / cranes / refineries:** allowed as **distant unbranded silhouettes** — no company names, no logos, no readable signage.
- **Logistics / rail / warehouses / corridors:** fine — generic, unbranded infrastructure.
- **Hard no (in `NEGATIVE`):** people, faces, victims, crash wreckage, courtrooms, gavels, handshakes, readable text, watermarks, logos, fake signage, license plates. No invented local facts; the image is brand atmosphere, not a data claim.
- One watch item: "refinery/port industrial" scenes can trip the safety checker as hazard imagery — if a clean prompt returns nothing, re-roll once, else cut.

---

## Pass/fail criteria before wiring
Review all generated images on a single contact sheet, side by side, and against the existing 10 state images.

**PASS (all must hold):**
- Visually distinguishable from the other 9 cities **and** from the 10 state images at hero scale.
- Clearly reads as its intended geography signature (desert / mountains / port / rail / stack / bridge).
- Compliance clean — nothing from the `NEGATIVE` list present.
- Works as a **darkened** hero: enough contrast that white overlay text stays legible.

**FAIL (any one):**
- Reads as a generic "dusk highway + skyline" indistinguishable from another city or a state image (the P3b failure).
- Any compliance violation (readable text, logo, plate, people, wreckage, etc.).
- Too muddy / low-contrast to carry overlay text.

**Re-roll rule (two-strikes):** a failed image gets **one** re-roll with a sharpened scene line. Fails twice → **cut that city** (it falls back cleanly to its state image). Do not keep re-rolling the same city.

**Tier gate:** generate Tier A (5) → contact-sheet review → proceed to Tier B **only if ≥4/5 Tier A pass and look distinct**. If Tier A images already look similar to each other or to the state images, STOP and rethink before any Tier B spend.

---

## STOP — condition before generation
Plan only. No images generated, no FAL_KEY read, no `images:generate`, no build-wire, no spend. Nothing committed but this doc.

Generation prerequisites: (1) ✅ `CITY_SCENE` code edit landed + dry-run verified (done 2026-06-25); (2) ⏳ Raphy's explicit "go P4" — still required. Even on go: Tier A first, contact-sheet gate, then Tier B.

Dry-run (safe, no spend) to re-inspect prompts any time:
```
npm run images:generate -- --dry-run --only city-arizona-phoenix,city-utah-salt-lake-city,city-florida-miami,city-california-los-angeles,city-missouri-kansas-city,city-texas-dallas,city-illinois-chicago,city-georgia-atlanta,city-new-york-new-york-city,city-pennsylvania-philadelphia
```

Run command when (and only when) "go P4" is given:
```
# Tier A first
npm run images:generate -- --only city-arizona-phoenix,city-utah-salt-lake-city,city-florida-miami,city-california-los-angeles,city-missouri-kansas-city
npm run build   # prebuild wires them; then contact-sheet review + screenshots
# Tier B only after Tier A passes the gate
npm run images:generate -- --only city-texas-dallas,city-illinois-chicago,city-georgia-atlanta,city-new-york-new-york-city,city-pennsylvania-philadelphia
npm run build
```
