export type DeviceStatus = 'normal' | 'warning' | 'alarm';

export interface Device {
  id: string;
  type: 'LoRaWAN' | 'DualMode'; // LoRa + NB
  status: DeviceStatus;
  location: [number, number]; // [longitude, latitude]
  waterLevel: number; // cm
  methane: number; // %VOL
  tilt: number; // degrees
  voltage: number; // V
  lastUpdate: string;
}

export interface KPIStats {
  totalDevices: number;
  alarmCount: number;
  onlineRate: string;
  avgVoltage: string;
}

export interface TrendDataPoint {
  time: string;
  value: number;
}