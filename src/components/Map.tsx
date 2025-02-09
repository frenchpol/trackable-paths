
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation } from '@/context/LocationContext';

// Set MapTiler Terrain style
const MAPTILER_STYLE: mapboxgl.Style = {
  version: 8,
  sources: {
    terrain: {
      type: 'raster' as const,
      tiles: ['https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.maptiler.com">MapTiler</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  layers: [
    {
      id: 'terrain',
      type: 'raster' as const,
      source: 'terrain',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const { currentLocation, currentPath, isTracking } = useLocation();
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with MapTiler style
    mapboxgl.accessToken = 'not-needed-for-maptiler';
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPTILER_STYLE,
        center: currentLocation || [-74.5, 40],
        zoom: 15,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Create marker for current position
      if (currentLocation) {
        markerRef.current = new mapboxgl.Marker({ color: '#4338ca' })
          .setLngLat(currentLocation)
          .addTo(map.current);
      }

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

        setIsMapInitialized(true);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !currentLocation || !isMapInitialized) return;

    // Update marker position
    if (markerRef.current) {
      markerRef.current.setLngLat(currentLocation);
    } else {
      markerRef.current = new mapboxgl.Marker({ color: '#4338ca' })
        .setLngLat(currentLocation)
        .addTo(map.current);
    }

    if (isTracking) {
      map.current.easeTo({
        center: currentLocation,
        duration: 1000,
      });
    }

    // Update source data
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
  }, [currentLocation, currentPath, isTracking, isMapInitialized]);

  return (
    <div className="absolute inset-0 bg-gray-100">
      <div ref={mapContainer} className="h-full w-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent" />
    </div>
  );
};
