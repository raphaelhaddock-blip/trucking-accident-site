import { AVAILABLE_PHOTOS } from './brand-images.generated';

/**
 * Local pro-image resolver with safe slug-based fallbacks.
 * Visible heroes NEVER fall back to Sanity — they fall back to the command
 * treatment (null) so the page still looks premium with the local brand layer.
 *
 * Expected files under public/brand/photo/ (see docs/PR3-PRO-IMAGE-GENERATION-PACK.md):
 *   hero-interstate.webp            global hero
 *   network-corridor.webp           states index
 *   evidence-records.webp           accidents index
 *   accident-header-{slug}.webp     per accident type
 *   state-{stateSlug}.webp          per state
 *   city-{stateSlug}-{citySlug}.webp per city hub
 */

const PHOTO_BASE = '/brand/photo';
const SITE = 'https://trucking-accident-site.vercel.app';
const OG_DEFAULT = `${SITE}/brand/og-default.png`;

const available = new Set(AVAILABLE_PHOTOS);
const has = (file: string) => available.has(file);

export interface PhotoQuery {
  accidentSlug?: string;
  stateSlug?: string;
  citySlug?: string;
  kind?: 'home' | 'states' | 'accidents' | 'contact' | 'blog';
}

/** Candidate filenames, most specific first, ending at the global hero. */
function candidates(q: PhotoQuery): string[] {
  const c: string[] = [];
  if (q.stateSlug && q.citySlug) c.push(`city-${q.stateSlug}-${q.citySlug}.webp`);
  if (q.stateSlug) c.push(`state-${q.stateSlug}.webp`);
  if (q.accidentSlug) c.push(`accident-header-${q.accidentSlug}.webp`);
  if (q.kind === 'states') c.push('network-corridor.webp');
  if (q.kind === 'accidents') c.push('evidence-records.webp');
  c.push('hero-interstate.webp');
  return c;
}

/**
 * Visible hero photo path, or null. Null → CommandHero renders the pure command
 * treatment (ink + freight-network motif). Never returns a Sanity URL.
 */
export function heroPhoto(q: PhotoQuery = {}): string | null {
  for (const f of candidates(q)) {
    if (has(f)) return `${PHOTO_BASE}/${f}`;
  }
  return null;
}

/**
 * Absolute OG/social image URL. Most-specific local photo if present, otherwise
 * the purpose-built local og-default card. Never returns a Sanity URL.
 */
export function ogImage(q: PhotoQuery = {}): string {
  for (const f of candidates(q)) {
    if (f === 'hero-interstate.webp') break; // prefer the designed og-default over the generic hero for social
    if (has(f)) return `${SITE}${PHOTO_BASE}/${f}`;
  }
  return OG_DEFAULT;
}
