import React, { useState } from 'react';
import {
  AlertOctagon,
  MapPin,
  Clock,
  Shield,
  Truck,
  CloudRain,
  Activity,
  Cpu,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  User,
  BadgeAlert,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Incident, Vehicle, RoadSegment } from '../../types';
import { NortheastMap } from '../gis/NortheastMap';
import { ScreenId } from '../layout/Sidebar';

interface IncidentDetailsScreenProps {
  incidents: Incident[];
  selectedIncident: Incident;
  onSelectIncident: (inc: Incident) => void;
  vehicles: Vehicle[];
  roads: RoadSegment[];
  onNavigate: (screen: ScreenId) => void;
  onRerouteVehicle: (vehicleId: string) => void;
}

export const IncidentDetailsScreen: React.FC<IncidentDetailsScreenProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  vehicles,
  roads,
  onNavigate,
  onRerouteVehicle,
}) => {
  const [clearingDispatched, setClearingDispatched] = useState<boolean>(false);

  const activeIncident = selectedIncident || incidents[0];

  if (!activeIncident) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
        <AlertOctagon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <h3 className="text-base font-bold text-white">No Incidents Recorded</h3>
        <p className="text-xs text-slate-400 mt-1">All highway sectors report normal accessibility.</p>
      </div>
    );
  }

  const isCritical = activeIncident.severity === 'critical';
  const isHigh = activeIncident.severity === 'high';

  const affectedVehicles = vehicles.filter((v) =>
    activeIncident.affectedVehicleIds?.includes(v.code)
  );

  const handleDispatchClearance = () => {
    setClearingDispatched(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setClearingDispatched(false), 4500);
  };

  return (
    <div className="space-y-5">
      {/* Top Selector Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono">
            INCIDENT INVESTIGATION & REMEDIATION DOSSIER
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Select Active Disruption to Inspect Geotechnical Telemetry
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeIncident.id}
            onChange={(e) => {
              const found = incidents.find((i) => i.id === e.target.value);
              if (found) onSelectIncident(found);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id}: {inc.title} ({inc.severity.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clearance Dispatch Notification */}
      {clearingDispatched && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Emergency Clearing Unit Mobilized!</span>
              <p className="text-[11px] text-emerald-300">
                {activeIncident.responseAgency} alerted with Heavy Earthmovers & Tow Winches. Priority green bypass engaged.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/60 px-2 py-1 rounded">
            BRO / NDRF TASKED
          </span>
        </div>
      )}

      {/* Main Incident Dossier Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-6">
        {/* Header with Title, Severity, and Reported By */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {activeIncident.id}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  isCritical
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : isHigh
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}
              >
                {activeIncident.severity} SEVERITY • {activeIncident.type.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Reported: {activeIncident.reportedAt}
              </span>
            </div>

            <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
              {activeIncident.title}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{activeIncident.locationName}</span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-slate-400">{activeIncident.milestoneKm}</span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-emerald-400">
                GPS: {activeIncident.coords?.lat}°N, {activeIncident.coords?.lng}°E
              </span>
            </p>
          </div>

          {/* Action Button: Dispatch clearing */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={handleDispatchClearance}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950 transition flex items-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Deploy Emergency Clearance Team</span>
            </button>
          </div>
        </div>

        {/* 2 Columns: Photo & Geographic Evidence vs Ground Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Field Photograph & Mini Map */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Field Photograph (Verified Mobile Officer Evidence)
              </span>
              <div className="h-64 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group">
                <img
                  src={activeIncident.photoUrl}
                  alt={activeIncident.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-slate-200 border border-slate-700">
                  CAMERA TIMESTAMP: {activeIncident.reportedAt}
                </div>
                <div className="absolute bottom-2 right-2 bg-red-950/90 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded border border-red-800">
                  EST. CLEARING: {activeIncident.estimatedClearingTime}
                </div>
              </div>
            </div>

            {/* Officer & Reporting Agency Badge */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">{activeIncident.reportedBy?.name}</div>
                  <div className="text-[11px] text-slate-400">
                    Badge: {activeIncident.reportedBy?.badge} • {activeIncident.reportedBy?.department}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                GOVT VERIFIED
              </span>
            </div>
          </div>

          {/* Right: Technical Telemetry (Weather, AI Prediction, Roads, Vehicles) */}
          <div className="space-y-4">
            {/* Incident Description */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Ground Situation Report
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeIncident.description}
              </p>
            </div>

            {/* Weather Conditions at Site (Prompt Requirement) */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                  <CloudRain className="w-3 h-3 text-blue-400" />
                  Site Weather
                </div>
                <div className="font-bold text-slate-200 mt-0.5">
                  {activeIncident.weatherCondition}
                </div>
                <div className="text-[11px] text-slate-400">
                  Precipitation: {activeIncident.rainfallMm} mm / 24h
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Response Taskforce
                </div>
                <div className="font-bold text-slate-200 mt-0.5">
                  {activeIncident.responseAgency}
                </div>
                <div className="text-[11px] text-amber-400">
                  Heavy JCB & Winch On Route
                </div>
              </div>
            </div>

            {/* AI Risk Prediction (Prompt Requirement) */}
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-red-400" />
                  AI Failure Prediction Analysis
                </span>
                <span className="font-mono font-bold text-red-400 text-sm">
                  Risk Score: {activeIncident.aiRiskScore}%
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeIncident.aiPredictionReasoning}
              </p>
            </div>

            {/* Affected Roads & Affected Vehicles (Prompt Requirement) */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  Affected Road Corridors
                </span>
                <div className="space-y-0.5">
                  {activeIncident.affectedRoads?.map((rd, i) => (
                    <div key={i} className="text-slate-200 text-[11px] font-medium truncate">
                      • {rd}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                  Affected Supply Vehicles
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeIncident.affectedVehicleIds?.map((vCode) => (
                    <span
                      key={vCode}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs"
                    >
                      {vCode}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Action (Prompt Requirement) */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-600/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Recommended Action
                </span>
                <span className="text-[10px] font-mono text-emerald-400">AUTHORITY ACTION</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeIncident.recommendedAction}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('route_optimization')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Engage Alternate Route B</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Micro-GIS Map View highlighting the Incident Location */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Micro-GIS Hazard Zone & Alternate Bypass Overlay
            </h3>
            <span className="text-xs font-mono text-slate-400">
              LOCATION: {activeIncident.locationName}
            </span>
          </div>

          <NortheastMap
            roads={roads}
            incidents={incidents}
            vehicles={vehicles}
            hubs={[]}
            selectedIncidentId={activeIncident.id}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
};
