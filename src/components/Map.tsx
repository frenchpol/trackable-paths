
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation } from '@/context/LocationContext';

mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z3gwcm4wMGF3MmpxcTh4bW5vejRhIn0.MwVWRhYHxGQBeFOGxpYm7w';

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { currentLocation, currentPath, isTracking } = useLocation();
  
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: currentLocation || [-74.5, 40],
      zoom: 15,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for style to load before adding sources and layers
    map.current.on('style.load', () => {
      // Initialize the source and layer
      map.current?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: currentPath,
          },
        },
      });

      map.current?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#4338ca',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !currentLocation) return;

    if (isTracking) {
      map.current.easeTo({
        center: currentLocation,
        duration: 1000,
      });
    }

    // Update source data only if the style has finished loading
    const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: currentPath,
        },
      });
    }
  }, [currentLocation, currentPath, isTracking]);

  return (
    <div className="absolute inset-0 bg-gray-100">
      <div ref={mapContainer} className="h-full w-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent" />
    </div>
  );
};
