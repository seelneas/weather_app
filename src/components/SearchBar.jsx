import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchLocations } from '../services/weatherApi';

/**
 * Search bar with autocomplete and debouncing
 * Supports city name search and current location
 */
export default function SearchBar({ onSelectLocation, onRequestGeo, geoLoading }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setSearching(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(data.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback((location) => {
    onSelectLocation(location);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    inputRef.current?.blur();
  }, [onSelectLocation]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'Enter' && query.trim().length >= 2) {
        // Trigger search
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, activeIndex, results, handleSelect, query]);

  return (
    <div className="search-container" role="search">
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          id="search-input"
          className="search-input"
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search for a city"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          autoComplete="off"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-dropdown" ref={dropdownRef} role="listbox">
          <button className="search-dropdown__geolocate" onClick={onRequestGeo} disabled={geoLoading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            {geoLoading ? 'Locating...' : 'Use current location'}
          </button>
          {results.map((loc, idx) => (
            <div
              key={loc.id}
              className={`search-dropdown__item ${idx === activeIndex ? 'search-dropdown__item--active' : ''}`}
              onClick={() => handleSelect(loc)}
              role="option"
              aria-selected={idx === activeIndex}
            >
              <svg className="search-dropdown__item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <span className="search-dropdown__item-name">{loc.name}</span>{' '}
                <span className="search-dropdown__item-region">
                  {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
