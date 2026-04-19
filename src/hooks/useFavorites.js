import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'skyview_favorites';
const MAX_FAVORITES = 5;

/**
 * Hook to manage favorite locations stored in localStorage
 */
export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      // Storage full or unavailable
    }
  }, [favorites]);

  const addFavorite = useCallback((location) => {
    setFavorites(prev => {
      // Prevent duplicates by lat/lon
      const exists = prev.some(
        f => Math.abs(f.latitude - location.latitude) < 0.01 &&
             Math.abs(f.longitude - location.longitude) < 0.01
      );
      if (exists) return prev;
      if (prev.length >= MAX_FAVORITES) {
        // Remove oldest
        return [...prev.slice(1), location];
      }
      return [...prev, location];
    });
  }, []);

  const removeFavorite = useCallback((location) => {
    setFavorites(prev =>
      prev.filter(
        f => !(Math.abs(f.latitude - location.latitude) < 0.01 &&
               Math.abs(f.longitude - location.longitude) < 0.01)
      )
    );
  }, []);

  const isFavorite = useCallback((location) => {
    if (!location) return false;
    return favorites.some(
      f => Math.abs(f.latitude - location.latitude) < 0.01 &&
           Math.abs(f.longitude - location.longitude) < 0.01
    );
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
