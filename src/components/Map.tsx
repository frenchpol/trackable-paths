
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation } from '@/context/LocationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { currentLocation, currentPath, isTracking } = useLocation();
  const [token, setToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    try {
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

      setIsMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !currentLocation || !isMapInitialized) return;

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
  }, [currentLocation, currentPath, isTracking, isMapInitialized]);

  if (!isMapInitialized) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-lg font-semibold mb-4">Enter Mapbox Token</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please enter your Mapbox public token. You can find this in your Mapbox account dashboard at{' '}
            <a 
              href="https://account.mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              account.mapbox.com
            </a>
          </p>
          <Input
            type="text"
            placeholder="Enter your Mapbox token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mb-4"
          />
          <Button 
            onClick={initializeMap}
            disabled={!token}
            className="w-full"
          >
            Initialize Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gray-100">
      <div ref={mapContainer} className="h-full w-full" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent" />
    </div>
  );
};
