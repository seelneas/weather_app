import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Interactive weather map using Leaflet with rain/temperature overlay layers
 */
export default function WeatherMap({ lat, lon }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const layerRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('precipitation');

  // Tile layer URLs (OpenStreetMap + OpenWeatherMap free tiles)
  const baseTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // Use RainViewer for free radar tiles
  const overlayLayers = {
    precipitation: {
      label: 'Rain Radar',
      url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo',
      // Fallback to a visual representation
      fallbackUrl: null,
    },
    temperature: {
      label: 'Temperature',
      url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=demo',
      fallbackUrl: null,
    },
    clouds: {
      label: 'Clouds',
      url: 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=demo',
      fallbackUrl: null,
    },
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [lat || 40.7128, lon || -74.006],
      zoom: 8,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer(baseTileUrl, {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom marker
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 16px; height: 16px;
        background: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(59,130,246,0.5);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    markerRef.current = L.marker([lat || 40.7128, lon || -74.006], { icon }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map center and marker when location changes
  useEffect(() => {
    if (!mapInstanceRef.current || !lat || !lon) return;
    mapInstanceRef.current.setView([lat, lon], 8, { animate: true });
    markerRef.current?.setLatLng([lat, lon]);
  }, [lat, lon]);

  // Handle layer switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove previous overlay
    if (layerRef.current) {
      mapInstanceRef.current.removeLayer(layerRef.current);
    }

    // Add new overlay
    const layerConfig = overlayLayers[activeLayer];
    if (layerConfig?.url) {
      layerRef.current = L.tileLayer(layerConfig.url, {
        opacity: 0.6,
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
    }
  }, [activeLayer]);

  return (
    <section className="weather-map" aria-label="Weather map">
      <h2 className="section-title">Weather Map</h2>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div ref={mapRef} className="weather-map__container" role="img" aria-label="Interactive weather map" />
        <div className="weather-map__controls" style={{ padding: '12px' }}>
          {Object.entries(overlayLayers).map(([key, layer]) => (
            <button
              key={key}
              className={`weather-map__toggle ${activeLayer === key ? 'weather-map__toggle--active' : ''}`}
              onClick={() => setActiveLayer(key)}
              aria-pressed={activeLayer === key}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
