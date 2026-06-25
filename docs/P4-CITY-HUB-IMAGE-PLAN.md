# P4 — City-Hub Image Plan (PLAN ONLY — no generation, no spend)

Bounded plan for custom city-hub hero/OG images, chosen where a photo adds **real visual distinctiveness + commercial value** over the global fallback. Nothing generated here. Awaiting explicit go.

## Method (ground-truthed this session)
- **Enhanced content is NOT a differentiator:** ~1,600 of 1,613 city files already carry `truckingIndustry` prose. So selection is by **commercial value (metro size / freight significance)** + **distinctive visual identity** the prompt can render safely.
- **Excluded — protected/dirty (do-not-touch content):** tucson, san-francisco, denver, indianapolis, louisville, boston, detroit, las-vegas, albuquerque, brookhaven, buffalo, islip, oyster-bay, charlotte, portland, memphis, nashville, el-paso, seattle. (Image files live in `public/brand/photo/` and don't modify content, but per the rule these stay parked. **Seattle (port+mountains), Denver (Rockies), Detroit (Great Lakes industrial) are visually ideal — revisit after their content files are cleaned.**)
- **The long tail keeps the global fallback** — a city with no image cleanly falls back to its state image, then `hero-interstate`. No UX gap.
- All 10 below were verified to exist as pages this session; states are diversified (no more than 1 per state except TX, the #1 truck-fatality market).

## Recommended 10 city hubs (max)
| # | City slug → file basename | Why (commercial + freight) | Visual language | Prompt direction (append base + negatives) |
|---|---|---|---|---|
| 1 | `texas/dallas` → `city-texas-dallas` | Sun Belt mega-market; DFW freight + High Five stack; TX is #1 market | Skyline + stacked interchange | "Dallas skyline silhouette at dusk behind a multi-level highway stack interchange, plains horizon, freight at distance" |
| 2 | `california/los-angeles` → `city-california-los-angeles` | Largest CA market; Port of LA/Long Beach; I-5/I-110 | Port logistics + interchange | "Sprawling LA freeway interchange at dusk with a container-port silhouette in the far distance, hazy warm light" |
| 3 | `illinois/chicago` → `city-illinois-chicago` | National rail/freight crossroads; Great Lakes | Great Lakes industrial + skyline | "Chicago skyline silhouette at blue hour beyond an industrial rail/freight corridor and lakefront, cold steel tones" |
| 4 | `georgia/atlanta` → `city-georgia-atlanta` | Southeast freight nexus (I-285/75/85) | Skyline + perimeter interstate | "Atlanta skyline silhouette at dusk above a busy perimeter-interstate interchange, pine-treed horizon" |
| 5 | `florida/miami` → `city-florida-miami` | Top-market coastal port; FL high-fatality state | Coastal port + causeway | "Miami coastal causeway and port silhouette at dusk, water reflections, palm horizon, warm amber light" |
| 6 | `arizona/phoenix` → `city-arizona-phoenix` | Southwest hub; I-10 desert freight | Desert freight route | "Phoenix desert interstate at dusk, saguaro-dotted plain, distant low mountains, dry amber haze" |
| 7 | `new-york/new-york-city` → `city-new-york-new-york-city` | Largest US market; bridge/tunnel freight | Skyline + bridge approach | "NYC skyline silhouette at dusk seen past a major bridge truck-approach, river foreground, no readable signage" |
| 8 | `pennsylvania/philadelphia` → `city-pennsylvania-philadelphia` | NE corridor + Delaware River port | NE corridor + port | "Philadelphia skyline silhouette at dusk beyond a Delaware-River port/refinery corridor and interstate" |
| 9 | `missouri/kansas-city` → `city-missouri-kansas-city` | Geographic freight/distribution + rail hub | Logistics / rail freight | "Kansas City logistics corridor at dusk — rail yards, distribution warehouses, an interstate over rolling plains" |
| 10 | `utah/salt-lake-city` → `city-utah-salt-lake-city` | I-80/I-15 mountain crossroads | Mountain approach | "Salt Lake City interstate at dusk with the Wasatch mountain front behind, snow-dusted peaks, freight at distance" |

(`texas/houston` already done in PR4B — not regenerated.)

## Cost / render / safety
- **Cost:** ~10 × ~$0.05 ≈ **$0.50** (Flux Pro v1.1).
- **Render target (each):** `/states/{state}/{city}` hero (darkened command overlay) **and** that page's OG/social image; overrides the state fallback for that one city.
- **Visual language used:** skyline silhouettes (5), port/coastal (LA, Miami, Philadelphia), desert (Phoenix), mountain (Salt Lake City), Great Lakes industrial (Chicago), rail/logistics (Kansas City) — a deliberate spread, not 10 look-alikes.
- **Compliance (every prompt):** no people, faces, victims, crash wreckage, courtrooms, gavels, readable signs, license plates, brand logos, documents, or fake landmarks. Skylines are **recognizable silhouettes at distance**, not trademarked named buildings in focus; no postcard fakery, no invented local facts. `enable_safety_checker: true`. Each image eyeballed (contact sheet) before wiring.

## Run command (when approved)
```
npm run images:generate -- --only city-texas-dallas,city-california-los-angeles,city-illinois-chicago,city-georgia-atlanta,city-florida-miami,city-arizona-phoenix,city-new-york-new-york-city,city-pennsylvania-philadelphia,city-missouri-kansas-city,city-utah-salt-lake-city
npm run build   # prebuild wires them; then contact-sheet review + screenshots
```
(Note: the generator currently builds the city prompt generically from the slug — before running, I'll add these 10 per-city scene lines to `scripts/generate-brand-images.ts` so each renders its specific visual language, mirroring the `ACCIDENT_SCENE` map.)

## STOP
Plan only. **No images generated, no spend, nothing wired. Awaiting go.**
