'use client';

import React from 'react';

interface UnitToggleProps {
  unit: 'metric' | 'imperial';
  onUnitChange: (unit: 'metric' | 'imperial') => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onUnitChange }) => {
  return (
    <div className="flex items-center space-x-1">
      <button
        className={`px-3 py-1 rounded-l-full ${unit === 'metric' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors`}
        onClick={() => onUnitChange('metric')}
        aria-pressed={unit === 'metric'}
      >
        °C
      </button>
      <button
        className={`px-3 py-1 rounded-r-full ${unit === 'imperial' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors`}
        onClick={() => onUnitChange('imperial')}
        aria-pressed={unit === 'imperial'}
      >
        °F
      </button>
    </div>
  );
};

export default UnitToggle;
