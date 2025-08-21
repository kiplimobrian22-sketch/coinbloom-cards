import { useState, useEffect } from 'react';

interface GeolocationData {
  country: string;
  countryCode: string;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): GeolocationData => {
  const [data, setData] = useState<GeolocationData>({
    country: '',
    countryCode: 'US',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Using ipapi.co for geolocation (free tier)
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();
        
        setData({
          country: locationData.country_name || 'United States',
          countryCode: locationData.country_code || 'US',
          loading: false,
          error: null,
        });
      } catch (error) {
        setData({
          country: 'United States',
          countryCode: 'US',
          loading: false,
          error: 'Failed to detect location',
        });
      }
    };

    fetchLocation();
  }, []);

  return data;
};