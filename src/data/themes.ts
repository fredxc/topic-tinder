import type { ThemeKey, DimensionWeights } from '../types'

export interface ThemeConfig {
  key: ThemeKey;
  query: string;
  label: string;
  dimensions: DimensionWeights;
}

/**
 * Each dimension is scored 0–1. Weights reflect how strongly a theme
 * expresses each aesthetic quality. Values can exceed 1.0 across dimensions
 * since they represent independent axes (not a probability distribution).
 */
export const THEMES: ThemeConfig[] = [
  {
    key: 'bohemian_wedding',
    query: 'bohemian boho wedding ceremony outdoor',
    label: 'Boho',
    dimensions: { naturaleza: 0.7, tradicional: 0.0, romantico: 0.5, moderno: 0.1, luxuoso: 0.1 },
  },
  {
    key: 'classic_ballroom_wedding',
    query: 'classic elegant ballroom wedding reception',
    label: 'Clássico',
    dimensions: { naturaleza: 0.0, tradicional: 0.9, romantico: 0.4, moderno: 0.1, luxuoso: 0.7 },
  },
  {
    key: 'rustic_barn_wedding',
    query: 'rustic barn farm wedding decoration',
    label: 'Rústico',
    dimensions: { naturaleza: 0.5, tradicional: 0.3, romantico: 0.3, moderno: 0.0, luxuoso: 0.0 },
  },
  {
    key: 'beach_destination_wedding',
    query: 'beach destination wedding sunset ceremony',
    label: 'Praia',
    dimensions: { naturaleza: 0.6, tradicional: 0.1, romantico: 0.5, moderno: 0.2, luxuoso: 0.3 },
  },
  {
    key: 'garden_floral_wedding',
    query: 'garden floral outdoor wedding romantic flowers',
    label: 'Jardim',
    dimensions: { naturaleza: 0.6, tradicional: 0.2, romantico: 0.8, moderno: 0.0, luxuoso: 0.2 },
  },
  {
    key: 'minimalist_modern_wedding',
    query: 'minimalist modern clean wedding aesthetic',
    label: 'Moderno',
    dimensions: { naturaleza: 0.0, tradicional: 0.1, romantico: 0.2, moderno: 1.0, luxuoso: 0.3 },
  },
  {
    key: 'forest_elopement',
    query: 'forest elopement woodland wedding ceremony',
    label: 'Floresta',
    dimensions: { naturaleza: 0.9, tradicional: 0.0, romantico: 0.4, moderno: 0.1, luxuoso: 0.0 },
  },
  {
    key: 'luxury_glamour_wedding',
    query: 'luxury glamour opulent wedding chandelier grand',
    label: 'Luxo',
    dimensions: { naturaleza: 0.0, tradicional: 0.4, romantico: 0.3, moderno: 0.2, luxuoso: 1.0 },
  },
  {
    key: 'vintage_retro_wedding',
    query: 'vintage retro elegant wedding style',
    label: 'Vintage',
    dimensions: { naturaleza: 0.1, tradicional: 0.7, romantico: 0.6, moderno: 0.0, luxuoso: 0.4 },
  },
  {
    key: 'tropical_destination_wedding',
    query: 'tropical destination wedding palm flowers colorful',
    label: 'Tropical',
    dimensions: { naturaleza: 0.6, tradicional: 0.0, romantico: 0.4, moderno: 0.2, luxuoso: 0.4 },
  },
  {
    key: 'industrial_urban_wedding',
    query: 'industrial loft urban wedding venue modern',
    label: 'Urbano',
    dimensions: { naturaleza: 0.0, tradicional: 0.0, romantico: 0.1, moderno: 0.9, luxuoso: 0.2 },
  },
  {
    key: 'fairytale_castle_wedding',
    query: 'fairytale castle princess wedding romantic',
    label: 'Conto de Fadas',
    dimensions: { naturaleza: 0.2, tradicional: 0.6, romantico: 0.9, moderno: 0.0, luxuoso: 0.8 },
  },
  {
    key: 'casamento_brasileiro',
    query: 'casamento decoração romantica brasil',
    label: 'Brasileiro',
    dimensions: { naturaleza: 0.3, tradicional: 0.5, romantico: 0.7, moderno: 0.2, luxuoso: 0.3 },
  },
  {
    key: 'casamento_campo_brasil',
    query: 'casamento fazenda campo festa brasil',
    label: 'Campo',
    dimensions: { naturaleza: 0.6, tradicional: 0.3, romantico: 0.4, moderno: 0.0, luxuoso: 0.1 },
  },
  {
    key: 'intimate_elopement',
    query: 'intimate small wedding ceremony simple',
    label: 'Íntimo',
    dimensions: { naturaleza: 0.3, tradicional: 0.2, romantico: 0.7, moderno: 0.3, luxuoso: 0.0 },
  },
]

export const THEME_MAP = Object.fromEntries(
  THEMES.map((t) => [t.key, t])
) as Record<ThemeKey, ThemeConfig>
