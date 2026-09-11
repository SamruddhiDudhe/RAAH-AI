import React, { useState } from 'react';
import {
  Filter,
  Layers,
  MapPin,
  Shield,
  Truck,
  AlertTriangle,
  Building2,
  CloudRain,
  RotateCcw,
  SlidersHorizontal,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { RoadSegment, Incident, Vehicle, LogisticsHub } from '../../types';
import { NortheastMap } from '../gis/NortheastMap';

interface GisMapScreenProps {
  roads: RoadSegment[];
  incidents: Incident[];
  vehicles: Vehicle[];
  hubs: LogisticsHub[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectIncident: (incident: Incident) => void;
  onSelectRoad: (road: RoadSegment) => void;
}

export const GisMapScreen: React.FC<GisMapScreenProps> = ({
  roads,
  incidents,
  vehicles,
  hubs,
  onSelectVehicle,
  onSelectIncident,
  onSelectRoad,
}) => {
  // Filter states
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');
  const [filterWeather, setFilterWeather] = useState<string>('all');
  const [filterRoadStatus, setFilterRoadStatus] = useState<string>('all');
  const [filterVehicleCat, setFilterVehicleCat] = useState<string>('all');
  const [filterIncidentType, setFilterIncidentType] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');

  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'road' | 'incident' | 'vehicle' | 'hub';
    data: any;
  } | null>(null);

  // Extract unique districts
  const districts = Array.from(new Set(roads.map((r) => r.district)));

  // Filter vehicles according to vehicle category filter
  const filteredVehicles = vehicles.filter((v) => {
    if (filterVehicleCat !== 'all' && v.cargoCategory !== filterVehicleCat) return false;
    return true;
  });

  const handleResetFilters = () => {
    setFilterRiskLevel('all');
    setFilterWeather('all');
    setFilterRoadStatus('all');
    setFilterVehicleCat('all');
    setFilterIncidentType('all');
    setFilterDistrict('all');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>GIS Accessibility Multi-Criteria Filter Controls</span>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Risk Level Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">
              Risk Level
            </label>
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="safe">Safe (Green)</option>
              <option value="moderate">Moderate (Yellow)</option>
              <option value="high_risk">High Risk (Red)</option>
              <option value="blocked">Blocked (Dark Red)</option>
            </select>
          </div>

          {/* 2. Weather Condition */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">
              Weather / Rain
            </label>
            <select
              value={filterWeather}
              onChange={(e) => setFilterWeather(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Weather</option>
              <option value="heavy_rain">Heavy Rain (&gt;100mm)</option>
              <option value="cloudburst">Cloudburst Surge</option>
              <option value="moderate">Light / Moderate</option>
            </select>
          </div>

          {/* 3. Road Status */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">
              Road Operability
            </label>
            <select
              value={filterRoadStatus}
              onChange={(e) => setFilterRoadStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Highways</option>
              <option value="nh">National Highways (NH)</option>
              <option value="sh">State Bypass (SH)</option>
            </select>
          </div>

          {/* 4. Vehicle Category */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">
              Vehicle Priority
            </label>
            <select
              value={filterVehicleCat}
              onChange={(e) => setFilterVehicleCat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Vehicles</option>
              <option value="CRITICAL">Critical (Medicines/Oxygen)</option>
              <option value="HIGH">High (Food / Relief)</option>
              <option value="NORMAL">Normal (Supplies / PWD)</option>
            </select>
          </div>

          {/* 5. Incident Type */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">
              Disruption Type
            </label>
            <select
              value={filterIncidentType}
              onChange={(e) => setFilterIncidentType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Disruption Types</option>
              <option value="landslide">Landslides</option>
              <option value="flood">Floods / Submergence</option>
              <option value="road_damage">Structural Washout</option>
              <option value="road_blockage">Soil Creep & Blockage</option>
            </select>
          </div>

          {/* 6. District */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">
              Administrative District
            </label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map View + Selected Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Large GIS Map Canvas (3 Columns) */}
        <div className="lg:col-span-3">
          <NortheastMap
            roads={roads}
            incidents={incidents}
            vehicles={filteredVehicles}
            hubs={hubs}
            filterRiskLevel={filterRiskLevel}
            filterDistrict={filterDistrict}
            filterIncidentType={filterIncidentType}
            onSelectVehicle={(v) => {
              setSelectedEntity({ type: 'vehicle', data: v });
              onSelectVehicle(v);
            }}
            onSelectIncident={(i) => {
              setSelectedEntity({ type: 'incident', data: i });
              onSelectIncident(i);
            }}
            onSelectRoad={(r) => {
              setSelectedEntity({ type: 'road', data: r });
              onSelectRoad(r);
            }}
          />
        </div>

        {/* Right Sidebar: Active Entity Inspector & GIS Intelligence Feed */}
        <div className="space-y-3">
          {/* Selected Entity Card */}
          {selectedEntity ? (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Inspector: {selectedEntity.type.toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              {selectedEntity.type === 'vehicle' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-white">
                      {selectedEntity.data.code}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                      {selectedEntity.data.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="font-medium text-slate-200">{selectedEntity.data.cargoType}</p>
                  <div className="space-y-1 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <p>
                      <strong>Operator:</strong> {selectedEntity.data.operatorOrg}
                    </p>
                    <p>
                      <strong>Driver:</strong> {selectedEntity.data.driverName} ({selectedEntity.data.driverPhone})
                    </p>
                    <p>
                      <strong>Route ETA:</strong> {selectedEntity.data.eta}
                    </p>
                    <p>
                      <strong>Speed:</strong> {selectedEntity.data.speedKmh} km/h (Fuel: {selectedEntity.data.fuelPct}%)
                    </p>
                  </div>
                  {selectedEntity.data.temperatureControlled && (
                    <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800 text-[11px] text-cyan-300">
                      Cold-Chain: {selectedEntity.data.currentTempC}°C (Target: {selectedEntity.data.targetTempC}°C) - Battery Optimal
                    </div>
                  )}
                </div>
              )}

              {selectedEntity.type === 'incident' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-red-400">{selectedEntity.data.title}</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold uppercase text-[10px]">
                      {selectedEntity.data.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedEntity.data.description}
                  </p>
                  <div className="space-y-1 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <p>
                      <strong>Location:</strong> {selectedEntity.data.locationName}
                    </p>
                    <p>
                      <strong>Reported By:</strong> {selectedEntity.data.reportedBy.name} ({selectedEntity.data.reportedBy.department})
                    </p>
                    <p>
                      <strong>Est. Clearing:</strong>{' '}
                      <span className="text-amber-400 font-bold">
                        {selectedEntity.data.estimatedClearingTime}
                      </span>
                    </p>
                    <p>
                      <strong>Response:</strong> {selectedEntity.data.responseAgency}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-800/80 text-[10px] text-amber-300">
                    AI Recommended Action: {selectedEntity.data.recommendedAction}
                  </div>
                </div>
              )}

              {selectedEntity.type === 'road' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{selectedEntity.data.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedEntity.data.highwayCode}</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <p>
                      <strong>Length:</strong> {selectedEntity.data.lengthKm} km
                    </p>
                    <p>
                      <strong>Risk Score:</strong>{' '}
                      <span className="text-white font-bold">{selectedEntity.data.riskScore}/100</span>
                    </p>
                    <p>
                      <strong>Slope Gradient:</strong> {selectedEntity.data.elevationProfile.avgSlopeDeg}° (Max: {selectedEntity.data.elevationProfile.maxM}m ASL)
                    </p>
                    <p>
                      <strong>Precipitation:</strong> {selectedEntity.data.currentWeather.rainfall24hMm}mm / 24h
                    </p>
                  </div>
                  <p className="p-2 rounded bg-slate-950 text-[10px] text-slate-300 italic border border-slate-800">
                    "{selectedEntity.data.aiExplanation}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg text-center py-6 text-slate-400 text-xs">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">Interactive Entity Inspector</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Click on any highway, vehicle marker, or incident hazard on the map to inspect live geotechnical telemetry.
              </p>
            </div>
          )}

          {/* Strategic Logistics Hubs & Warehouses List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2.5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Key Logistics Hubs & Hospitals
            </h3>
            <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
              {hubs.map((hub) => (
                <div
                  key={hub.id}
                  className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-300 truncate max-w-[160px] text-[11px]">
                      {hub.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {hub.city}, {hub.state}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      hub.stockLevelPct < 40
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {hub.stockLevelPct}% Stock
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
