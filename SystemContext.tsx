
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherCondition, WeatherType } from './types';

interface SystemContextType {
  weather: WeatherCondition;
  reportingCycle: number;
  isAutoMode: boolean;
  setReportingCycle: (cycle: number) => void;
  setIsAutoMode: (mode: boolean) => void;
}

const WEATHER_STAGES: WeatherCondition[] = [
  { type: 'sunny', label: 'Clear Skies', temp: 28, humidity: 30, suggestedCycle: 60 },
  { type: 'cloudy', label: 'Overcast', temp: 24, humidity: 45, suggestedCycle: 30 },
  { type: 'rainy', label: 'Light Rain', temp: 20, humidity: 85, suggestedCycle: 10 },
  { type: 'storm', label: 'Heavy Storm', temp: 18, humidity: 95, suggestedCycle: 5 },
];

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weatherIdx, setWeatherIdx] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [manualCycle, setManualCycle] = useState(15);

  // Simulate Weather API Cycling every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setWeatherIdx((prev) => (prev + 1) % WEATHER_STAGES.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const weather = WEATHER_STAGES[weatherIdx];
  const currentCycle = isAutoMode ? weather.suggestedCycle : manualCycle;

  return (
    <SystemContext.Provider value={{ 
      weather, 
      reportingCycle: currentCycle, 
      isAutoMode, 
      setReportingCycle: setManualCycle,
      setIsAutoMode 
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};
