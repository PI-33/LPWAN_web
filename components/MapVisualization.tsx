import React, { useEffect, useRef } from 'react';
import { Device } from '../types';
import { CAMPUS_BOUNDS } from '../constants';
import { Navigation, Grip, Layers } from 'lucide-react';

// Declare Leaflet types (since we are using CDN and not npm package for types)
declare global {
  interface Window {
    L: any;
  }
}

interface MapVisualizationProps {
  devices: Device[];
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ devices }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    // 1. Calculate Center from Bounds
    const centerLat = (CAMPUS_BOUNDS.minLat + CAMPUS_BOUNDS.maxLat) / 2;
    const centerLng = (CAMPUS_BOUNDS.minLng + CAMPUS_BOUNDS.maxLng) / 2;

    // 2. Initialize Map if not exists
    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 17,
        zoomControl: false,
        attributionControl: false,
        minZoom: 15,
        maxZoom: 19
      });

      mapInstanceRef.current = map;

      // 3. Add Tile Layer (Using CartoDB Dark Matter for Sci-Fi look)
      // This is a free, dark-themed tile set perfect for dashboards.
      // If you have a Gaode Key, you could use standard XYZ tiles, but they are usually bright.
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
      }).addTo(map);

      // Add a boundary rectangle for the campus
      const bounds = [
        [CAMPUS_BOUNDS.minLat, CAMPUS_BOUNDS.minLng],
        [CAMPUS_BOUNDS.maxLat, CAMPUS_BOUNDS.maxLng]
      ];
      
      window.L.rectangle(bounds, {
        color: "#3b82f6", 
        weight: 1, 
        fillColor: "#3b82f6", 
        fillOpacity: 0.1,
        dashArray: '5, 10'
      }).addTo(map);
    }

    // 4. Update Markers
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    devices.forEach(device => {
        // Determine color based on status
        const isAlarm = device.status !== 'normal';
        const colorClass = isAlarm ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
        const pulseClass = isAlarm ? 'animate-ping' : '';
        
        // Custom HTML Icon for the glowing dot effect
        const customIcon = window.L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="relative w-full h-full flex items-center justify-center">
                 ${isAlarm ? `<div class="absolute w-full h-full rounded-full bg-red-500 opacity-75 ${pulseClass}"></div>` : ''}
                 <div class="relative w-3 h-3 rounded-full ${colorClass} border-2 border-slate-900"></div>
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = window.L.marker([device.location[1], device.location[0]], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
                <div class="font-sans">
                    <div class="flex justify-between items-center mb-1">
                        <strong class="text-slate-100">${device.id}</strong>
                        <span class="text-[10px] uppercase px-1.5 py-0.5 rounded ${isAlarm ? 'bg-red-900 text-red-200' : 'bg-emerald-900 text-emerald-200'}">${device.status}</span>
                    </div>
                    <div class="text-xs text-slate-400 space-y-0.5">
                        <div>Type: <span class="text-slate-200">${device.type}</span></div>
                        <div>Water: <span class="${device.waterLevel > 100 ? 'text-red-400' : 'text-slate-200'}">${device.waterLevel} cm</span></div>
                        <div>Methane: <span class="${device.methane > 0.5 ? 'text-red-400' : 'text-slate-200'}">${device.methane} %</span></div>
                    </div>
                </div>
            `);
        
        markersRef.current.push(marker);
    });

  }, [devices]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden group">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" style={{background: '#0f172a'}}></div>

      {/* Decorative Overlays (UI on top of map) */}
      <div className="absolute top-4 left-4 z-[400] w-4 h-4 border-t-2 border-l-2 border-blue-500/50 pointer-events-none"></div>
      <div className="absolute top-4 right-4 z-[400] w-4 h-4 border-t-2 border-r-2 border-blue-500/50 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 z-[400] w-4 h-4 border-b-2 border-l-2 border-blue-500/50 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 z-[400] w-4 h-4 border-b-2 border-r-2 border-blue-500/50 pointer-events-none"></div>

      {/* Info Label */}
      <div className="absolute bottom-4 right-4 z-[400] bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700 text-xs text-slate-400 flex items-center gap-2 shadow-lg">
         <Navigation size={12} className="text-blue-400"/>
         <span>Zone: 116.355 - 116.360</span>
         <span className="text-slate-600">|</span>
         <Layers size={12} className="text-slate-500"/>
         <span>Satellite Mode</span>
      </div>
    </div>
  );
};

export default MapVisualization;