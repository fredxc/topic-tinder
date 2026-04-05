import type { SwipeRecord, DimensionWeights, WeddingProfile, Archetype } from '../types'
import { THEME_MAP } from '../data/themes'
import { ARCHETYPES } from '../data/archetypes'

const DIMENSIONS: (keyof DimensionWeights)[] = [
  'naturaleza',
  'tradicional',
  'romantico',
  'moderno',
  'luxuoso',
]

function dot(a: DimensionWeights, b: DimensionWeights): number {
  return DIMENSIONS.reduce((sum, d) => sum + a[d] * b[d], 0)
}

function magnitude(v: DimensionWeights): number {
  return Math.sqrt(DIMENSIONS.reduce((sum, d) => sum + v[d] ** 2, 0))
}

/** Cosine similarity between two dimension vectors (0–1) */
function cosineSimilarity(a: DimensionWeights, b: DimensionWeights): number {
  const mag = magnitude(a) * magnitude(b)
  if (mag === 0) return 0
  return dot(a, b) / mag
}

function zeroDimensions(): DimensionWeights {
  return { naturaleza: 0, tradicional: 0, romantico: 0, moderno: 0, luxuoso: 0 }
}

function normalizeDimensions(raw: DimensionWeights): DimensionWeights {
  const total = DIMENSIONS.reduce((s, d) => s + raw[d], 0)
  if (total === 0) return { naturaleza: 0.2, tradicional: 0.2, romantico: 0.2, moderno: 0.2, luxuoso: 0.2 }
  return Object.fromEntries(DIMENSIONS.map((d) => [d, raw[d] / total])) as DimensionWeights
}

/**
 * Generates a WeddingProfile from the user's swipe history.
 *
 * Scoring:
 *  - Like:    +1.0 × theme dimension weights
 *  - Dislike: −0.4 × theme dimension weights (dislikes matter, but less)
 *
 * After accumulation, scores are L1-normalized, then compared to archetype
 * fingerprints via cosine similarity. The top match (and optionally second)
 * determine the archetype.
 */
export function generateProfile(history: SwipeRecord[]): WeddingProfile {
  const rawScores = zeroDimensions()

  for (const { photo, direction } of history) {
    const themeConfig = THEME_MAP[photo.themeKey]
    if (!themeConfig) continue

    const weight = direction === 'like' ? 1.0 : -0.4
    for (const dim of DIMENSIONS) {
      rawScores[dim] += weight * themeConfig.dimensions[dim]
    }
  }

  // Floor at 0 — only keep positive signal for normalization
  const floored = Object.fromEntries(
    DIMENSIONS.map((d) => [d, Math.max(0, rawScores[d])])
  ) as DimensionWeights

  const normalizedScores = normalizeDimensions(floored)

  // Score each archetype
  const scored = ARCHETYPES.map((archetype) => ({
    archetype,
    similarity: cosineSimilarity(normalizedScores, archetype.fingerprint),
  })).sort((a, b) => b.similarity - a.similarity)

  const primary = scored[0]!
  const secondary = scored[1]!

  // Hybrid if the top two are within 0.12 cosine distance
  const isHybrid = secondary.similarity > 0 && primary.similarity - secondary.similarity < 0.12

  let hybridName: string | undefined
  if (isHybrid) {
    hybridName = buildHybridName(primary.archetype, secondary.archetype)
  }

  const likedPhotos = history
    .filter((s) => s.direction === 'like')
    .map((s) => s.photo)

  return {
    archetype: primary.archetype,
    secondaryArchetype: isHybrid ? secondary.archetype : undefined,
    isHybrid,
    hybridName,
    scores: rawScores,
    normalizedScores,
    likedPhotos,
    totalSwipes: history.length,
  }
}

function buildHybridName(primary: Archetype, secondary: Archetype): string {
  // Map archetype id → short adjective for hybrid name
  const ADJ: Record<string, string> = {
    romantica_classica:    'Romântica',
    noiva_boemia:          'Boêmia',
    princesa_luxo:         'Luxuosa',
    filha_da_natureza:     'Natural',
    contemporanea:         'Contemporânea',
    viajante_apaixonada:   'Viajante',
    vintage_encantada:     'Vintage',
    brasileira_apaixonada: 'Brasileira',
  }

  const p = ADJ[primary.id] ?? 'Encantada'
  const s = ADJ[secondary.id] ?? 'Única'
  return `A ${p} & ${s}`
}

/** Returns a 0-100 percentage breakdown of dimension scores */
export function dimensionBreakdown(scores: DimensionWeights): Record<keyof DimensionWeights, number> {
  const normalized = normalizeDimensions(
    Object.fromEntries(DIMENSIONS.map((d) => [d, Math.max(0, scores[d])])) as DimensionWeights
  )
  return Object.fromEntries(
    DIMENSIONS.map((d) => [d, Math.round(normalized[d] * 100)])
  ) as Record<keyof DimensionWeights, number>
}

export const DIMENSION_LABELS: Record<keyof DimensionWeights, string> = {
  naturaleza:  'Natureza',
  tradicional: 'Tradicional',
  romantico:   'Romântico',
  moderno:     'Moderno',
  luxuoso:     'Luxuoso',
}

export const DIMENSION_ICONS: Record<keyof DimensionWeights, string> = {
  naturaleza:  '🌿',
  tradicional: '⛪',
  romantico:   '🌹',
  moderno:     '✨',
  luxuoso:     '👑',
}
