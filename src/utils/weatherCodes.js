/**
 * WMO Weather interpretation codes (WW)
 * Used by Open-Meteo API
 * Maps codes to human-readable descriptions, icon types, and background themes
 */

const weatherCodeMap = {
  0:  { description: 'Clear sky',            icon: 'clear',         theme: 'sunny' },
  1:  { description: 'Mainly clear',         icon: 'mainly-clear',  theme: 'sunny' },
  2:  { description: 'Partly cloudy',        icon: 'partly-cloudy', theme: 'cloudy' },
  3:  { description: 'Overcast',             icon: 'overcast',      theme: 'cloudy' },
  45: { description: 'Fog',                  icon: 'fog',           theme: 'cloudy' },
  48: { description: 'Depositing rime fog',  icon: 'fog',           theme: 'cloudy' },
  51: { description: 'Light drizzle',        icon: 'drizzle',       theme: 'rainy' },
  53: { description: 'Moderate drizzle',     icon: 'drizzle',       theme: 'rainy' },
  55: { description: 'Dense drizzle',        icon: 'drizzle',       theme: 'rainy' },
  56: { description: 'Freezing drizzle',     icon: 'freezing-rain', theme: 'rainy' },
  57: { description: 'Dense freezing drizzle', icon: 'freezing-rain', theme: 'rainy' },
  61: { description: 'Slight rain',          icon: 'rain-light',    theme: 'rainy' },
  63: { description: 'Moderate rain',        icon: 'rain',          theme: 'rainy' },
  65: { description: 'Heavy rain',           icon: 'rain-heavy',    theme: 'rainy' },
  66: { description: 'Light freezing rain',  icon: 'freezing-rain', theme: 'rainy' },
  67: { description: 'Heavy freezing rain',  icon: 'freezing-rain', theme: 'rainy' },
  71: { description: 'Slight snow fall',     icon: 'snow-light',    theme: 'snowy' },
  73: { description: 'Moderate snow fall',   icon: 'snow',          theme: 'snowy' },
  75: { description: 'Heavy snow fall',      icon: 'snow-heavy',    theme: 'snowy' },
  77: { description: 'Snow grains',          icon: 'snow-light',    theme: 'snowy' },
  80: { description: 'Slight rain showers',  icon: 'rain-light',    theme: 'rainy' },
  81: { description: 'Moderate rain showers',icon: 'rain',          theme: 'rainy' },
  82: { description: 'Violent rain showers', icon: 'rain-heavy',    theme: 'stormy' },
  85: { description: 'Slight snow showers',  icon: 'snow-light',    theme: 'snowy' },
  86: { description: 'Heavy snow showers',   icon: 'snow-heavy',    theme: 'snowy' },
  95: { description: 'Thunderstorm',         icon: 'thunderstorm',  theme: 'stormy' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm', theme: 'stormy' },
  99: { description: 'Thunderstorm with heavy hail',  icon: 'thunderstorm', theme: 'stormy' },
};

/**
 * Get weather info from WMO code
 * @param {number} code - WMO weather code
 * @param {boolean} isNight - whether it's currently night time
 * @returns {{ description: string, icon: string, theme: string }}
 */
export function getWeatherInfo(code, isNight = false) {
  const info = weatherCodeMap[code] || { description: 'Unknown', icon: 'clear', theme: 'default' };
  
  // Adjust theme for night
  let theme = info.theme;
  if (isNight && (theme === 'sunny' || theme === 'cloudy')) {
    theme = 'night';
  }
  
  return {
    ...info,
    theme,
    iconKey: isNight ? `${info.icon}-night` : info.icon,
  };
}

/**
 * Get background gradient class for a weather theme
 * @param {string} theme
 * @returns {string} CSS gradient value
 */
export function getThemeGradient(theme) {
  const gradients = {
    sunny:   'linear-gradient(135deg, #ff8c00 0%, #ff6b35 30%, #f7418f 100%)',
    cloudy:  'linear-gradient(135deg, #536976 0%, #292E49 100%)',
    rainy:   'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    snowy:   'linear-gradient(135deg, #e6dada 0%, #c7d2fe 50%, #a5b4fc 100%)',
    stormy:  'linear-gradient(135deg, #16222A 0%, #3A6073 100%)',
    night:   'linear-gradient(135deg, #0c1445 0%, #1a1a4e 40%, #2d1b69 100%)',
    default: 'linear-gradient(135deg, #0f1729 0%, #1a2540 50%, #1e3a5f 100%)',
  };
  return gradients[theme] || gradients.default;
}

/**
 * Get UV Index level and color
 */
export function getUVLevel(uvi) {
  if (uvi <= 2) return { level: 'Low', color: '#10b981' };
  if (uvi <= 5) return { level: 'Moderate', color: '#f59e0b' };
  if (uvi <= 7) return { level: 'High', color: '#f97316' };
  if (uvi <= 10) return { level: 'Very High', color: '#ef4444' };
  return { level: 'Extreme', color: '#7c3aed' };
}

/**
 * Get AQI level and color
 * Open-Meteo European AQI scale
 */
export function getAQILevel(aqi) {
  if (aqi <= 20) return { level: 'Good', color: '#10b981' };
  if (aqi <= 40) return { level: 'Fair', color: '#84cc16' };
  if (aqi <= 60) return { level: 'Moderate', color: '#f59e0b' };
  if (aqi <= 80) return { level: 'Poor', color: '#f97316' };
  if (aqi <= 100) return { level: 'Very Poor', color: '#ef4444' };
  return { level: 'Hazardous', color: '#7c3aed' };
}

export default weatherCodeMap;
