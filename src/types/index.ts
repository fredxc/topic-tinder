export type ThemeKey =
  | 'bohemian_wedding'
  | 'classic_ballroom_wedding'
  | 'rustic_barn_wedding'
  | 'beach_destination_wedding'
  | 'garden_floral_wedding'
  | 'minimalist_modern_wedding'
  | 'forest_elopement'
  | 'luxury_glamour_wedding'
  | 'vintage_retro_wedding'
  | 'tropical_destination_wedding'
  | 'industrial_urban_wedding'
  | 'fairytale_castle_wedding'
  | 'casamento_brasileiro'
  | 'casamento_campo_brasil'
  | 'intimate_elopement';

/** Five aesthetic dimensions used by the classifier */
export interface DimensionWeights {
  naturaleza: number;   // outdoor, organic, earthy, nature
  tradicional: number;  // formal, classic, church, structured
  romantico: number;    // soft, floral, dreamy, emotional
  moderno: number;      // clean, minimal, contemporary, geometric
  luxuoso: number;      // opulent, glamorous, grand, expensive
}

export interface WeddingPhoto {
  id: string;
  url: string;
  thumbUrl: string;
  dominantColor: string;
  altDescription: string;
  themeKey: ThemeKey;
  photographer: string;
  photographerUrl: string;
}

export type SwipeDirection = 'like' | 'dislike';

export interface SwipeRecord {
  photo: WeddingPhoto;
  direction: SwipeDirection;
  timestamp: number;
}

export interface ColorSwatch {
  hex: string;
  name: string;
}

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  description: string;
  fingerprint: DimensionWeights;
  characteristics: string[];
  palette: ColorSwatch[];
  budgetRange: string;
  venueTypes: string[];
  flowerSuggestions: string[];
  visionBoardQueries: string[];
}

export interface WeddingProfile {
  archetype: Archetype;
  secondaryArchetype?: Archetype;
  isHybrid: boolean;
  hybridName?: string;
  scores: DimensionWeights;
  normalizedScores: DimensionWeights;
  likedPhotos: WeddingPhoto[];
  totalSwipes: number;
}

export type AppPhase = 'loading' | 'swiping' | 'result';

export interface AppState {
  phase: AppPhase;
  queue: WeddingPhoto[];
  history: SwipeRecord[];
  themeIndex: number;
  pageByTheme: Record<ThemeKey, number>;
  isFetching: boolean;
  fetchError: string | null;
  isHistoryOpen: boolean;
  isMenuOpen: boolean;
  profile: WeddingProfile | null;
}
