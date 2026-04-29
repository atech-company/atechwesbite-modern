const FAVORITES_KEY = "atech_favorite_projects";

type FavoriteMap = Record<string, string[]>;

function readMap(): FavoriteMap {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as FavoriteMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: FavoriteMap) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(map));
}

export function getFavorites(userId: string): string[] {
  return readMap()[userId] ?? [];
}

export function toggleFavorite(userId: string, slug: string): string[] {
  const map = readMap();
  const current = new Set(map[userId] ?? []);
  if (current.has(slug)) current.delete(slug);
  else current.add(slug);
  map[userId] = Array.from(current);
  writeMap(map);
  return map[userId];
}

export function isFavorite(userId: string, slug: string): boolean {
  return getFavorites(userId).includes(slug);
}
