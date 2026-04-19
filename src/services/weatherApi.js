/**
 * Weather API service — uses Open-Meteo (free, no API key required)
 * Implements 5-minute caching for current weather and 1-hour for forecasts.
 */

const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Simple in-memory cache
const cache = new Map();

function getCacheKey(url) {
  return url;
}

function getCached(key, maxAgeMs) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > maxAgeMs) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  // Also persist to localStorage for offline
  try {
    localStorage.setItem(`skyview_cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    // localStorage full or unavailable
  }
}

function getOfflineCache(key) {
  try {
    const raw = localStorage.getItem(`skyview_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { data: parsed.data, timestamp: parsed.timestamp };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function fetchWithCache(url, maxAgeMs = 5 * 60 * 1000) {
  const key = getCacheKey(url);
  
  // Check in-memory cache
  const cached = getCached(key, maxAgeMs);
  if (cached) return cached;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    setCache(key, data);
    return data;
  } catch (error) {
    // Try offline cache
    const offline = getOfflineCache(key);
    if (offline) {
      return { ...offline.data, _cached: true, _cachedAt: offline.timestamp };
    }
    throw error;
  }
}

/**
 * Search for cities by name
 * @param {string} query - City name or zip code
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  
  const url = `${GEOCODING_API}?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
  const data = await fetchWithCache(url, 60 * 60 * 1000); // Cache geocoding for 1 hour
  
  if (!data.results) return [];
  
  return data.results.map(r => ({
    id: r.id,
    name: r.name,
    country: r.country || '',
    countryCode: r.country_code || '',
    admin1: r.admin1 || '',
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}

/**
 * Fetch complete weather data for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'surface_pressure',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'precipitation',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: 10,
  });

  const url = `${FORECAST_API}?${params}`;
  const data = await fetchWithCache(url, 5 * 60 * 1000); // 5 min cache for current

  return data;
}

/**
 * Fetch air quality data
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
export async function fetchAirQuality(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'european_aqi,us_aqi,pm10,pm2_5',
    timezone: 'auto',
  });

  const url = `${AIR_QUALITY_API}?${params}`;
  const data = await fetchWithCache(url, 30 * 60 * 1000); // 30 min cache
  
  return data;
}

/**
 * Reverse geocode coordinates to city name
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} Location details
 */
export async function reverseGeocode(lat, lon) {
  // Open-Meteo doesn't have reverse geocoding, so we use a free alternative
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`;
    const response = await fetch(url, {
      headers: { 'Accept-Language': 'en' }
    });
    const data = await response.json();
    
    return {
      name: data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown',
      country: data.address?.country || '',
      countryCode: data.address?.country_code?.toUpperCase() || '',
      admin1: data.address?.state || '',
      latitude: lat,
      longitude: lon,
    };
  } catch (error) {
    return {
      name: 'Current Location',
      country: '',
      countryCode: '',
      admin1: '',
      latitude: lat,
      longitude: lon,
    };
  }
}

/**
 * Parse weather API response into a structured format
 */
export function parseWeatherData(weather, airQuality = null) {
  const current = {
    temp: weather.current?.temperature_2m,
    feelsLike: weather.current?.apparent_temperature,
    humidity: weather.current?.relative_humidity_2m,
    windSpeed: weather.current?.wind_speed_10m,
    windDirection: weather.current?.wind_direction_10m,
    windGusts: weather.current?.wind_gusts_10m,
    pressure: weather.current?.surface_pressure,
    weatherCode: weather.current?.weather_code,
    isDay: weather.current?.is_day === 1,
  };

  // Today's daily data
  const todayDaily = {
    high: weather.daily?.temperature_2m_max?.[0],
    low: weather.daily?.temperature_2m_min?.[0],
    sunrise: weather.daily?.sunrise?.[0],
    sunset: weather.daily?.sunset?.[0],
    uvIndex: weather.daily?.uv_index_max?.[0],
  };

  // Air quality
  const aqi = airQuality?.current ? {
    europeanAqi: airQuality.current.european_aqi,
    usAqi: airQuality.current.us_aqi,
    pm10: airQuality.current.pm10,
    pm25: airQuality.current.pm2_5,
  } : null;

  // Hourly forecast (next 48 hours from now)
  const now = new Date();
  const hourlyTimes = weather.hourly?.time || [];
  const startIdx = hourlyTimes.findIndex(t => new Date(t) >= now);
  const hourly = [];
  for (let i = Math.max(0, startIdx); i < Math.min(startIdx + 48, hourlyTimes.length); i++) {
    hourly.push({
      time: hourlyTimes[i],
      temp: weather.hourly.temperature_2m[i],
      weatherCode: weather.hourly.weather_code[i],
      precipProbability: weather.hourly.precipitation_probability[i],
      precipitation: weather.hourly.precipitation[i],
      windSpeed: weather.hourly.wind_speed_10m[i],
      isDay: weather.hourly.is_day[i] === 1,
    });
  }

  // Daily forecast
  const daily = (weather.daily?.time || []).map((time, i) => ({
    date: time,
    high: weather.daily.temperature_2m_max[i],
    low: weather.daily.temperature_2m_min[i],
    weatherCode: weather.daily.weather_code[i],
    precipSum: weather.daily.precipitation_sum[i],
    precipProbability: weather.daily.precipitation_probability_max[i],
    windSpeedMax: weather.daily.wind_speed_10m_max[i],
    sunrise: weather.daily.sunrise[i],
    sunset: weather.daily.sunset[i],
    uvIndex: weather.daily.uv_index_max[i],
  }));

  return {
    current: { ...current, ...todayDaily },
    aqi,
    hourly,
    daily,
    _cached: weather._cached || false,
    _cachedAt: weather._cachedAt || null,
  };
}
