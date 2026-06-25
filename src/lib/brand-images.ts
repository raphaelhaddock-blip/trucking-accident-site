import { AVAILABLE_PHOTOS } from './brand-images.generated';

/**
 * Local pro-image resolver with safe slug-based fallbacks.
 * Visible heroes NEVER fall back to Sanity — they fall back to the command
 * treatment (null) so the page still looks premium with the local brand layer.
 *
 * Resolution is EXTENSION-AGNOSTIC: a candidate is a basename (no extension) and
 * we match any available file with that basename (.webp/.avif/.jpg/.png). So a
 * fal.ai `.jpg` and a hand-made `.webp` both wire the same way.
 *
 * Expected basenames under public/brand/photo/ (see docs/PR3-PRO-IMAGE-GENERATION-PACK.md):
 *   hero-interstate            global hero
 *   network-corridor           states index
 *   evidence-records           accidents index
 *   accident-header-{slug}     per accident type
 *   state-{stateSlug}          per state
 *   city-{stateSlug}-{citySlug} per city hub
 */

const PHOTO_BASE = '/brand/photo';
const SITE = 'https://trucking-accident-site.vercel.app';
const OG_DEFAULT = `${SITE}/brand/og-default.png`;
const EXT_RE = /\.(webp|avif|jpe?g|png)$/i;

const basenameOf = (file: string) => file.replace(EXT_RE, '');

/** Filename (with real extension) for a basename, or null if not present. */
function fileFor(basename: string): string | null {
  return AVAILABLE_PHOTOS.find((f) => basenameOf(f) === basename) ?? null;
}

export interface PhotoQuery {
  accidentSlug?: string;
  stateSlug?: string;
  citySlug?: string;
  kind?: 'home' | 'states' | 'accidents' | 'contact' | 'blog';
}

/** Candidate basenames, most specific first, ending at the global hero. */
function candidates(q: PhotoQuery): string[] {
  const c: string[] = [];
  if (q.stateSlug && q.citySlug) c.push(`city-${q.stateSlug}-${q.citySlug}`);
  if (q.stateSlug) c.push(`state-${q.stateSlug}`);
  if (q.accidentSlug) c.push(`accident-header-${q.accidentSlug}`);
  if (q.kind === 'states') c.push('network-corridor');
  if (q.kind === 'accidents') c.push('evidence-records');
  c.push('hero-interstate');
  return c;
}

/**
 * Visible hero photo path, or null. Null → CommandHero renders the pure command
 * treatment (ink + freight-network motif). Never returns a Sanity URL.
 */
export function heroPhoto(q: PhotoQuery = {}): string | null {
  for (const base of candidates(q)) {
    const file = fileFor(base);
    if (file) return `${PHOTO_BASE}/${file}`;
  }
  return null;
}

/**
 * Absolute OG/social image URL. Most-specific local photo if present, otherwise
 * the purpose-built local og-default card. Never returns a Sanity URL.
 */
export function ogImage(q: PhotoQuery = {}): string {
  for (const base of candidates(q)) {
    if (base === 'hero-interstate') break; // prefer the designed og-default over the generic hero for social
    const file = fileFor(base);
    if (file) return `${SITE}${PHOTO_BASE}/${file}`;
  }
  return OG_DEFAULT;
}
