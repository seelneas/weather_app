# 🌤 SkyView Weather

A responsive, ad-free weather app providing hyper-local, real-time weather data and forecasts with a premium visual experience.

## ✨ Features

| Feature | Description |
|---|---|
| **🌡 Current Conditions** | Temperature, feels like, humidity, wind, UV Index, AQI, pressure, sunrise/sunset |
| **⏰ Hourly Forecast** | 48-hour horizontally scrollable forecast with rain probability |
| **📅 10-Day Forecast** | Daily high/low with temperature range bars and precipitation |
| **🔍 City Search** | Autocomplete search with debouncing for cities worldwide |
| **📍 Geolocation** | Auto-detect user location with browser Geolocation API |
| **🎨 Dynamic Backgrounds** | Gradient + particle animations that match weather conditions |
| **⭐ Favorites** | Save up to 5 locations in localStorage |
| **🗺 Weather Map** | Interactive Leaflet map with radar/temperature/cloud overlays |
| **🌗 Dark/Light Mode** | Manual toggle + OS preference auto-detection |
| **📏 Units Toggle** | Metric (°C) / Imperial (°F) / Scientific (K) |
| **📴 Offline Mode** | Cached data shown when network is unavailable |
| **♿ Accessible** | WCAG 2.1 AA — ARIA labels, keyboard navigation, screen reader support |

## 🛠 Tech Stack

- **React 19** + **Vite** — fast dev/build tooling
- **Open-Meteo API** — free, keyless weather data (no API key exposure)
- **Leaflet** — interactive weather map
- **CSS Custom Properties** — full design system with glassmorphism
- **Inter Font** (Google Fonts) — premium typography

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173/`.

## 📐 Architecture

```
src/
├── App.jsx                    # Main orchestrator
├── index.css                  # Design system & global styles
├── main.jsx                   # Entry point
├── components/
│   ├── CurrentWeather.jsx     # Hero temp + detail cards
│   ├── DailyForecast.jsx      # 10-day forecast list
│   ├── DynamicBackground.jsx  # Animated weather backgrounds
│   ├── FavoritesBar.jsx       # Saved locations chips
│   ├── HourlyForecast.jsx     # 48h horizontal scroll
│   ├── SearchBar.jsx          # Autocomplete city search
│   ├── SettingsPanel.jsx      # Units & theme settings
│   ├── WeatherIcon.jsx        # Animated SVG weather icons
│   └── WeatherMap.jsx         # Leaflet interactive map
├── hooks/
│   ├── useFavorites.js        # localStorage favorites
│   ├── useGeolocation.js      # Browser geolocation
│   └── useWeather.js          # Weather data fetching
├── services/
│   └── weatherApi.js          # Open-Meteo API + caching
└── utils/
    ├── units.js               # Unit conversions
    └── weatherCodes.js        # WMO code mappings
```

## 🌐 API

Uses **[Open-Meteo](https://open-meteo.com/)** — a free, open-source weather API:
- No API key required (no client-side key exposure)
- No rate limits for reasonable usage
- Forecast, air quality, and geocoding endpoints
- 5-minute cache for current weather, 1-hour for forecasts

## 📱 Responsive

Works from **iPhone SE (375px)** to **4K displays**. Tested on latest Chrome, Safari, Firefox, and Edge.

## 📄 License

MIT
