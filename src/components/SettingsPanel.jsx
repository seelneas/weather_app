import React from 'react';
import { UNIT_SYSTEMS } from '../utils/units';

/**
 * Settings panel (slide-in) for unit toggle and dark/light mode
 */
export default function SettingsPanel({ isOpen, onClose, unit, setUnit, theme, setTheme }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="settings-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="settings-panel" role="dialog" aria-label="Settings" aria-modal="true">
        <div className="settings-panel__header">
          <h2 className="settings-panel__title">Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Units */}
        <div className="settings-group">
          <div className="settings-group__label">Temperature Units</div>
          <div className="settings-options">
            {Object.entries(UNIT_SYSTEMS).map(([key, sys]) => (
              <button
                key={key}
                className={`settings-option ${unit === key ? 'settings-option--active' : ''}`}
                onClick={() => setUnit(key)}
                aria-pressed={unit === key}
              >
                {sys.temp} {sys.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-group">
          <div className="settings-group__label">Appearance</div>
          <div className="settings-options">
            {[
              { key: 'dark', label: '🌙 Dark' },
              { key: 'light', label: '☀️ Light' },
              { key: 'auto', label: '⚙️ Auto' },
            ].map(opt => (
              <button
                key={opt.key}
                className={`settings-option ${theme === opt.key ? 'settings-option--active' : ''}`}
                onClick={() => setTheme(opt.key)}
                aria-pressed={theme === opt.key}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="settings-group" style={{ marginTop: 'auto' }}>
          <div className="settings-group__label">About</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            SkyView Weather provides hyper-local, real-time weather data powered by{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-blue)' }}>
              Open-Meteo
            </a>. No ads. No tracking. Just weather.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '8px' }}>
            Weather data © Open-Meteo.com · Map © CartoDB/OSM
          </p>
        </div>
      </aside>
    </>
  );
}
