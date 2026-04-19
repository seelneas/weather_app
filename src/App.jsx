import React, { useState, useEffect, useCallback } from 'react';
import useWeather from './hooks/useWeather';
import useGeolocation from './hooks/useGeolocation';
import useFavorites from './hooks/useFavorites';
import DynamicBackground from './components/DynamicBackground';
import SearchBar from './components/SearchBar';
import FavoritesBar from './components/FavoritesBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherMap from './components/WeatherMap';
import SettingsPanel from './components/SettingsPanel';
import { getWeatherInfo } from './utils/weatherCodes';

// Default location: New York City
const DEFAULT_LOCATION = { name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States' };

export default function App() {
  // Settings state
  const [unit, setUnit] = useState(() => localStorage.getItem('skyview_unit') || 'metric');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('skyview_theme') || 'dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Weather & location
  const { weatherData, location, loading, error, isOffline, loadWeather } = useWeather();
  const geo = useGeolocation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Persist settings
  useEffect(() => { localStorage.setItem('skyview_unit', unit); }, [unit]);
  useEffect(() => { localStorage.setItem('skyview_theme', themeMode); }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      
      const handler = (e) => root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      root.setAttribute('data-theme', themeMode);
    }
  }, [themeMode]);

  // Initial load: check URL params first, then try geo, fallback to default
  useEffect(() => {
    if (hasInitialized) return;
    
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lon = params.get('lon');
    
    if (lat && lon) {
      setHasInitialized(true);
      return; // useWeather handles URL params
    }

    // Try to auto-detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadWeather(pos.coords.latitude, pos.coords.longitude);
          setHasInitialized(true);
        },
        () => {
          // Fallback to default
          loadWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, DEFAULT_LOCATION);
          setHasInitialized(true);
        },
        { timeout: 5000 }
      );
    } else {
      loadWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, DEFAULT_LOCATION);
      setHasInitialized(true);
    }
  }, [hasInitialized, loadWeather]);

  // Handle geolocation button
  useEffect(() => {
    if (geo.position) {
      loadWeather(geo.position.latitude, geo.position.longitude);
    }
  }, [geo.position, loadWeather]);

  // Handle location selection from search
  const handleSelectLocation = useCallback((loc) => {
    loadWeather(loc.latitude, loc.longitude, loc);
  }, [loadWeather]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(() => {
    if (!location) return;
    if (isFavorite(location)) {
      removeFavorite(location);
    } else {
      addFavorite({
        ...location,
        currentTemp: weatherData?.current?.temp,
      });
    }
  }, [location, isFavorite, addFavorite, removeFavorite, weatherData]);

  // Handle favorite selection
  const handleFavoriteSelect = useCallback((fav) => {
    loadWeather(fav.latitude, fav.longitude, fav);
  }, [loadWeather]);

  // Determine weather theme for dynamic background
  const weatherTheme = weatherData?.current
    ? getWeatherInfo(weatherData.current.weatherCode, !weatherData.current.isDay).theme
    : 'default';

  // Escape key closes settings
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSettingsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <DynamicBackground theme={weatherTheme} isDay={weatherData?.current?.isDay} />
      
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header__logo">
            <svg className="header__logo-icon" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="16" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
              <path d="M18 8l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" fill="url(#logoGrad)" />
              <circle cx="18" cy="24" r="2" fill="url(#logoGrad)" />
            </svg>
            <h1 className="header__title">SkyView</h1>
          </div>

          <SearchBar
            onSelectLocation={handleSelectLocation}
            onRequestGeo={geo.requestLocation}
            geoLoading={geo.loading}
          />

          <div className="header__actions">
            <button
              className="icon-btn"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
              id="settings-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Favorites */}
        <FavoritesBar
          favorites={favorites}
          activeLocation={location}
          onSelect={handleFavoriteSelect}
          onRemove={removeFavorite}
          unit={unit}
        />

        {/* Banners */}
        {isOffline && (
          <div className="banner banner--offline" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
            </svg>
            You're offline. Showing cached data.
          </div>
        )}

        {error && !isOffline && (
          <div className="banner banner--warning" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {error}
          </div>
        )}

        {geo.error && (
          <div className="banner banner--info" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            {geo.error}. Search for a city above.
          </div>
        )}

        {/* Main Content */}
        {loading && !weatherData ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <span className="loading-text">Fetching weather data...</span>
          </div>
        ) : !weatherData ? (
          <div className="loading-container">
            <svg width="80" height="80" viewBox="0 0 64 64" fill="none" opacity="0.3">
              <circle cx="28" cy="28" r="14" fill="#FBBF24" />
              <path d="M52 42H22c-4.418 0-8-3.582-8-8s3.582-8 8-8h.6C23.59 20.84 28.16 17 34 17c5.053 0 9.33 3.286 10.824 7.84C45.56 24.29 46.26 24 47 24c3.314 0 6 2.686 6 6 0 .34-.028.674-.083 1H52c2.761 0 5 2.239 5 5s-2.239 5-5 5z" fill="#94A3B8" />
            </svg>
            <span className="loading-text" style={{ fontSize: '1.125rem' }}>
              Search for a city to get started
            </span>
          </div>
        ) : (
          <main>
            <CurrentWeather
              data={weatherData}
              location={location}
              unit={unit}
              isFavorite={isFavorite(location)}
              onToggleFavorite={handleToggleFavorite}
            />

            <HourlyForecast hourly={weatherData.hourly} unit={unit} />
            
            <DailyForecast daily={weatherData.daily} unit={unit} />

            <WeatherMap lat={location?.latitude} lon={location?.longitude} />
          </main>
        )}

        {/* Settings */}
        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          unit={unit}
          setUnit={setUnit}
          theme={themeMode}
          setTheme={setThemeMode}
        />
      </div>
    </>
  );
}
