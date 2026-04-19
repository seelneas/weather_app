import React from 'react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo, getUVLevel, getAQILevel } from '../utils/weatherCodes';
import { formatTemp, formatWindSpeed, getWindDirection, formatSunTime } from '../utils/units';

/**
 * Current weather conditions display
 * Shows temperature, feels like, condition, and detail cards
 */
export default function CurrentWeather({ data, location, unit, isFavorite, onToggleFavorite }) {
  if (!data || !data.current) return null;

  const { current, aqi } = data;
  const isNight = !current.isDay;
  const weather = getWeatherInfo(current.weatherCode, isNight);
  const uvInfo = getUVLevel(current.uvIndex);
  const aqiInfo = aqi ? getAQILevel(aqi.europeanAqi) : null;

  return (
    <div>
      {/* Main temperature display */}
      <section className="current-weather" aria-label="Current weather conditions">
        <div className="current-weather__main">
          <div className="current-weather__location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{location?.name || 'Unknown'}</span>
            {location?.country && <span style={{ opacity: 0.6 }}>, {location.country}</span>}
            <button
              className={`add-favorite-btn ${isFavorite ? 'add-favorite-btn--saved' : ''}`}
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          </div>
          
          <div className="current-weather__temp" aria-label={`Temperature ${formatTemp(current.temp, unit)}`}>
            {formatTemp(current.temp, unit)}
          </div>
          
          <div className="current-weather__condition">{weather.description}</div>
          
          <div className="current-weather__high-low">
            <span>H: {formatTemp(current.high, unit)}</span>
            {'  '}
            <span style={{ opacity: 0.6 }}>L: {formatTemp(current.low, unit)}</span>
          </div>
        </div>

        <div className="current-weather__icon-wrapper">
          <WeatherIcon
            iconKey={weather.iconKey}
            size={160}
            ariaLabel={`${weather.description}, ${formatTemp(current.temp, unit)}`}
          />
        </div>
      </section>

      {/* Detail Cards Grid */}
      <section className="details-grid" aria-label="Weather details">
        {/* Feels Like */}
        <div className="glass-card detail-card">
          <div className="detail-card__header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
            Feels Like
          </div>
          <div className="detail-card__value">{formatTemp(current.feelsLike, unit)}</div>
          <div className="detail-card__label">
            {current.feelsLike < current.temp ? 'Wind makes it feel colder' : 
             current.feelsLike > current.temp ? 'Humidity makes it feel warmer' : 'Similar to actual temperature'}
          </div>
        </div>

        {/* Humidity */}
        <div className="glass-card detail-card">
          <div className="detail-card__header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            Humidity
          </div>
          <div className="detail-card__value">{current.humidity}%</div>
          <div className="detail-card__label">
            {current.humidity > 70 ? 'High humidity' : current.humidity > 40 ? 'Comfortable' : 'Dry conditions'}
          </div>
        </div>

        {/* Wind */}
        <div className="glass-card detail-card">
          <div className="detail-card__header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
            Wind
          </div>
          <div className="detail-card__value">
            {formatWindSpeed(current.windSpeed, unit)}
          </div>
          <div className="detail-card__label">
            {getWindDirection(current.windDirection)} direction
            {current.windGusts && ` · Gusts ${formatWindSpeed(current.windGusts, unit)}`}
          </div>
        </div>

        {/* UV Index */}
        <div className="glass-card detail-card">
          <div className="detail-card__header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            UV Index
          </div>
          <div className="detail-card__value" style={{ color: uvInfo.color }}>
            {current.uvIndex != null ? Math.round(current.uvIndex) : '--'}
          </div>
          <div className="detail-card__label">{uvInfo.level}</div>
        </div>

        {/* Air Quality */}
        <div className="glass-card detail-card">
          <div className="detail-card__header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 2h8m-4 0v4m-7 4h14a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2zm1 8h12a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2z" />
            </svg>
            Air Quality
          </div>
          <div className="detail-card__value" style={{ color: aqiInfo?.color || 'inherit' }}>
            {aqi?.europeanAqi ?? '--'}
          </div>
          <div className="detail-card__label">{aqiInfo?.level || 'Unavailable'}</div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="glass-card detail-card">
          <div className="detail-card__header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 18a5 5 0 0 0-10 0" />
              <line x1="12" y1="9" x2="12" y2="3" />
              <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
              <line x1="1" y1="18" x2="3" y2="18" />
              <line x1="21" y1="18" x2="23" y2="18" />
              <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
              <line x1="23" y1="22" x2="1" y2="22" />
              <polyline points="8 6 12 2 16 6" />
            </svg>
            Sunrise & Sunset
          </div>
          <div className="detail-card__value" style={{ fontSize: '1.125rem' }}>
            ↑ {formatSunTime(current.sunrise)}
          </div>
          <div className="detail-card__label">
            ↓ Sunset {formatSunTime(current.sunset)}
          </div>
        </div>

        {/* Pressure */}
        <div className="glass-card detail-card">
          <div className="detail-card__header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pressure
          </div>
          <div className="detail-card__value">
            {current.pressure ? `${Math.round(current.pressure)}` : '--'}
          </div>
          <div className="detail-card__label">hPa</div>
        </div>
      </section>
    </div>
  );
}
