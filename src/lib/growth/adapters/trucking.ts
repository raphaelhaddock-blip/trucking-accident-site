/**
 * Growth OS — trucking adapter (PR12 foundation).
 *
 * Implements SiteAdapter using ONLY real repo/route metadata: it enumerates the existing content
 * modules and derives word/FAQ counts from their prose. It connects NO analytics or CRM, so
 * performance() and leads() return []. duplicateMap() reuses the real output of the existing
 * `audit:quality` (scripts/reports/quality-audit.json) when present.
 *
 * It never imports/executes the content modules (which would pull in 1,600+ files) — it reads the
 * source text and extracts prose from string/template literals, a deterministic structural proxy.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type {
  ContentItem, DuplicateStatus, LeadOutcome, PerformanceEvent, RouteKind, SiteAdapter, SiteConfig,
} from '../types';

const ROOT = process.cwd();
const QUALITY_REPORT = join(ROOT, 'scripts/reports/quality-audit.json');
const NEAR_DUP_SIM = 0.9;

/** Extract prose from double-quoted and backtick string literals, then count word tokens. */
function proseWordCount(src: string): number {
  const chunks = src.match(/`[^`]*`|"(?:[^"\\]|\\.)*"/g) ?? [];
  const prose = chunks.join(' ');
  return (prose.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).length;
}

function metaFor(filePath: string): { wordCount: number; faqCount: number; title?: string } {
  const src = readFileSync(filePath, 'utf8');
  const faqCount = (src.match(/"question"\s*:/g) ?? []).length;
  const title = src.match(/(?:metaTitle|title|h1)\s*:\s*["'`]([^"'`]{3,120})/)?.[1];
  return { wordCount: proseWordCount(src), faqCount, title };
}

function tsFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...tsFiles(join(dir, e.name)));
    else if (e.name.endsWith('.ts') && e.name !== 'index.ts') out.push(join(dir, e.name));
  }
  return out;
}

function rel(p: string): string {
  return p.replace(`${ROOT}/`, '');
}

export function truckingAdapter(): SiteAdapter {
  const config = (): SiteConfig => ({
    siteId: 'trucking-accident-site',
    niche: 'trucking-accident',
    domain: 'trucking-accident-site.vercel.app',
    routeKinds: ['state', 'city', 'accident-type', 'blog'],
    qualityGates: ['audit:legaltone', 'audit:quality', 'audit:localdata', 'audit:damage'],
    approvalRequired: true,
  });

  const listContent = (): ContentItem[] => {
    const items: ContentItem[] = [];
    const add = (filePath: string, kind: RouteKind, id: string, route: string) => {
      const { wordCount, faqCount, title } = metaFor(filePath);
      items.push({ id, kind, route, filePath: rel(filePath), title, wordCount, faqCount, source: 'repo-metadata' });
    };

    // Cities: src/lib/cities-content/<state>/<city>.ts → /states/<state>/<city>
    for (const f of tsFiles(join(ROOT, 'src/lib/cities-content'))) {
      const slug = rel(f).replace('src/lib/cities-content/', '').replace(/\.ts$/, '');
      if (!slug.includes('/')) continue; // skip top-level helpers
      add(f, 'city', `city:${slug}`, `/states/${slug}`);
    }
    // States: src/lib/states-content/<state>.ts → /states/<state>
    for (const f of tsFiles(join(ROOT, 'src/lib/states-content'))) {
      const slug = rel(f).replace('src/lib/states-content/', '').replace(/\.ts$/, '');
      add(f, 'state', `state:${slug}`, `/states/${slug}`);
    }
    // Accident types: src/lib/accidents-content/<slug>.ts → /accidents/<slug>
    for (const f of tsFiles(join(ROOT, 'src/lib/accidents-content'))) {
      const slug = rel(f).replace('src/lib/accidents-content/', '').replace(/\.ts$/, '');
      add(f, 'accident-type', `accident:${slug}`, `/accidents/${slug}`);
    }
    // Blog: src/lib/blog-content/<slug>.ts → /blog/<slug>
    for (const f of tsFiles(join(ROOT, 'src/lib/blog-content'))) {
      const slug = rel(f).replace('src/lib/blog-content/', '').replace(/\.ts$/, '');
      add(f, 'blog', `blog:${slug}`, `/blog/${slug}`);
    }
    return items;
  };

  // No analytics/CRM connected in the foundation — empty by design, never fabricated.
  const performance = (): PerformanceEvent[] => [];
  const leads = (): LeadOutcome[] => [];

  // Reuse the real duplicate audit when present; otherwise everything is 'unknown'.
  const duplicateMap = (): Record<string, DuplicateStatus> => {
    if (!existsSync(QUALITY_REPORT)) return {};
    const map: Record<string, DuplicateStatus> = {};
    try {
      const report = JSON.parse(readFileSync(QUALITY_REPORT, 'utf8')) as {
        worstRenderedPairs?: Array<{ a: string; b: string; sim: number }>;
        worstDeadPairs?: Array<{ a: string; b: string; sim: number }>;
      };
      for (const pair of [...(report.worstRenderedPairs ?? []), ...(report.worstDeadPairs ?? [])]) {
        if (pair.sim >= NEAR_DUP_SIM) {
          map[`city:${pair.a}`] = 'near-duplicate';
          map[`city:${pair.b}`] = 'near-duplicate';
        }
      }
    } catch {
      return {}; // unrecognised shape → treat as no duplicate data, never crash the report
    }
    return map;
  };

  return { config, listContent, performance, leads, duplicateMap };
}
