// Storage utilities for WanderAI
// Uses localStorage for client-side persistence

const STORAGE_KEYS = {
  TRIPS: "wanderai-trips",
  FAVORITES: "wanderai-favorites",
  PREFERENCES: "wanderai-preferences",
  THEME: "wanderai-theme",
} as const;

export interface SavedTrip {
  id: string;
  name: string;
  destination: string;
  departureCity: string;
  budget: number;
  days: number;
  travelers: number;
  interests: string[];
  pace: string;
  createdAt: string;
  plan: unknown;
}

export interface FavoritedDestination {
  id: string;
  name: string;
  favoritedAt: string;
}

export function getSavedTrips(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTrip(trip: SavedTrip): void {
  if (typeof window === "undefined") return;
  const trips = getSavedTrips();
  const existing = trips.findIndex((t) => t.id === trip.id);
  if (existing >= 0) {
    trips[existing] = trip;
  } else {
    trips.unshift(trip);
  }
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
}

export function deleteTrip(id: string): void {
  if (typeof window === "undefined") return;
  const trips = getSavedTrips().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
}

export function getFavorites(): FavoritedDestination[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(dest: FavoritedDestination): boolean {
  if (typeof window === "undefined") return false;
  const favs = getFavorites();
  const existing = favs.findIndex((f) => f.id === dest.id);
  if (existing >= 0) {
    favs.splice(existing, 1);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return false;
  } else {
    favs.push(dest);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return true;
  }
}

export function isFavorited(id: string): boolean {
  const favs = getFavorites();
  return favs.some((f) => f.id === id);
}

export function getStoredPreferences(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function storePreferences(prefs: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
}

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(STORAGE_KEYS.THEME) as "light" | "dark") || "light";
}

export function setTheme(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
