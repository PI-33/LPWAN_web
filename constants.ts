import { Device } from './types';

// ==========================================
// 📍 校园地图区域配置 (CAMPUS CONFIGURATION)
// Updated with user provided coordinates
// Top-Right (NE): 116.36057, 39.96486
// Bottom-Left (SW): 116.35561, 39.96021
// ==========================================
export const CAMPUS_BOUNDS = {
  minLng: 116.35561, // 左下角经度
  maxLng: 116.36057, // 右上角经度
  minLat: 39.96021,  // 左下角纬度
  maxLat: 39.96486   // 右上角纬度
};

const generateRandomFloat = (min: number, max: number, decimals: number = 2): number => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

export const generateMockData = (): Device[] => {
  const devices: Device[] = [];
  const { minLng, maxLng, minLat, maxLat } = CAMPUS_BOUNDS;

  // Generate 95 Normal Devices distributed within the campus bounds
  for (let i = 1; i <= 95; i++) {
    devices.push({
      id: `DEV-${i.toString().padStart(3, '0')}`,
      type: Math.random() > 0.8 ? 'DualMode' : 'LoRaWAN',
      status: 'normal',
      location: [
        generateRandomFloat(minLng, maxLng, 6),
        generateRandomFloat(minLat, maxLat, 6)
      ],
      waterLevel: Math.floor(generateRandomFloat(10, 50, 0)),
      methane: 0,
      tilt: generateRandomFloat(0, 3, 1),
      voltage: generateRandomFloat(3.4, 3.8, 2),
      lastUpdate: "2026-01-20 10:00:00"
    });
  }

  // Generate 5 Abnormal Devices
  for (let i = 96; i <= 100; i++) {
    devices.push({
      id: `DEV-${i.toString().padStart(3, '0')}`,
      type: 'DualMode',
      status: 'alarm',
      location: [
        generateRandomFloat(minLng, maxLng, 6),
        generateRandomFloat(minLat, maxLat, 6)
      ],
      waterLevel: 800, // Alarm > 100
      methane: 1.5, // Alarm > 0.5
      tilt: 20, // Alarm > 15
      voltage: 3.2,
      lastUpdate: "2026-01-20 10:05:00"
    });
  }

  return devices;
};

export const MOCK_DATA_LIST = generateMockData();

// Helper to generate trend data for charts based on device status
export const generateTrendData = (type: 'water' | 'methane', status: 'normal' | 'warning' | 'alarm') => {
  const data: { time: string; value: number }[] = [];
  
  for (let i = 0; i < 24; i++) {
    const timeStr = `${i.toString().padStart(2, '0')}:00`;
    let value = 0;

    if (type === 'water') {
      // Normal: 20-50, Alarm: Spike to 800 at some point
      if (status === 'normal') {
        value = Math.floor(Math.random() * 30) + 20;
      } else {
        // Create a rising trend or a massive spike
        value = i > 18 ? 750 + Math.random() * 100 : Math.floor(Math.random() * 50) + 40;
      }
    } else {
      // Methane
      if (status === 'normal') {
        value = 0;
      } else {
        // Spike in the last few hours
        value = i > 20 ? 1.4 + Math.random() * 0.2 : Math.random() * 0.1;
      }
    }

    data.push({ time: timeStr, value });
  }
  return data;
};