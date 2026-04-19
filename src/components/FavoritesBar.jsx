import React from 'react';
import { formatTemp } from '../utils/units';

/**
 * Favorites bar showing saved locations as chips
 */
export default function FavoritesBar({ favorites, activeLocation, onSelect, onRemove, unit }) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <nav className="favorites-bar" aria-label="Favorite locations">
      {favorites.map((fav, idx) => {
        const isActive = activeLocation &&
          Math.abs(fav.latitude - activeLocation.latitude) < 0.01 &&
          Math.abs(fav.longitude - activeLocation.longitude) < 0.01;

        return (
          <button
            key={`${fav.latitude}-${fav.longitude}-${idx}`}
            className={`favorite-chip ${isActive ? 'favorite-chip--active' : ''}`}
            onClick={() => onSelect(fav)}
            aria-label={`View weather for ${fav.name}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{fav.name}</span>
            {fav.currentTemp !== undefined && (
              <span className="favorite-chip__temp">{formatTemp(fav.currentTemp, unit)}</span>
            )}
            <span
              className="favorite-chip__remove"
              onClick={(e) => { e.stopPropagation(); onRemove(fav); }}
              role="button"
              aria-label={`Remove ${fav.name} from favorites`}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onRemove(fav); } }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
