# Brand Asset System — National Truck Accident Response

Local, self-hosted brand kit. Replaces the old Sanity-CDN look. Everything here is
hand-built SVG (no stock photography, no fabricated evidence). Photographic assets that
need a generator are specified as exact prompts below — **do not invent crash photos,
victims, courtrooms, or evidence.**

## Files (shipped)
| File | Use |
|------|-----|
| `logo-mark.svg` | Standalone route-marker mark. Dark plate, amber chevron. |
| `logo-lockup.svg` | Mark + wordmark + tagline, light-background version. |
| `favicon.svg` | Simplified mark for favicon / app icon. |
| `interstate-network.svg` | Abstract freight-corridor map. Hero/section background motif (decorative, not real data). |
| `records-grid.svg` | Evidence / case-file / ELD-log abstraction. "Evidence preservation" sections. |
| `road-texture.svg` | Roadway lane band. Section divider strip (stretches via `preserveAspectRatio=none`). |
| `section-divider.svg` | Signage mile-marker hairline divider. |

In-app the nav/footer use the React `Logo` component (`src/components/Logo.tsx`,
inline SVG, crisper + theme-aware). The static files above are the portable kit.

## Color tokens (source of truth: `src/app/globals.css`)
- Ink (cinematic dark base): `--ink-950 #060b14` → `--ink-700 #1d3350`
- Steel (cool neutral): `--steel-300 #a4b5c9` … `--steel-500 #5d6e85`
- Paper (warm light surface): `--paper #faf8f3`, `--paper-2 #f1ece2`
- Accent (amber signage / CTA): `--accent-500 #f5a300`, `--accent-400 #fbbf24`
- Signal (hazard urgency, sparing): `--signal-500 #d6452a`
- Line (hairline): `--line #e2dccd`

## Type
- Display / headlines: **Newsreader** (editorial serif, authority)
- Body / UI: **Inter** (tabular figures for data)
- Eyebrows / stat units / labels: **IBM Plex Mono** (instrument-panel feel)

## Image usage rules
1. **No generic lawyer stock** (handshakes, gavels, suits-at-desk). Banned.
2. **No fabricated accident evidence, victims, crash scenes, or courtrooms.** Banned.
3. **No purple/blue AI gradients, no neon glow.** Use the ink→amber command palette + grain.
4. Decorative backgrounds = the SVG motifs here, layered over `.bg-command` + `.grain`.
5. Photography, when added, is **documentary infrastructure**: highways, interchanges,
   freight at distance, ports, weigh stations, dusk/dawn. Desaturated, editorial, no faces.
6. Drop generated raster under `public/brand/photo/`, export `webp` + `avif`, and wire by
   replacing the Sanity URLs in `src/lib/states-content/images.ts`,
   `src/lib/accidents-content/images.ts`, and the `DEFAULT_OG_IMAGE` consts.
   Add a `localPatterns`/remove `cdn.sanity.io` from `next.config.ts` once fully migrated.

---

## EXACT GENERATION PROMPTS (hand to a pro image model or Codex)

> Global negative prompt for ALL of these:
> `no people, no faces, no crash wreckage, no injured persons, no courtroom, no gavel,
> no stock-photo handshakes, no text, no watermark, no logos, no purple/cyan neon glow,
> no HDR halo, no fake signage text. Photorealistic documentary, muted color grade.`

### 1. National trucking-law hero  → `public/brand/photo/hero-interstate.{webp,avif}` (2400×1280)
`Aerial drone photograph of a multi-level interstate highway interchange at blue-hour
dusk, long-exposure freight-truck light trails sweeping through the curves, deep navy
sky, warm amber sodium-lamp accents, fog in the low distance, cinematic wide shot,
muted teal-and-amber documentary color grade, fine film grain, shot on full-frame
35mm, high detail, no people.`

### 2. Interstate freight network (photographic alt to the SVG) → `public/brand/photo/network-corridor.{webp,avif}` (2400×1000)
`High-altitude night satellite-style view of a continental highway corridor network,
glowing amber road lines over dark terrain, subtle topography, command-center map
aesthetic, desaturated, no labels, no text.`

### 3. Evidence / records abstraction (photographic alt) → `public/brand/photo/evidence-records.{webp,avif}` (1600×1200)
`Overhead flat-lay of anonymized commercial-trucking compliance paperwork on a dark
steel surface — blank log sheets, a black electronic logging device, a tire tread gauge,
a measuring tape — low-key dramatic side light, amber rim light, documentary still-life,
absolutely no readable text, no personal data, no faces.`

### 4. Accident-type page header → `public/brand/photo/accident-header-{slug}.{webp,avif}` (1408×768)
`Cinematic infrastructure photograph illustrating the MECHANISM of a {accident type}
without depicting a crash or victims — e.g. an empty rain-slicked highway curve at dusk
for "jackknife", a long downhill grade with runaway-truck ramp signage shape for
"brake failure", a foggy underpass for "underride". Wide, moody, muted amber-navy grade,
film grain, no vehicles in collision, no people, no readable text.`
(Generate per slug; keep the existing descriptive ALT text from `accidents-content/images.ts`.)

### 5. State / city page header → `public/brand/photo/state-{slug}.{webp,avif}` (1584×672)
`Recognizable but non-touristy infrastructure of {State}: a signature interstate corridor
or freight artery at golden hour (e.g. I-35 plains for Texas, I-95 coastal for Florida),
wide cinematic landscape, freight trucks at distance, muted documentary grade, film grain,
no people, no readable signage text, no landmarks requiring trademark clearance.`

### 6. Roadway / evidence-preservation texture
Shipped as `road-texture.svg`. For a photographic version:
`Macro photograph of weathered asphalt with a worn amber lane line crossing diagonally,
top-down, even light, desaturated, subtle grain — tileable.`

---

## OG / social raster (needed because social cards can't use SVG reliably)
Render a 1200×630 PNG named `og-default.png` from the hero composition (ink `.bg-command`
backdrop + `interstate-network.svg` + the lockup + headline "National Truck Accident
Response"). Until generated, metadata keeps the existing Sanity OG URLs so social cards
don't break — see REDESIGN-PACKET "Risks / Raphy approvals".
