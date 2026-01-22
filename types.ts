
export type DeviceStatus = 'normal' | 'warning' | 'alarm';
export type UserRole = 'manager' | 'maintenance';
export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'storm';

export interface WeatherCondition {
  type: WeatherType;
  label: string;
  temp: number;
  humidity: number;
  suggestedCycle: number;
}

export interface Device {
  id: string;
  type: 'LoRaWAN' | 'DualMode';
  status: DeviceStatus;
  location: [number, number];
  waterLevel: number;
  methane: number;
  tilt: number;
  voltage: number;
  lastUpdate: string;
  isLocked: boolean;
  reportingCycle: number;
}

export interface KPIStats {
  totalDevices: number;
  alarmCount: number;
  onlineRate: string;
  avgVoltage: string;
}
