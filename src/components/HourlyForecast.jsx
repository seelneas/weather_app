import React, { useRef } from 'react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, formatHour } from '../utils/units';

/**
 * Horizontal scrollable hourly forecast for next 48 hours
 */
export default function HourlyForecast({ hourly, unit }) {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  return (
    <section className="hourly-forecast" aria-label="Hourly forecast">
      <h2 className="section-title">Hourly Forecast</h2>
      <div className="hourly-scroll" ref={scrollRef} role="list">
        {hourly.slice(0, 48).map((hour, idx) => {
          const weather = getWeatherInfo(hour.weatherCode, !hour.isDay);
          const timeLabel = formatHour(hour.time);
          const isNow = timeLabel === 'Now';

          return (
            <div
              key={hour.time}
              className={`glass-card hourly-item ${isNow ? 'hourly-item--now' : ''}`}
              role="listitem"
              aria-label={`${timeLabel}: ${formatTemp(hour.temp, unit)}, ${weather.description}${hour.precipProbability > 0 ? `, ${hour.precipProbability}% rain` : ''}`}
            >
              <span className="hourly-item__time">{timeLabel}</span>
              <span className="hourly-item__icon">
                <WeatherIcon iconKey={weather.iconKey} size={32} />
              </span>
              <span className="hourly-item__temp">{formatTemp(hour.temp, unit)}</span>
              {hour.precipProbability > 0 && (
                <span className="hourly-item__rain">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 2, verticalAlign: 'middle' }}>
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                  {hour.precipProbability}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
