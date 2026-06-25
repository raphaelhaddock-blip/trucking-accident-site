/**
 * generate-brand-images.ts — pro hero/OG images via fal.ai Flux Pro v1.1.
 *
 * Ported from ~/ny-blog-canary/src/lib/blog/generate-hero-image.ts (same fal
 * model + auth), but writes LOCAL files to public/brand/photo/ instead of
 * uploading to Sanity. The prebuild scanner (gen-image-manifest.ts) then wires
 * them by basename; the resolver (src/lib/brand-images.ts) is extension-agnostic.
 *
 * Auth: process.env.FAL_KEY (or a FAL_KEY line in ./.env.local). The key is
 * never printed. If FAL_KEY is missing the script exits non-zero WITHOUT
 * generating or faking anything.
 *
 * Usage:
 *   FAL_KEY=... npx tsx scripts/generate-brand-images.ts            # default priority set
 *   FAL_KEY=... npx tsx scripts/generate-brand-images.ts --only hero-interstate,state-texas
 *   npx tsx scripts/generate-brand-images.ts --list                 # print the catalog
 *
 * Hard image rules (baked into every prompt): no crash wreckage, victims,
 * people, faces, lawyers, courtrooms, gavels, readable signs, license plates,
 * logos, documents, personal data, or stock-photo legal clichés.
 */
import { fal } from '@fal-ai/client';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const FAL_MODEL = 'fal-ai/flux-pro/v1.1';
const IMAGE_SIZE = 'landscape_16_9' as const; // proven on this fal account (matches NY reference)
const OUT_DIR = join(process.cwd(), 'public', 'brand', 'photo');

const BASE_PROMPT =
  'Photorealistic documentary infrastructure image for a premium national trucking accident legal response platform. ' +
  'Cinematic blue-hour/dusk lighting, muted navy/steel/amber color grade, full-frame editorial photography, fine film grain, serious and authoritative.';
const NEGATIVE =
  'No people, no faces, no crash wreckage, no injured persons, no courtroom, no gavel, no stock-photo handshakes, ' +
  'no readable text, no watermark, no logos, no fake signage, no license plates, no purple or cyan neon.';

// Per-accident scene (mechanism/setting only — never a crash in progress, never victims).
const ACCIDENT_SCENE: Record<string, string> = {
  'jackknife-accidents': 'an empty rain-slicked highway S-curve at dusk, wet reflective asphalt',
  'rollover-accidents': 'a steep banked highway off-ramp curve at low sun with a guardrail',
  'underride-accidents': 'a foggy low highway underpass / clearance gantry at dusk',
  'rear-end-collisions': 'congested interstate at dusk from above, brake-light trails, heavy spacing',
  'head-on-collisions': 'an undivided two-lane rural highway at dusk with a faded center line',
  't-bone-accidents': 'a wide empty rural highway intersection at blue hour',
  'wide-turn-accidents': 'a tight urban intersection with a truck turning-radius curb at dusk',
  'blind-spot-accidents': 'a multi-lane freeway from a low side angle with a long trailer at dusk',
  'sideswipe-accidents': 'a narrowing lane / merge zone with cones at dusk',
  'override-accidents': 'a freeway approach with a stopped-traffic overhead gantry at dusk',
  'brake-failure': 'a long mountain downgrade with a runaway-truck escape ramp at dusk',
  'tire-blowout': 'a sun-baked desert interstate shoulder with tire debris and heat haze',
  'driver-fatigue': 'an empty night highway with headlight pools and receding lane markings, drowsy blue tone',
  'distracted-driving': 'a dusk highway seen through a windshield-perspective frame',
  'speeding-accidents': 'a motion-blurred fast highway at dusk with long light trails',
  'cargo-spill-accidents': 'a freeway with scattered unbranded freight pallets on the shoulder at dusk',
  'hazmat-accidents': 'a tanker on a remote highway at dusk with an amber hazard glow',
  'drunk-driving': 'a night highway with weaving lane markings, cold blue and amber',
  'runaway-truck': 'a mountain runaway-truck arrester gravel ramp at dusk',
  'improper-maintenance': 'a truck service bay / underside inspection pit in low amber light',
};

const FIXED_SCENE: Record<string, string> = {
  'hero-interstate':
    'Aerial drone view of a multi-level interstate highway interchange at dusk, long-exposure freight-truck light trails sweeping through the curves, deep navy sky, warm amber sodium-lamp accents, fog in the low distance, wide cinematic shot.',
  'network-corridor':
    'High-altitude night view of a continental highway corridor network, glowing amber arterial roads over dark terrain, subtle topography, command-center map aesthetic.',
  'evidence-records':
    'Overhead low-key still-life on a dark steel surface: a black electronic logging device, a tire-tread depth gauge, a coiled measuring tape, blank unmarked clipboards — dramatic side light, amber rim light.',
};

// Per-city scene overrides for the approved P4 city hubs (docs/P4-CITY-HUB-IMAGE-PLAN.md).
// EXPLICIT by full basename — never derived from slug parsing, which mangles multi-word
// states/cities (e.g. `city-new-york-new-york-city` titleized to "York New York City").
// Each line leads with a distinct FOREGROUND signature so the 10 don't read as look-alikes.
const CITY_SCENE: Record<string, string> = {
  // Tier A — geography-distinct
  'city-arizona-phoenix':
    'A wide Sonoran-desert interstate at dusk cutting across a saguaro-dotted plain toward distant low desert mountains, dry amber heat haze, freight trucks small in the distance, no city skyline.',
  'city-utah-salt-lake-city':
    'A broad valley interstate at dusk running toward the snow-dusted Wasatch mountain front rising directly behind, cold blue peaks against warm valley light, freight trucks at a distance.',
  'city-florida-miami':
    'A coastal causeway at dusk over calm reflective water with a distant container-port crane silhouette and a palm-lined horizon, warm amber light, no readable signage.',
  'city-california-los-angeles':
    'A sprawling multi-lane freeway interchange at dusk with distant container-port cranes silhouetted on a hazy horizon, warm smoggy amber light, skyline minimal.',
  'city-missouri-kansas-city':
    'A ground-level logistics corridor at dusk: rail yards and rows of distribution warehouses beside an interstate over rolling plains, steel-and-amber tones, no prominent skyline.',
  // Tier B — skyline-led, foreground carries the distinction
  'city-texas-dallas':
    'A multi-level stacked highway interchange (five-level stack) in the foreground at dusk, the city skyline a distant silhouette beyond a flat plains horizon, warm amber light.',
  'city-illinois-chicago':
    'An industrial rail and freight corridor along a lakefront at blue hour, the city skyline a cold-steel silhouette in the far distance, gray-blue Great Lakes tones, colder palette.',
  'city-georgia-atlanta':
    'A busy multi-lane perimeter-interstate interchange at dusk threading through a dense pine treeline, the city skyline a distant silhouette above the trees, humid warm light.',
  'city-new-york-new-york-city':
    'A major bridge truck-approach span in the foreground at dusk crossing a wide river, the distant city skyline a silhouette beyond, steel-blue river reflections, no readable signage.',
  'city-pennsylvania-philadelphia':
    'A Delaware-River industrial port and refinery corridor at dusk with an interstate alongside, the city skyline a small distant silhouette, amber industrial glow.',
};

const titleize = (slug: string) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function promptFor(basename: string): string {
  let scene: string;
  if (FIXED_SCENE[basename]) {
    scene = FIXED_SCENE[basename];
  } else if (basename.startsWith('accident-header-')) {
    const slug = basename.replace('accident-header-', '');
    scene = `A cinematic highway setting illustrating the mechanism of a ${titleize(slug)} truck accident WITHOUT depicting a crash or victims: ${ACCIDENT_SCENE[slug] ?? 'an empty interstate at dusk'}.`;
  } else if (basename.startsWith('state-')) {
    const st = titleize(basename.replace('state-', ''));
    scene = `A signature interstate or freight corridor of ${st} at golden hour, wide cinematic landscape, freight trucks at a distance.`;
  } else if (CITY_SCENE[basename]) {
    scene = CITY_SCENE[basename]; // approved P4 city — explicit, no slug parsing
  } else if (basename.startsWith('city-')) {
    const rest = basename.replace('city-', '').split('-');
    const city = titleize(rest.slice(1).join('-'));
    scene = `A ${city} metro freight artery / beltway at dusk, a recognizable skyline silhouette at a distance.`;
  } else {
    scene = 'A wide cinematic interstate at dusk with freight trucks at a distance.';
  }
  return `${BASE_PROMPT} ${scene} ${NEGATIVE}`;
}

const DEFAULT_SET = [
  'hero-interstate',
  'network-corridor',
  'evidence-records',
  'state-texas',
  'city-texas-houston',
  'accident-header-jackknife-accidents',
];

function loadFalKey(): string | undefined {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const envLocal = join(process.cwd(), '.env.local');
  if (existsSync(envLocal)) {
    const line = readFileSync(envLocal, 'utf8').split('\n').find((l) => l.trim().startsWith('FAL_KEY='));
    if (line) return line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
  }
  return undefined;
}

function extFromContentType(ct: string | null): string {
  if (!ct) return 'jpg';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('png')) return 'png';
  return 'jpg';
}

async function main() {
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf('--only');
  const targets = onlyIdx >= 0 && args[onlyIdx + 1] ? args[onlyIdx + 1].split(',').map((s) => s.trim()) : DEFAULT_SET;

  // Dry run: print the exact final prompt(s) and exit BEFORE any key load or fal call.
  // `--list` shows the default catalog; `--dry-run`/`--print` respects `--only`.
  if (args.includes('--list') || args.includes('--dry-run') || args.includes('--print')) {
    const toShow = args.includes('--list') && onlyIdx < 0 ? DEFAULT_SET : targets;
    console.log('DRY RUN — no fal.ai call, no FAL_KEY read, no images written. (basename → final prompt)');
    toShow.forEach((b) => console.log(`\n• ${b}\n  ${promptFor(b)}`));
    console.log(`\n[dry-run] ${toShow.length} prompt(s) printed. No API call made, nothing generated.`);
    return;
  }

  const FAL_KEY = loadFalKey();
  if (!FAL_KEY) {
    console.error(
      '[generate-brand-images] FAL_KEY not found (checked process.env and ./.env.local). ' +
        'No images generated, nothing faked. Set FAL_KEY in the environment or in trucking-redesign/.env.local.'
    );
    process.exit(1);
  }
  fal.config({ credentials: FAL_KEY });

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  for (const base of targets) {
    const prompt = promptFor(base);
    try {
      console.log(`[generate] ${base} …`);
      const result = await fal.subscribe(FAL_MODEL, {
        input: { prompt, image_size: IMAGE_SIZE, num_images: 1, enable_safety_checker: true },
      });
      const images = (result.data as { images?: { url: string; content_type?: string }[] }).images;
      const img = images?.[0];
      if (!img?.url) {
        console.warn(`  ✗ ${base}: fal returned no image`);
        continue;
      }
      const resp = await fetch(img.url);
      if (!resp.ok) {
        console.warn(`  ✗ ${base}: download ${resp.status}`);
        continue;
      }
      const ext = extFromContentType(img.content_type ?? resp.headers.get('content-type'));
      const buf = Buffer.from(await resp.arrayBuffer());
      const out = join(OUT_DIR, `${base}.${ext}`);
      writeFileSync(out, buf);
      console.log(`  ✓ ${base} → public/brand/photo/${base}.${ext} (${Math.round(buf.length / 1024)} KB)`);
      ok++;
    } catch (err) {
      console.warn(`  ✗ ${base}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  console.log(`\n[generate-brand-images] ${ok}/${targets.length} generated. Run "npm run build" to wire them.`);
}

main();
