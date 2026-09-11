import React, { useState } from 'react';
import {
  Truck,
  ShieldAlert,
  Thermometer,
  Clock,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Battery,
  Gauge,
  User,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Vehicle, PriorityCategory, VehicleStatus } from '../../types';

interface VehicleTrackingScreenProps {
  vehicles: Vehicle[];
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onRerouteVehicle: (vehicleId: string) => void;
}

export const VehicleTrackingScreen: React.FC<VehicleTrackingScreenProps> = ({
  vehicles,
  onSelectVehicle,
  onRerouteVehicle,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicles[0] || null);
  const [reroutedBanner, setReroutedBanner] = useState<string | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    if (filterCategory !== 'all' && v.cargoCategory !== filterCategory) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  const handleTriggerReroute = (v: Vehicle) => {
    onRerouteVehicle(v.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setReroutedBanner(`${v.code} (${v.driverName}) has been successfully rerouted to the low-risk bypass corridor.`);
    setTimeout(() => setReroutedBanner(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Top Filter & Summary Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              ESSENTIAL FLEET RADAR
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {vehicles.length} Total Registered Supply Vehicles
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Real-Time Vehicle Tracking & Cold-Chain Telemetry
          </h2>
        </div>

        {/* Category & Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Cargo Priorities</option>
            <option value="CRITICAL">Critical (Medicines / Oxygen)</option>
            <option value="HIGH">High (Food / Water Relief)</option>
            <option value="NORMAL">Normal (Supplies / PWD)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Transit Status</option>
            <option value="in_transit">In Transit</option>
            <option value="rerouted">Rerouted (Active Bypass)</option>
            <option value="delayed">Delayed (Staged)</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Reroute Alert Success Banner */}
      {reroutedBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{reroutedBanner}</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/60 px-2 py-1 rounded">
            TRANSMITTED TO POLICE ESCORT
          </span>
        </div>
      )}

      {/* Main Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => {
          const isCritical = vehicle.cargoCategory === 'CRITICAL';
          const isHighRisk = vehicle.routeRisk === 'high_risk' || vehicle.routeRisk === 'blocked';
          const isRerouted = vehicle.status === 'rerouted';

          return (
            <div
              key={vehicle.id}
              className={`bg-slate-900 border rounded-xl p-4 shadow-lg transition flex flex-col justify-between space-y-3 ${
                isCritical
                  ? 'border-emerald-500/40 hover:border-emerald-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Code & Badges */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-white">
                      {vehicle.code}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCritical
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : vehicle.cargoCategory === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {vehicle.cargoCategory}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      isRerouted
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : vehicle.status === 'delayed'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {vehicle.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Cargo Type */}
                <h3 className="text-sm font-bold text-slate-100 flex items-start gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{vehicle.cargoType}</span>
                </h3>

                <p className="text-[11px] text-slate-400 mt-1">
                  Operator: <span className="text-slate-300">{vehicle.operatorOrg}</span>
                </p>

                {/* Route Risk Badge (Prompt Requirement) */}
                <div className="mt-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Assigned Corridor Risk:</span>
                  <span
                    className={`font-bold font-mono text-xs uppercase ${
                      vehicle.routeRisk === 'safe'
                        ? 'text-emerald-400'
                        : vehicle.routeRisk === 'moderate'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {vehicle.routeRisk.replace('_', ' ')}
                  </span>
                </div>

                {/* Location & Destination details */}
                <div className="mt-2.5 space-y-1 text-xs text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Current Location</span>
                      <span className="font-medium text-[11px]">{vehicle.currentLocationName}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 pt-1">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Destination</span>
                      <span className="font-medium text-[11px]">{vehicle.destination}</span>
                    </div>
                  </div>
                </div>

                {/* ETA and Driver details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      Estimated ETA
                    </div>
                    <div className="font-bold text-slate-200 font-mono text-[11px] mt-0.5">
                      {vehicle.eta}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      Driver
                    </div>
                    <div className="font-medium text-slate-300 text-[11px] mt-0.5 truncate">
                      {vehicle.driverName}
                    </div>
                  </div>
                </div>

                {/* Cold Chain Monitor (For pharma/vaccine trucks) */}
                {vehicle.temperatureControlled && (
                  <div className="mt-2.5 p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-mono">
                      <Thermometer className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>Cold-Chain: {vehicle.currentTempC}°C</span>
                    </div>
                    <span className="text-[10px] text-cyan-400">Target {vehicle.targetTempC}°C (Optimal)</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                {vehicle.alternateRouteAvailable && vehicle.status === 'in_transit' && (
                  <button
                    onClick={() => handleTriggerReroute(vehicle)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Reroute via Safe Bypass (+25m)</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${vehicle.driverPhone}`}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium text-center border border-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-blue-400" />
                    <span>Call Driver</span>
                  </a>

                  {onSelectVehicle && (
                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
                    >
                      Inspect GPS
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
