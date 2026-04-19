import React from 'react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, formatDayName } from '../utils/units';

/**
 * 10-day vertical forecast list with temperature bars
 */
export default function DailyForecast({ daily, unit }) {
  if (!daily || daily.length === 0) return null;

  // Calculate min/max across all days for the bar scale
  const allLows = daily.map(d => d.low);
  const allHighs = daily.map(d => d.high);
  const globalMin = Math.min(...allLows);
  const globalMax = Math.max(...allHighs);
  const range = globalMax - globalMin || 1;

  return (
    <section className="daily-forecast" aria-label="10-day forecast">
      <h2 className="section-title">10-Day Forecast</h2>
      <div className="glass-card daily-list" role="list">
        {daily.map((day, idx) => {
          const weather = getWeatherInfo(day.weatherCode);
          const dayLabel = formatDayName(day.date, { short: true });
          const isToday = dayLabel === 'Today';

          // Calculate bar position
          const barLeft = ((day.low - globalMin) / range) * 100;
          const barWidth = ((day.high - day.low) / range) * 100;

          return (
            <div
              key={day.date}
              className="daily-item"
              role="listitem"
              aria-label={`${dayLabel}: High ${formatTemp(day.high, unit)}, Low ${formatTemp(day.low, unit)}, ${weather.description}`}
            >
              <span className={`daily-item__day ${isToday ? 'daily-item__today' : ''}`}>
                {dayLabel}
              </span>
              
              <span className="daily-item__icon">
                <WeatherIcon iconKey={weather.iconKey} size={28} />
              </span>

              <div className="daily-item__bar-container">
                <span className="daily-item__temp-low">{formatTemp(day.low, unit)}</span>
                <div className="daily-item__bar">
                  <div
                    className="daily-item__bar-fill"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 8)}%`,
                    }}
                  />
                </div>
                <span className="daily-item__temp-high">{formatTemp(day.high, unit)}</span>
              </div>

              <span className="daily-item__precip">
                {day.precipProbability > 0 && (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#60A5FA" style={{ marginRight: 2, verticalAlign: 'middle' }}>
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    {day.precipProbability}%
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
