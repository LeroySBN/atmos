'use client';

import React from 'react';
import Image from 'next/image';

interface ForecastDay {
  date: string;
  icon: string;
  temp_min: number;
  temp_max: number;
  description: string;
}

interface ForecastCardProps {
  day: ForecastDay;
  unit: 'metric' | 'imperial';
}

const ForecastCard: React.FC<ForecastCardProps> = ({ day, unit }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
    });
  };

  // Get the weather icon URL
  const getIconUrl = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // Get temperature unit symbol
  const tempUnit = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">{formatDate(day.date)}</h3>
      <div className="flex justify-center mb-3">
        <div className="relative w-24 h-24 p-1 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 shadow-inner flex items-center justify-center">
          <div className="absolute inset-0 rounded-full overflow-hidden bg-blue-50">
            <div className="absolute inset-0 bg-opacity-20 bg-blue-200"></div>
          </div>
          <Image
            src={getIconUrl(day.icon)}
            alt={day.description}
            width={70}
            height={70}
            priority
            className="relative z-10 drop-shadow-md"
          />
        </div>
      </div>
      <div className="mt-2">
        <p className="capitalize text-sm text-gray-500 mb-2">{day.description}</p>
        <p className="text-base font-medium text-gray-800">
          <span className="text-blue-600">{Math.round(day.temp_min)}</span>
          <span className="mx-1">-</span>
          <span className="text-red-500">{Math.round(day.temp_max)}</span>
          <span className="text-gray-800">{tempUnit}</span>
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;
