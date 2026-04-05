import type { ThemeKey, DimensionWeights } from "../types";

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
    key: "bohemian_wedding",
    query: "boho wedding aisle arch flowers chairs ceremony setup no people",
    label: "Boho",
    dimensions: {
      naturaleza: 0.7,
      tradicional: 0.0,
      romantico: 0.5,
      moderno: 0.1,
      luxuoso: 0.1,
    },
  },
  {
    key: "classic_ballroom_wedding",
    query:
      "ballroom wedding reception hall tables chandelier floral aisle decor",
    label: "Clássico",
    dimensions: {
      naturaleza: 0.0,
      tradicional: 0.9,
      romantico: 0.4,
      moderno: 0.1,
      luxuoso: 0.7,
    },
  },
  {
    key: "rustic_barn_wedding",
    query:
      "rustic barn wedding aisle wooden chairs flowers arch ceremony setup",
    label: "Rústico",
    dimensions: {
      naturaleza: 0.5,
      tradicional: 0.3,
      romantico: 0.3,
      moderno: 0.0,
      luxuoso: 0.0,
    },
  },
  {
    key: "beach_destination_wedding",
    query: "beach wedding aisle arch chairs flowers ceremony setup ocean",
    label: "Praia",
    dimensions: {
      naturaleza: 0.6,
      tradicional: 0.1,
      romantico: 0.5,
      moderno: 0.2,
      luxuoso: 0.3,
    },
  },
  {
    key: "garden_floral_wedding",
    query: "garden wedding floral arch aisle roses ceremony decoration setup",
    label: "Jardim",
    dimensions: {
      naturaleza: 0.6,
      tradicional: 0.2,
      romantico: 0.8,
      moderno: 0.0,
      luxuoso: 0.2,
    },
  },
  {
    key: "minimalist_modern_wedding",
    query: "minimalist wedding aisle clean arch white flowers ceremony setup",
    label: "Moderno",
    dimensions: {
      naturaleza: 0.0,
      tradicional: 0.1,
      romantico: 0.2,
      moderno: 1.0,
      luxuoso: 0.3,
    },
  },
  {
    key: "forest_elopement",
    query: "forest woodland wedding aisle arch greenery ceremony decoration",
    label: "Floresta",
    dimensions: {
      naturaleza: 0.9,
      tradicional: 0.0,
      romantico: 0.4,
      moderno: 0.1,
      luxuoso: 0.0,
    },
  },
  {
    key: "luxury_glamour_wedding",
    query:
      "luxury wedding reception hall aisle chandelier grand floral arch opulent",
    label: "Luxo",
    dimensions: {
      naturaleza: 0.0,
      tradicional: 0.4,
      romantico: 0.3,
      moderno: 0.2,
      luxuoso: 1.0,
    },
  },
  {
    key: "vintage_retro_wedding",
    query: "vintage wedding ceremony aisle arch antique decor flowers chairs",
    label: "Vintage",
    dimensions: {
      naturaleza: 0.1,
      tradicional: 0.7,
      romantico: 0.6,
      moderno: 0.0,
      luxuoso: 0.4,
    },
  },
  {
    key: "tropical_destination_wedding",
    query: "tropical wedding aisle arch palm flowers outdoor ceremony setup",
    label: "Tropical",
    dimensions: {
      naturaleza: 0.6,
      tradicional: 0.0,
      romantico: 0.4,
      moderno: 0.2,
      luxuoso: 0.4,
    },
  },
  {
    key: "industrial_urban_wedding",
    query: "industrial loft wedding aisle arch Edison lights ceremony decor",
    label: "Urbano",
    dimensions: {
      naturaleza: 0.0,
      tradicional: 0.0,
      romantico: 0.1,
      moderno: 0.9,
      luxuoso: 0.2,
    },
  },
  {
    key: "fairytale_castle_wedding",
    query: "castle wedding ceremony hall aisle arch chandelier floral elegant",
    label: "Conto de Fadas",
    dimensions: {
      naturaleza: 0.2,
      tradicional: 0.6,
      romantico: 0.9,
      moderno: 0.0,
      luxuoso: 0.8,
    },
  },
  {
    key: "casamento_brasileiro",
    query: "casamento corredor flores arch cerimônia decoração cadeiras salão",
    label: "Brasileiro",
    dimensions: {
      naturaleza: 0.3,
      tradicional: 0.5,
      romantico: 0.7,
      moderno: 0.2,
      luxuoso: 0.3,
    },
  },
  {
    key: "casamento_campo_brasil",
    query: "casamento fazenda campo corredor flores arch cerimônia outdoor",
    label: "Campo",
    dimensions: {
      naturaleza: 0.6,
      tradicional: 0.3,
      romantico: 0.4,
      moderno: 0.0,
      luxuoso: 0.1,
    },
  },
  {
    key: "intimate_elopement",
    query: "intimate wedding garden aisle arch flowers ceremony chairs setup",
    label: "Íntimo",
    dimensions: {
      naturaleza: 0.3,
      tradicional: 0.2,
      romantico: 0.7,
      moderno: 0.3,
      luxuoso: 0.0,
    },
  },
  {
    key: "outdoor_reception_dinner",
    query:
      "outdoor wedding dinner reception long table candles string lights evening",
    label: "Jantar ao Ar Livre",
    dimensions: {
      naturaleza: 0.6,
      tradicional: 0.1,
      romantico: 0.7,
      moderno: 0.3,
      luxuoso: 0.2,
    },
  },
  {
    key: "long_table_reception",
    query:
      "wedding long table reception dinner setup flowers candles decoration chairs",
    label: "Mesa Longa",
    dimensions: {
      naturaleza: 0.3,
      tradicional: 0.3,
      romantico: 0.5,
      moderno: 0.4,
      luxuoso: 0.3,
    },
  },
  {
    key: "casual_garden_party",
    query:
      "casual garden party wedding reception outdoor tables lawn relaxed decoration",
    label: "Festa no Jardim",
    dimensions: {
      naturaleza: 0.7,
      tradicional: 0.0,
      romantico: 0.4,
      moderno: 0.3,
      luxuoso: 0.0,
    },
  },
];

export const THEME_MAP = Object.fromEntries(
  THEMES.map((t) => [t.key, t]),
) as Record<ThemeKey, ThemeConfig>;
