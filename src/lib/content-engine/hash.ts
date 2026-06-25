/**
 * Deterministic hashing + variant selection (no Math.random — reproducible builds).
 */
export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Pick an index in [0, poolSize) deterministically from a seed + salt. */
export function selectIndex(seed: string, salt: string, poolSize: number): number {
  if (poolSize <= 0) return 0;
  return fnv1a(`${seed}::${salt}`) % poolSize;
}

/**
 * Pick `count` distinct indices from a pool, deterministically, in a stable order.
 * Used for FAQ subset selection so each city gets a different mix.
 */
export function selectDistinct(seed: string, salt: string, poolSize: number, count: number): number[] {
  const n = Math.min(count, poolSize);
  const out: number[] = [];
  let cursor = fnv1a(`${seed}::${salt}`);
  const used = new Set<number>();
  let guard = 0;
  while (out.length < n && guard < poolSize * 4) {
    const idx = cursor % poolSize;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(idx);
    }
    cursor = fnv1a(`${cursor}:${salt}`);
    guard++;
  }
  return out;
}
