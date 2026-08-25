import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  return location;
}
