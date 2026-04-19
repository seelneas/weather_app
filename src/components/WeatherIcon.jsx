import React from 'react';

/**
 * Animated SVG weather icons based on weather code icon keys
 * Each icon is a hand-crafted SVG with CSS animations
 */

const SunIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .sun-ray { animation: spin 12s linear infinite; transform-origin: 32px 32px; }
      .sun-core { filter: drop-shadow(0 0 8px rgba(251,191,36,0.6)); }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
    <g className="sun-ray">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line key={i} x1="32" y1="6" x2="32" y2="14"
          stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${angle} 32 32)`} opacity="0.8" />
      ))}
    </g>
    <circle className="sun-core" cx="32" cy="32" r="14" fill="url(#sunGrad)" />
    <defs>
      <radialGradient id="sunGrad" cx="0.4" cy="0.35">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
    </defs>
  </svg>
);

const MoonIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <style>{`
      .moon-glow { filter: drop-shadow(0 0 10px rgba(186,196,235,0.5)); }
      .star { animation: twinkle 2s ease-in-out infinite alternate; }
      .star:nth-child(2) { animation-delay: 0.5s; }
      .star:nth-child(3) { animation-delay: 1s; }
      @keyframes twinkle { from { opacity: 0.3; } to { opacity: 1; } }
    `}</style>
    <circle className="star" cx="14" cy="16" r="1.5" fill="#E0E7FF" />
    <circle className="star" cx="50" cy="12" r="1" fill="#E0E7FF" />
    <circle className="star" cx="46" cy="28" r="1.2" fill="#E0E7FF" />
    <path className="moon-glow" d="M38 14C30.268 14 24 20.268 24 28s6.268 14 14 14c3.24 0 6.22-1.1 8.59-2.95A16.98 16.98 0 0132 42c-9.389 0-17-7.611-17-17S22.611 8 32 8c4.97 0 9.44 2.13 12.56 5.52A13.91 13.91 0 0038 14z" fill="url(#moonGrad)" />
    <defs>
      <linearGradient id="moonGrad" x1="24" y1="14" x2="44" y2="42">
        <stop offset="0%" stopColor="#E0E7FF" />
        <stop offset="100%" stopColor="#BAC4EB" />
      </linearGradient>
    </defs>
  </svg>
);

const CloudIcon = ({ size = 64, partial = false, dark = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <style>{`
      .cloud-main { animation: cloudBob 4s ease-in-out infinite; }
      @keyframes cloudBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    `}</style>
    {partial && (
      <circle cx="22" cy="22" r="10" fill="#FBBF24" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
      </circle>
    )}
    <g className="cloud-main">
      <path d="M48 38H18c-4.418 0-8-3.582-8-8 0-3.866 2.748-7.085 6.396-7.82C17.39 16.84 22.16 13 28 13c5.053 0 9.33 3.286 10.824 7.84C39.56 20.29 40.26 20 41 20c3.314 0 6 2.686 6 6 0 .34-.028.674-.083 1H48c2.761 0 5 2.239 5 5s-2.239 5-5 5z"
        fill={dark ? 'url(#cloudDarkGrad)' : 'url(#cloudGrad)'} />
    </g>
    <defs>
      <linearGradient id="cloudGrad" x1="10" y1="13" x2="53" y2="42">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="cloudDarkGrad" x1="10" y1="13" x2="53" y2="42">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>
  </svg>
);

const RainIcon = ({ size = 64, heavy = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g>
      <path d="M48 30H18c-4.418 0-8-3.582-8-8 0-3.866 2.748-7.085 6.396-7.82C17.39 8.84 22.16 5 28 5c5.053 0 9.33 3.286 10.824 7.84C39.56 12.29 40.26 12 41 12c3.314 0 6 2.686 6 6 0 .34-.028.674-.083 1H48c2.761 0 5 2.239 5 5s-2.239 5-5 5z"
        fill="url(#rainCloudGrad)" />
    </g>
    {[18, 28, 38, 46].map((x, i) => (
      <line key={i} x1={x} y1="36" x2={x - 3} y2={heavy ? "52" : "46"}
        stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <animate attributeName="y1" values="34;38;34" dur={`${0.6 + i * 0.15}s`} repeatCount="indefinite" />
        <animate attributeName="y2" values={heavy ? "50;56;50" : "44;49;44"} dur={`${0.6 + i * 0.15}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${0.6 + i * 0.15}s`} repeatCount="indefinite" />
      </line>
    ))}
    <defs>
      <linearGradient id="rainCloudGrad" x1="10" y1="5" x2="53" y2="30">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>
  </svg>
);

const SnowIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M48 28H18c-4.418 0-8-3.582-8-8 0-3.866 2.748-7.085 6.396-7.82C17.39 6.84 22.16 3 28 3c5.053 0 9.33 3.286 10.824 7.84C39.56 10.29 40.26 10 41 10c3.314 0 6 2.686 6 6 0 .34-.028.674-.083 1H48c2.761 0 5 2.239 5 5s-2.239 5-5 5z"
      fill="url(#snowCloudG)" />
    {[{x:18,d:0.3},{x:26,d:0.6},{x:34,d:0.1},{x:42,d:0.8},{x:22,d:0.5},{x:38,d:0.9}].map((s, i) => (
      <circle key={i} cx={s.x} cy="38" r="2.5" fill="#E0E7FF" opacity="0.8">
        <animate attributeName="cy" values="34;56;34" dur={`${1.5 + s.d}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${s.x};${s.x + 4};${s.x}`} dur={`${2 + s.d}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.9;0" dur={`${1.5 + s.d}s`} repeatCount="indefinite" />
      </circle>
    ))}
    <defs>
      <linearGradient id="snowCloudG" x1="10" y1="3" x2="53" y2="28">
        <stop offset="0%" stopColor="#C7D2FE" />
        <stop offset="100%" stopColor="#A5B4FC" />
      </linearGradient>
    </defs>
  </svg>
);

const ThunderstormIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M48 26H18c-4.418 0-8-3.582-8-8s3.582-8 8-8h.6C19.59 4.84 24.16 1 30 1c5.053 0 9.33 3.286 10.824 7.84C41.56 8.29 42.26 8 43 8c3.314 0 6 2.686 6 6 0 .34-.028.674-.083 1H48c2.761 0 5 2.239 5 5s-2.239 5-5 5z"
      fill="#475569" />
    <path d="M34 30l-6 12h6l-2 14 10-16h-7l3-10z" fill="#FBBF24" opacity="0.9">
      <animate attributeName="opacity" values="0.4;1;0.4;1;0.4" dur="2s" repeatCount="indefinite" />
    </path>
    {[20, 44].map((x, i) => (
      <line key={i} x1={x} y1="30" x2={x - 2} y2="42"
        stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${0.5 + i * 0.2}s`} repeatCount="indefinite" />
      </line>
    ))}
  </svg>
);

const FogIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {[20, 28, 36, 44].map((y, i) => (
      <line key={i} x1={10 + i * 2} y1={y} x2={54 - i * 2} y2={y}
        stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"
        opacity={0.3 + i * 0.15}>
        <animate attributeName="x1" values={`${10 + i * 2};${14 + i * 2};${10 + i * 2}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        <animate attributeName="x2" values={`${54 - i * 2};${50 - i * 2};${54 - i * 2}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
      </line>
    ))}
  </svg>
);

const DrizzleIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M48 28H18c-4.418 0-8-3.582-8-8 0-3.866 2.748-7.085 6.396-7.82C17.39 6.84 22.16 3 28 3c5.053 0 9.33 3.286 10.824 7.84C39.56 10.29 40.26 10 41 10c3.314 0 6 2.686 6 6 0 .34-.028.674-.083 1H48c2.761 0 5 2.239 5 5s-2.239 5-5 5z"
      fill="#94A3B8" />
    {[20, 32, 44].map((x, i) => (
      <circle key={i} cx={x} cy="38" r="1.5" fill="#60A5FA" opacity="0.7">
        <animate attributeName="cy" values="34;48;34" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.8;0" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

const iconMap = {
  'clear':         SunIcon,
  'clear-night':   MoonIcon,
  'mainly-clear':  (props) => <SunIcon {...props} />,
  'mainly-clear-night': MoonIcon,
  'partly-cloudy': (props) => <CloudIcon {...props} partial />,
  'partly-cloudy-night': (props) => <CloudIcon {...props} partial />,
  'overcast':      (props) => <CloudIcon {...props} dark />,
  'overcast-night':(props) => <CloudIcon {...props} dark />,
  'fog':           FogIcon,
  'fog-night':     FogIcon,
  'drizzle':       DrizzleIcon,
  'drizzle-night': DrizzleIcon,
  'freezing-rain': (props) => <RainIcon {...props} />,
  'freezing-rain-night': (props) => <RainIcon {...props} />,
  'rain-light':    (props) => <RainIcon {...props} />,
  'rain-light-night': (props) => <RainIcon {...props} />,
  'rain':          (props) => <RainIcon {...props} />,
  'rain-night':    (props) => <RainIcon {...props} />,
  'rain-heavy':    (props) => <RainIcon {...props} heavy />,
  'rain-heavy-night': (props) => <RainIcon {...props} heavy />,
  'snow-light':    SnowIcon,
  'snow-light-night': SnowIcon,
  'snow':          SnowIcon,
  'snow-night':    SnowIcon,
  'snow-heavy':    SnowIcon,
  'snow-heavy-night': SnowIcon,
  'thunderstorm':  ThunderstormIcon,
  'thunderstorm-night': ThunderstormIcon,
};

/**
 * Render an animated weather icon by key
 * @param {{ iconKey: string, size?: number }} props
 */
export default function WeatherIcon({ iconKey, size = 64, ariaLabel = '' }) {
  const IconComponent = iconMap[iconKey] || SunIcon;
  
  return (
    <span role="img" aria-label={ariaLabel} style={{ display: 'inline-flex', lineHeight: 0 }}>
      <IconComponent size={size} />
    </span>
  );
}
