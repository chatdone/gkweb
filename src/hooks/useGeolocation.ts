import { useEffect, useState } from 'react';

const useGeolocation = () => {
  const [
    currentPosition,
    setCurrentPosition,
  ] = useState<google.maps.LatLngLiteral>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  return { currentPosition };
};

export default useGeolocation;
