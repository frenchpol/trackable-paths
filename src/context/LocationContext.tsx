
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import * as turf from '@turf/turf';

interface LocationContextType {
  isTracking: boolean;
  currentPath: number[][];
  startTracking: () => void;
  stopTracking: () => void;
  currentLocation: [number, number] | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[][]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const handleLocationError = (error: GeolocationPositionError) => {
    toast.error('Unable to access location. Please enable location services.');
    console.error('Geolocation error:', error);
    setIsTracking(false);
  };

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([longitude, latitude]);
        
        setCurrentPath((prev) => {
          const newPath = [...prev, [longitude, latitude]];
          if (newPath.length > 1) {
            const distance = turf.length(turf.lineString(newPath), { units: 'kilometers' });
            console.log('Total distance:', distance.toFixed(2), 'km');
          }
          return newPath;
        });
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setIsTracking(true);
    toast.success('Started tracking your path');
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    toast.success('Stopped tracking');
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <LocationContext.Provider
      value={{
        isTracking,
        currentPath,
        startTracking,
        stopTracking,
        currentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
