import type { WeddingPhoto, ThemeKey } from "../types";

const ACCESS_KEY = "607-P9gQlCYNzMXZzARH31b0oYghWsmJu5MGyUpUDjs";
const BASE_URL = "https://api.unsplash.com";

interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  color: string | null;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

interface SearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

function mapPhoto(raw: UnsplashPhoto, themeKey: ThemeKey): WeddingPhoto {
  return {
    id: raw.id,
    url: raw.urls.regular,
    thumbUrl: raw.urls.small,
    dominantColor: raw.color ?? "#f0e6d0",
    altDescription: raw.alt_description ?? "Foto de casamento",
    themeKey,
    photographer: raw.user.name,
    photographerUrl: raw.user.links.html,
  };
}

/** Shuffles an array in-place using Fisher-Yates */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Fetches photos from Unsplash for a given theme query.
 * Returns mapped WeddingPhoto objects.
 */
export async function fetchThemePhotos(
  themeKey: ThemeKey,
  query: string,
  page: number,
  perPage = 8,
): Promise<WeddingPhoto[]> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
    orientation: "portrait",
    content_filter: "high",
  });

  const res = await fetch(`${BASE_URL}/search/photos?${params}`, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Unsplash API error: ${res.status}`);
  }

  const data: SearchResponse = await res.json();
  return data.results.map((p) => mapPhoto(p, themeKey));
}

/**
 * Fetches one photo from each of the given queries for the vision board.
 * Returns up to `queries.length` photos.
 */
export async function fetchVisionBoardPhotos(
  queries: string[],
): Promise<WeddingPhoto[]> {
  const results = await Promise.allSettled(
    queries.map((q) => fetchThemePhotos("romantic" as ThemeKey, q, 1, 2)),
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<WeddingPhoto[]> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value[0])
    .filter(Boolean);
}
