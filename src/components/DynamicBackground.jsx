import React, { useMemo } from 'react';
import { getThemeGradient } from '../utils/weatherCodes';

/**
 * Dynamic background that changes based on weather conditions
 * Includes animated particles for rain/snow
 */
export default function DynamicBackground({ theme = 'default', isDay = true }) {
  const gradient = getThemeGradient(theme);

  // Generate rain/snow particles
  const particles = useMemo(() => {
    if (theme === 'rainy' || theme === 'stormy') {
      return Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        height: `${15 + Math.random() * 25}px`,
        delay: `${Math.random() * 2}s`,
        duration: `${0.5 + Math.random() * 0.5}s`,
        type: 'rain',
      }));
    }
    if (theme === 'snowy') {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${4 + Math.random() * 6}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
        type: 'snow',
      }));
    }
    return [];
  }, [theme]);

  return (
    <div className="dynamic-bg" style={{ background: gradient }}>
      {/* Gradient overlay */}
      <div className="dynamic-bg__gradient" style={{ background: gradient }} />
      
      {/* Floating orbs for ambient light */}
      <div
        className="dynamic-bg__orb dynamic-bg__orb--1"
        style={{
          background: theme === 'sunny' ? '#FBBF24' :
                     theme === 'rainy' ? '#3B82F6' :
                     theme === 'snowy' ? '#E0E7FF' :
                     theme === 'stormy' ? '#475569' :
                     theme === 'night' ? '#6366F1' : '#3B82F6',
        }}
      />
      <div
        className="dynamic-bg__orb dynamic-bg__orb--2"
        style={{
          background: theme === 'sunny' ? '#F97316' :
                     theme === 'night' ? '#8B5CF6' : '#8B5CF6',
        }}
      />
      <div
        className="dynamic-bg__orb dynamic-bg__orb--3"
        style={{
          background: theme === 'sunny' ? '#EF4444' :
                     theme === 'night' ? '#312E81' : '#22D3EE',
        }}
      />
      
      {/* Weather particles */}
      {particles.map(p =>
        p.type === 'rain' ? (
          <div
            key={p.id}
            className="rain-particle"
            style={{
              left: p.left,
              height: p.height,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ) : (
          <div
            key={p.id}
            className="snow-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        )
      )}
    </div>
  );
}
