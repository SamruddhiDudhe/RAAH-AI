import React from 'react';
import {
  Truck,
  AlertTriangle,
  Route,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  Flame,
  Radio,
  Share2,
} from 'lucide-react';
import { RoadSegment, Incident, Vehicle, LogisticsHub, SystemAlert } from '../../types';
import { NortheastMap } from '../gis/NortheastMap';
import { ScreenId } from '../layout/Sidebar';

interface DashboardScreenProps {
  roads: RoadSegment[];
  incidents: Incident[];
  vehicles: Vehicle[];
  hubs: LogisticsHub[];
  alerts: SystemAlert[];
  onNavigate: (screen: ScreenId) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectIncident: (incident: Incident) => void;
  onSelectRoad: (road: RoadSegment) => void;
  onRerouteVehicle: (vehicleId: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  roads,
  incidents,
  vehicles,
  hubs,
  alerts,
  onNavigate,
  onSelectVehicle,
  onSelectIncident,
  onSelectRoad,
  onRerouteVehicle,
}) => {
  // Key KPI metrics
  const activeVehiclesCount = vehicles.filter((v) => v.status === 'in_transit' || v.status === 'rerouted').length;
  const criticalVehiclesCount = vehicles.filter((v) => v.cargoCategory === 'CRITICAL').length;
  const highRiskRoadsCount = roads.filter((r) => r.status === 'high_risk' || r.status === 'blocked').length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== 'cleared').length;
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);

  // Overall accessibility score calculation (average safety score of major corridors)
  const avgSafetyScore = Math.round(
    roads.reduce((acc, r) => acc + (100 - r.riskScore), 0) / (roads.length || 1)
  );

  return (
    <div className="space-y-5">
      {/* Emergency Active Alert Banner */}
      {unacknowledgedAlerts.length > 0 && unacknowledgedAlerts[0] && (
        <div className="bg-gradient-to-r from-red-950/90 via-red-900/60 to-slate-900 border border-red-700/80 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-600/30 text-red-400 border border-red-500/40 mt-0.5">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                  Critical Alert ({unacknowledgedAlerts.length} Active)
                </span>
                <span className="text-xs text-red-300 font-semibold">{unacknowledgedAlerts[0]?.title}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {unacknowledgedAlerts[0]?.recommendedAction}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              onClick={() => onNavigate('route_optimization')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-1.5"
            >
              <Route className="w-3.5 h-3.5" />
              <span>Review AI Alternate Route</span>
            </button>
            <button
              onClick={() => onNavigate('alerts')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              Alert Center
            </button>
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {/* Metric 1: Active Vehicles */}
        <div
          onClick={() => onNavigate('vehicles')}
          className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Vehicles</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{activeVehiclesCount}</span>
            <span className="text-[11px] font-bold text-emerald-400">
              {criticalVehiclesCount} Critical
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Tracking cold-chain & rations</span>
          </div>
        </div>

        {/* Metric 2: High-Risk Roads */}
        <div
          onClick={() => onNavigate('gis_map')}
          className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">High-Risk Corridors</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{highRiskRoadsCount}</span>
            <span className="text-[11px] font-bold text-red-400">1 Blocked</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            NH-6 Barapani & NH-10 Teesta
          </div>
        </div>

        {/* Metric 3: Active Incidents */}
        <div
          onClick={() => onNavigate('incidents')}
          className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Incidents</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{activeIncidentsCount}</span>
            <span className="text-[11px] font-bold text-amber-400">2 Under Clear</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            BRO & NDRF Units deployed
          </div>
        </div>

        {/* Metric 4: Deliveries in Progress */}
        <div
          onClick={() => onNavigate('vehicles')}
          className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Deliveries in Transit</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">6</span>
            <span className="text-[11px] font-bold text-emerald-400">83% On-Time</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Vaccines, Oxygen, Fortified Food
          </div>
        </div>

        {/* Metric 5: Accessibility Score */}
        <div
          onClick={() => onNavigate('analytics')}
          className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-lg cursor-pointer transition group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Accessibility Index</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{avgSafetyScore}%</span>
            <span className="text-[11px] font-bold text-slate-300">Moderate</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Regional highway operability
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive GIS Map + Live Activity Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left 2 Cols: Interactive Northeast GIS Map */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                Northeast India Real-Time GIS Logistics Grid
              </h2>
            </div>
            <button
              onClick={() => onNavigate('gis_map')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 hover:underline"
            >
              <span>Full Screen GIS & Filters</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <NortheastMap
            roads={roads}
            incidents={incidents}
            vehicles={vehicles}
            hubs={hubs}
            onSelectVehicle={onSelectVehicle}
            onSelectIncident={onSelectIncident}
            onSelectRoad={onSelectRoad}
          />
        </div>

        {/* Right Col: High-Priority Decision Feeds */}
        <div className="space-y-4">
          {/* Key USP Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>RAAH AI Core Mission</span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              “RAAH AI does not just predict disruptions.
              It converts prediction into an actionable logistics decision.”
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Active Decision Support:</span>
              <button
                onClick={() => onNavigate('route_optimization')}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <span>Optimize Route</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Critical Vehicle Telemetry Mini-List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                Priority Fleets In Transit
              </h3>
              <button
                onClick={() => onNavigate('vehicles')}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                View All ({vehicles.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {vehicles.slice(0, 3).map((v) => {
                const isCritical = v.cargoCategory === 'CRITICAL';
                return (
                  <div
                    key={v.id}
                    onClick={() => onSelectVehicle(v)}
                    className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-white">{v.code}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            isCritical
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {v.cargoCategory}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{v.eta}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 truncate font-medium">{v.cargoType}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate max-w-[140px]">{v.currentLocationName}</span>
                      <span
                        className={`font-semibold ${
                          v.routeRisk === 'high_risk'
                            ? 'text-red-400'
                            : v.routeRisk === 'moderate'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {v.routeRisk.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {v.alternateRouteAvailable && v.status === 'in_transit' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRerouteVehicle(v.id);
                        }}
                        className="mt-2 w-full py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-semibold transition"
                      >
                        AI Reroute Suggested (Save 2h 35m)
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Ground Disruptions Mini-List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                Active Ground Disruptions
              </h3>
              <button
                onClick={() => onNavigate('incidents')}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Inspect Details
              </button>
            </div>

            <div className="space-y-2">
              {incidents.slice(0, 2).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[180px]">
                      {inc.title}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 uppercase">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{inc.locationName}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-amber-400 font-mono">
                    <span>AI Risk: {inc.aiRiskScore}%</span>
                    <span className="text-slate-500">{inc.estimatedClearingTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Highway Network Operational Status Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Northeast National Highway Status Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Live automated surveillance from PWD, BRO, Geological Survey & Weather Radar
            </p>
          </div>
          <button
            onClick={() => onNavigate('risk_prediction')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 self-start md:self-auto"
          >
            <span>Run AI Slope Stability Assessment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {roads.slice(0, 4).map((road) => {
            const isSafe = road.status === 'safe';
            const isBlocked = road.status === 'blocked';
            const isHigh = road.status === 'high_risk';

            return (
              <div
                key={road.id}
                onClick={() => onSelectRoad(road)}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-200 font-mono">{road.highwayCode}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      isSafe
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isBlocked
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : isHigh
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {road.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-300 truncate">{road.name}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Rain 24h: {road.currentWeather.rainfall24hMm}mm</span>
                  <span className="font-mono font-bold text-slate-300">Risk: {road.riskScore}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
