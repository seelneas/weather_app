import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeather, fetchAirQuality, parseWeatherData, reverseGeocode } from '../services/weatherApi';

/**
 * Main hook for fetching and managing weather data
 */
export default function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const refreshTimerRef = useRef(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadWeather = useCallback(async (lat, lon, locationInfo = null) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch weather and air quality in parallel
      const [weather, airQuality] = await Promise.all([
        fetchWeather(lat, lon),
        fetchAirQuality(lat, lon).catch(() => null), // AQI is non-critical
      ]);

      const parsed = parseWeatherData(weather, airQuality);
      setWeatherData(parsed);

      // If cached, show a warning
      if (parsed._cached) {
        const cachedAgo = Math.round((Date.now() - parsed._cachedAt) / 60000);
        setError(`Showing cached data from ${cachedAgo} minutes ago`);
      }

      // Resolve location name if not provided
      if (locationInfo) {
        setLocation(locationInfo);
      } else {
        const loc = await reverseGeocode(lat, lon);
        setLocation(loc);
      }

      // Update URL query params
      const url = new URL(window.location);
      if (locationInfo?.name) {
        url.searchParams.set('city', locationInfo.name);
      }
      url.searchParams.set('lat', lat);
      url.searchParams.set('lon', lon);
      window.history.replaceState({}, '', url);

    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (location) {
      refreshTimerRef.current = setInterval(() => {
        loadWeather(location.latitude, location.longitude, location);
      }, 5 * 60 * 1000);

      return () => clearInterval(refreshTimerRef.current);
    }
  }, [location, loadWeather]);

  // Load from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lon = params.get('lon');
    const city = params.get('city');

    if (lat && lon) {
      loadWeather(
        parseFloat(lat),
        parseFloat(lon),
        city ? { name: city, latitude: parseFloat(lat), longitude: parseFloat(lon) } : null
      );
    }
  }, [loadWeather]);

  return {
    weatherData,
    location,
    loading,
    error,
    isOffline,
    loadWeather,
  };
}
