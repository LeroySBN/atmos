import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import UnitToggle from './UnitToggle';
import CurrentWeather from './CurrentWeather';
import ForecastCard from './ForecastCard';

interface WeatherData {
  location: string;
  date: string;
  current: {
    icon: string;
    temp: number;
    feels_like: number;
    description: string;
    wind: {
      speed: number;
      deg: number;
    };
    humidity: number;
    visibility: number;
    pressure: number;
  };
  forecast?: {
    date: string;
    icon: string;
    temp_min: number;
    temp_max: number;
    description: string;
  }[];
}

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch weather data
  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/weather?city=${encodeURIComponent(cityName)}&units=${unit}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setWeatherData(data);
      setCity(cityName);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (cityName: string) => {
    fetchWeatherData(cityName);
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    if (city) {
      fetchWeatherData(city);
    }
  };

  // Initial data fetch (optional)
  useEffect(() => {
    // You can fetch data for a default city on component mount
    // fetchWeatherData('London');
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Atmos Weather</h1>
        <UnitToggle unit={unit} onUnitChange={handleUnitChange} />
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      {loading && (
        <div className="flex justify-center my-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error my-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      {weatherData && (
        <div className="space-y-8">
          <CurrentWeather data={weatherData} unit={unit} />
          
          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">3-Day Forecast</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <ForecastCard key={index} day={day} unit={unit} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
