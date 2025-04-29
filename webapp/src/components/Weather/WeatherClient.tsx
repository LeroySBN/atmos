'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import UnitToggle from './UnitToggle';
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

const WeatherClient: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // API base URL - use environment variable or default to localhost
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Function to fetch weather data
  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching weather data from: ${API_BASE_URL}/api/weather?city=${encodeURIComponent(cityName)}&units=${unit}`);
      
      const response = await fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(cityName)}&units=${unit}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `City not found: ${cityName}`;
        } catch (err) {
          // If response is not JSON
          errorMessage = `Error ${response.status}: ${response.statusText || 'Could not connect to weather API'}`;
          console.error('Error fetching weather data:', err);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setWeatherData(data);
      setCity(cityName);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      
      // Show error but don't clear previous weather data
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // Set a timeout to automatically clear the error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
      
      // If this is the first search (no previous data), load default city
      if (!weatherData) {
        setTimeout(() => {
          fetchWeatherData('Nairobi');
        }, 1000);
      }
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

  // Initial data fetch for Nairobi
  useEffect(() => {
    fetchWeatherData('Nairobi');
  }, []);

  // Determine if this is the initial load or a subsequent update
  const isInitialLoad = loading && !weatherData;
  const isUpdating = loading && weatherData;

  return (
    <div className="h-screen relative">
      {/* Initial loading state - full screen */}
      {isInitialLoad && (
        <div className="h-screen flex justify-center items-center">
          <div className="loading loading-spinner loading-lg text-white"></div>
        </div>
      )}
      
      {/* Error state - shows as a toast notification */}
      {error && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-warning bg-amber-800/90 text-white p-4 border-amber-600 shadow-lg flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div className="text-center">
              <h3 className="font-bold mb-1 text-center">Search Error</h3>
              <div className="text-sm text-center">{error}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Updating overlay - shows on top of existing content */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black/20 z-50 flex justify-center items-center pointer-events-none">
          <div className="loading loading-spinner loading-lg text-white"></div>
        </div>
      )}
      
      {weatherData && (
        <div className="h-screen grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Left Column (1fr) */}
          <div className="bg-gray-800/50 p-6 flex flex-col md:h-screen md:col-span-1 text-center">
            {/* 1st container - App name */}
            <div className="flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white">Atmos Weather</h1>
            </div>
            
            {/* 2nd container - Current weather info */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-60 h-60">
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@4x.png`} 
                  alt={weatherData.current.description}
                  className="w-full h-full"
                />
              </div>
              <h2 className="text-5xl font-bold mt-2 text-white">{Math.round(weatherData.current.temp)}°{unit === 'metric' ? 'C' : 'F'}</h2>
              <p className="text-xl capitalize mt-2 text-gray-300">{weatherData.current.description}</p>
            </div>
            
            {/* 3rd container - Date and Location */}
            <div className="flex flex-col items-center justify-center text-center mt-auto">
              <p className="text-lg font-medium text-gray-300">
                {new Date(weatherData.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="text-lg font-medium mt-1 text-gray-300">{weatherData.location}</p>
            </div>
          </div>
          
          {/* Right Column (4fr) */}
          <div className="flex flex-col gap-6 md:col-span-4 md:h-screen p-4">
            {/* 1st container - Search and unit toggle */}
            <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-box shadow-md">
              <div className="flex-grow mr-4">
                <SearchBar onSearch={handleSearch} />
              </div>
              <UnitToggle unit={unit} onUnitChange={handleUnitChange} />
            </div>
            
            {/* 2nd container - 3-day forecast */}
            <div className="bg-gray-800/50 p-6 rounded-box shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-white text-center">3-Day Forecast</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {weatherData.forecast && weatherData.forecast.length > 0 ? (
                  weatherData.forecast.map((day, index) => (
                    <ForecastCard key={index} day={day} unit={unit} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-gray-300">
                    <p>No forecast data available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 3rd container - Wind status and Humidity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wind Status */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 rounded-2xl shadow-lg border border-gray-700/50">
                <div className="flex flex-col gap-8 items-center">
                  <h3 className="text-xl font-semibold mb-2 text-white text-center">Wind Status</h3>
                  
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Circle outline */}
                    <div className="absolute w-28 h-28 rounded-full border border-gray-600/40"></div>
                    
                    {/* Cardinal directions */}
                    <div className="text-xs text-gray-500 absolute" style={{ top: '2px' }}>N</div>
                    <div className="text-xs text-gray-500 absolute" style={{ bottom: '2px' }}>S</div>
                    <div className="text-xs text-gray-500 absolute" style={{ right: '2px' }}>E</div>
                    <div className="text-xs text-gray-500 absolute" style={{ left: '2px' }}>W</div>
                    
                    {/* Wind direction indicator */}
                    <div 
                      className="absolute w-full h-full flex items-center justify-center transform-gpu"
                      style={{ 
                        transform: `rotate(${weatherData.current.wind.deg + 90}deg)`,
                        transformOrigin: 'center'
                      }}
                    >
                      <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-400"></div>
                    </div>
                    
                    {/* Blue dot in center */}
                    <div className="w-2 h-2 rounded-full bg-blue-400 absolute z-10"></div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <p className="text-4xl font-bold text-white mb-2">
                      {weatherData.current.wind.speed} <span className="text-lg font-normal text-blue-300">{unit === 'metric' ? 'km/h' : 'mph'}</span>
                    </p>
                    <p className="text-sm text-blue-300 font-medium">
                      Direction: {weatherData.current.wind.deg}°
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Humidity */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 p-6 rounded-2xl shadow-lg border border-gray-700/50">
                <div className="flex flex-col gap-8 items-center">
                  <h3 className="text-xl font-semibold mb-2 text-white text-center">Humidity</h3>
                  
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-700 stroke-current"
                        strokeWidth="10"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-500 stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${weatherData.current.humidity * 2.51} 251`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl font-bold text-white">{weatherData.current.humidity}<span className="text-lg">%</span></p>
                    </div>
                  </div>
                  
                  <div className="w-full flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" 
                        style={{ width: `${weatherData.current.humidity}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-xs text-blue-300 mt-1">Percent humidity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherClient;
