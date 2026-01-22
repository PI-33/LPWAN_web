
import { Device } from './types';

export const CAMPUS_BOUNDS = {
  minLng: 116.35561, 
  maxLng: 116.36057, 
  minLat: 39.96021,  
  maxLat: 39.96486   
};

const generateRandomFloat = (min: number, max: number, decimals: number = 2): number => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

export const generateMockData = (): Device[] => {
  const devices: Device[] = [];
  const { minLng, maxLng, minLat, maxLat } = CAMPUS_BOUNDS;

  for (let i = 1; i <= 100; i++) {
    const isAlarm = i > 95;
    devices.push({
      id: `DEV-${i.toString().padStart(3, '0')}`,
      type: Math.random() > 0.8 ? 'DualMode' : 'LoRaWAN',
      status: isAlarm ? 'alarm' : 'normal',
      location: [
        generateRandomFloat(minLng, maxLng, 6),
        generateRandomFloat(minLat, maxLat, 6)
      ],
      waterLevel: isAlarm ? 800 : Math.floor(generateRandomFloat(10, 50, 0)),
      methane: isAlarm ? 1.5 : 0,
      tilt: isAlarm ? 20 : generateRandomFloat(0, 3, 1),
      voltage: isAlarm ? 3.2 : generateRandomFloat(3.4, 3.8, 2),
      lastUpdate: "2026-01-20 10:00:00",
      isLocked: true,
      reportingCycle: 15
    });
  }

  return devices;
};

export const MOCK_DATA_LIST = generateMockData();

export const generateTrendData = (type: 'water' | 'methane', status: 'normal' | 'warning' | 'alarm') => {
  const data: { time: string; value: number }[] = [];
  for (let i = 0; i < 24; i++) {
    const timeStr = `${i.toString().padStart(2, '0')}:00`;
    let value = 0;
    if (type === 'water') {
      value = status === 'normal' ? Math.floor(Math.random() * 30) + 20 : (i > 18 ? 750 + Math.random() * 100 : Math.floor(Math.random() * 50) + 40);
    } else {
      value = status === 'normal' ? 0 : (i > 20 ? 1.4 + Math.random() * 0.2 : Math.random() * 0.1);
    }
    data.push({ time: timeStr, value });
  }
  return data;
};
