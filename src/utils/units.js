/**
 * Unit conversion utilities for temperature, wind speed, etc.
 */

export const UNIT_SYSTEMS = {
  metric: { label: 'Metric', temp: '°C', speed: 'm/s', precip: 'mm' },
  imperial: { label: 'Imperial', temp: '°F', speed: 'mph', precip: 'in' },
  scientific: { label: 'Scientific', temp: 'K', speed: 'm/s', precip: 'mm' },
};

/**
 * Convert temperature from Celsius
 */
export function convertTemp(celsius, unit = 'metric') {
  if (celsius === null || celsius === undefined) return '--';
  switch (unit) {
    case 'imperial':
      return Math.round((celsius * 9) / 5 + 32);
    case 'scientific':
      return Math.round((celsius + 273.15) * 10) / 10;
    default:
      return Math.round(celsius);
  }
}

/**
 * Format temperature with unit symbol
 */
export function formatTemp(celsius, unit = 'metric') {
  const val = convertTemp(celsius, unit);
  if (val === '--') return val;
  return `${val}${UNIT_SYSTEMS[unit].temp}`;
}

/**
 * Convert wind speed from m/s
 */
export function convertWindSpeed(ms, unit = 'metric') {
  if (ms === null || ms === undefined) return '--';
  switch (unit) {
    case 'imperial':
      return Math.round(ms * 2.237);
    default:
      return Math.round(ms * 10) / 10;
  }
}

/**
 * Format wind speed with unit symbol
 */
export function formatWindSpeed(ms, unit = 'metric') {
  const val = convertWindSpeed(ms, unit);
  if (val === '--') return val;
  return `${val} ${UNIT_SYSTEMS[unit].speed}`;
}

/**
 * Get wind direction as compass label
 */
export function getWindDirection(degrees) {
  if (degrees === null || degrees === undefined) return '';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(degrees / 22.5) % 16;
  return dirs[idx];
}

/**
 * Convert precipitation from mm
 */
export function convertPrecip(mm, unit = 'metric') {
  if (mm === null || mm === undefined) return '--';
  if (unit === 'imperial') {
    return Math.round(mm / 25.4 * 100) / 100;
  }
  return Math.round(mm * 10) / 10;
}

/**
 * Format precipitation with unit symbol
 */
export function formatPrecip(mm, unit = 'metric') {
  const val = convertPrecip(mm, unit);
  if (val === '--') return val;
  return `${val} ${UNIT_SYSTEMS[unit].precip}`;
}

/**
 * Format time from ISO string or Date
 */
export function formatHour(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  if (
    date.getHours() === now.getHours() &&
    date.getDate() === now.getDate()
  ) {
    return 'Now';
  }
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

/**
 * Format day name from ISO date string
 */
export function formatDayName(isoString, options = {}) {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString([], { weekday: options.short ? 'short' : 'long' });
}

/**
 * Check if it's currently night based on sunrise/sunset times
 */
export function isNightTime(sunriseISO, sunsetISO) {
  if (!sunriseISO || !sunsetISO) {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 19;
  }
  const now = new Date();
  const sunrise = new Date(sunriseISO);
  const sunset = new Date(sunsetISO);
  return now < sunrise || now > sunset;
}

/**
 * Format sunrise/sunset time
 */
export function formatSunTime(isoString) {
  if (!isoString) return '--:--';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
