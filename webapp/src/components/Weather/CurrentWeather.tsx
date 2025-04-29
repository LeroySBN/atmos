'use client';

import React from 'react';
import Image from 'next/image';

interface CurrentWeatherProps {
  data: {
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
  };
  unit: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get the weather icon URL
  const getIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // Get temperature unit symbol
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'km/h' : 'mph';

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative w-24 h-24">
              <Image
                src={getIconUrl(data.current.icon)}
                alt={data.current.description}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <h2 className="text-4xl font-bold mt-2">{Math.round(data.current.temp)}{tempUnit}</h2>
            <p className="text-xl capitalize">{data.current.description}</p>
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{data.location}</h1>
          <p className="text-lg mb-4">{formatDate(data.date)}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Wind Status</div>
              <div className="stat-value text-2xl">{data.current.wind.speed} {speedUnit}</div>
              <div className="stat-desc">
                <span className="inline-block transform" style={{ transform: `rotate(${data.current.wind.deg}deg)` }}>
                  ↑
                </span>
              </div>
            </div>
            
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Humidity</div>
              <div className="stat-value text-2xl">{data.current.humidity}%</div>
              <div className="stat-desc">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${data.current.humidity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
