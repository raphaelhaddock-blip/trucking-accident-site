/**
 * Similarity Module - Detect duplicate/similar content using fingerprinting
 */

/**
 * Generate n-grams from text
 */
export function generateNgrams(text: string, n: number = 3): string[] {
  const words = text.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }

  return ngrams;
}

/**
 * Generate shingles (character-level n-grams)
 */
export function generateShingles(text: string, k: number = 5): Set<string> {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const shingles = new Set<string>();

  for (let i = 0; i <= normalized.length - k; i++) {
    shingles.add(normalized.substring(i, i + k));
  }

  return shingles;
}

/**
 * Calculate Jaccard similarity between two sets
 */
export function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Simple hash function for strings
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate MinHash signature for a set of shingles
 */
export function generateMinHash(shingles: Set<string>, numHashes: number = 100): number[] {
  const signature: number[] = new Array(numHashes).fill(Number.MAX_SAFE_INTEGER);

  for (const shingle of shingles) {
    for (let i = 0; i < numHashes; i++) {
      // Use different hash functions by adding i to the shingle
      const hash = hashString(shingle + i.toString());
      if (hash < signature[i]) {
        signature[i] = hash;
      }
    }
  }

  return signature;
}

/**
 * Estimate Jaccard similarity from MinHash signatures
 */
export function estimateSimilarity(sig1: number[], sig2: number[]): number {
  if (sig1.length !== sig2.length) {
    throw new Error('Signatures must have the same length');
  }

  let matches = 0;
  for (let i = 0; i < sig1.length; i++) {
    if (sig1[i] === sig2[i]) {
      matches++;
    }
  }

  return matches / sig1.length;
}

/**
 * Content fingerprint for fast similarity comparison
 */
export interface ContentFingerprint {
  url: string;
  shingleCount: number;
  minHashSignature: number[];
  wordCount: number;
}

/**
 * Generate fingerprint for a piece of content
 */
export function generateFingerprint(text: string, url: string): ContentFingerprint {
  const shingles = generateShingles(text, 5);
  const signature = generateMinHash(shingles);
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  return {
    url,
    shingleCount: shingles.size,
    minHashSignature: signature,
    wordCount,
  };
}

/**
 * Find similar content pairs from a list of fingerprints
 */
export function findSimilarPairs(
  fingerprints: ContentFingerprint[],
  threshold: number = 0.3
): Array<{ url1: string; url2: string; similarity: number }> {
  const pairs: Array<{ url1: string; url2: string; similarity: number }> = [];

  for (let i = 0; i < fingerprints.length; i++) {
    for (let j = i + 1; j < fingerprints.length; j++) {
      const similarity = estimateSimilarity(
        fingerprints[i].minHashSignature,
        fingerprints[j].minHashSignature
      );

      if (similarity >= threshold) {
        pairs.push({
          url1: fingerprints[i].url,
          url2: fingerprints[j].url,
          similarity,
        });
      }
    }
  }

  return pairs.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Find repeated phrases across texts
 */
export function findRepeatedPhrases(
  texts: Array<{ url: string; text: string }>,
  minLength: number = 50
): Array<{ phrase: string; urls: string[] }> {
  const phraseToUrls = new Map<string, Set<string>>();

  for (const { url, text } of texts) {
    // Extract sentences
    const sentences = text.split(/[.!?]+/)
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length >= minLength);

    for (const sentence of sentences) {
      if (!phraseToUrls.has(sentence)) {
        phraseToUrls.set(sentence, new Set());
      }
      phraseToUrls.get(sentence)!.add(url);
    }
  }

  // Find phrases that appear in multiple documents
  const repeated: Array<{ phrase: string; urls: string[] }> = [];
  for (const [phrase, urls] of phraseToUrls) {
    if (urls.size > 1) {
      repeated.push({ phrase, urls: [...urls] });
    }
  }

  return repeated.sort((a, b) => b.urls.length - a.urls.length);
}

/**
 * Calculate overall content similarity between two texts
 */
export function calculateContentSimilarity(text1: string, text2: string): number {
  const shingles1 = generateShingles(text1);
  const shingles2 = generateShingles(text2);
  return jaccardSimilarity(shingles1, shingles2);
}
