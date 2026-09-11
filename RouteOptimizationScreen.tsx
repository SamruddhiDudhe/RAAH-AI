import React, { useState } from 'react';
import {
  Route,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Navigation,
  Truck,
  ArrowRight,
  TrendingDown,
  Sparkles,
  MapPin,
  Flame,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_ROUTES_COMPARISON } from '../../data/mockData';
import { NortheastMap } from '../gis/NortheastMap';
import { RoadSegment, Incident, Vehicle, LogisticsHub } from '../../types';

interface RouteOptimizationScreenProps {
  roads: RoadSegment[];
  incidents: Incident[];
  vehicles: Vehicle[];
  hubs: LogisticsHub[];
  onDispatchRouteToVehicle?: (vehicleId: string, routeName: string) => void;
}

export const RouteOptimizationScreen: React.FC<RouteOptimizationScreenProps> = ({
  roads,
  incidents,
  vehicles,
  hubs,
  onDispatchRouteToVehicle,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'medicine_guwahati' | 'oxygen_silchar' | 'food_kohima'>('medicine_guwahati');
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(false);

  const scenario = MOCK_ROUTES_COMPARISON;
  const { routeA, routeB } = scenario;

  const handleDispatch = () => {
    if (onDispatchRouteToVehicle) {
      onDispatchRouteToVehicle('veh-102', routeB.name);
    }

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });

    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 4500);
  };

  return (
    <div className="space-y-5">
      {/* Scenario Header & Selection */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              DISRUPTION-AWARE ROUTE OPTIMIZATION
            </span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">CRITICAL SUPPLY DISPATCH</span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Origin: {scenario.origin} → Destination: {scenario.destination}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Active Cargo: <strong className="text-emerald-300">{scenario.cargo}</strong> (Priority: {scenario.priority})
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleDispatch}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-950 transition flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Approve & Dispatch Route B</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {dispatchedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Route B Dispatched Successfully!</span>
              <p className="text-[11px] text-emerald-300">
                Turn-by-turn bypass navigation telemetry pushed to Driver Bipul Sharma (NER-102) & Police Patrol escort.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900/60 px-2 py-1 rounded border border-emerald-700">
            SMS & IN-CABIN GPS SYNCED
          </span>
        </div>
      )}

      {/* Core USP Highlight Banner (Prompt Mandate) */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-xl p-4 shadow-lg flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              AI Decision Principle: Safety First
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
              Non-Myopic Routing
            </span>
          </div>
          <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
            The RAAH AI system <strong>prioritizes SAFER and PRACTICAL routes</strong>, not simply the shortest route.
            While Route A is 26 km shorter physically, it traverses an active 450T slope failure with 82% disruption probability. Route B guarantees arrival with intact medical cold-chain integrity.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison: Route A vs Route B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Route A Card (Shortest - High Risk) */}
        <div className="bg-slate-900/90 border-2 border-red-900/60 rounded-xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-950 text-red-400 px-3 py-1 rounded-bl-lg font-mono text-[10px] font-bold border-l border-b border-red-800">
            SHORTEST ROUTE (HAZARD ACTIVE)
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <h3 className="text-base font-bold text-slate-200">{routeA.name}</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">{routeA.summary}</p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Distance</div>
                <div className="text-base font-mono font-bold text-slate-200">{routeA.distanceKm} km</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">ETA</div>
                <div className="text-base font-mono font-bold text-red-400">{routeA.etaFormatted}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Safety Score</div>
                <div className="text-base font-mono font-bold text-red-500">{routeA.safetyScore} / 100</div>
              </div>
            </div>

            {/* Route Factors Breakdown */}
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Weather Risk:</span>
                <span className="text-red-400 font-bold">{routeA.weatherRisk} (168mm / 24h)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Traffic Condition:</span>
                <span className="text-red-400 font-bold">{routeA.trafficLevel} (Single Lane Stoppage)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Disruption Probability:</span>
                <span className="text-red-400 font-bold font-mono">{routeA.disruptionProbabilityPct}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Hazard Points:</span>
                <span className="text-red-400 font-bold">1 Active Landslide at Km 48</span>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Risk Assessment:</div>
              <div className="space-y-1">
                {routeA.cons.map((con, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-red-300 text-[11px]">
                    <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-red-400 font-mono italic">
            ⚠️ Warning: Not compliant with disaster medical transport SLA.
          </div>
        </div>

        {/* Route B Card (AI Recommended - Low Risk) */}
        <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-xl p-5 shadow-2xl shadow-emerald-950/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 rounded-bl-lg font-mono text-[10px] font-bold shadow-md">
            ⭐ AI RECOMMENDED: ROUTE B
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <h3 className="text-base font-bold text-white">{routeB.name}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">{routeB.summary}</p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-emerald-500/30 mb-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Distance</div>
                <div className="text-base font-mono font-bold text-slate-200">{routeB.distanceKm} km</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">ETA</div>
                <div className="text-base font-mono font-bold text-emerald-400">{routeB.etaFormatted}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Safety Score</div>
                <div className="text-base font-mono font-bold text-emerald-400">{routeB.safetyScore} / 100</div>
              </div>
            </div>

            {/* Route Factors Breakdown */}
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Weather Risk:</span>
                <span className="text-emerald-400 font-bold">{routeB.weatherRisk} (Protected Leeward Side)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Traffic Condition:</span>
                <span className="text-emerald-400 font-bold">{routeB.trafficLevel} (Clear Flow)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Disruption Probability:</span>
                <span className="text-emerald-400 font-bold font-mono">{routeB.disruptionProbabilityPct}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>Active Hazards:</span>
                <span className="text-emerald-400 font-bold">0 Disruptions (Engineered Pavement)</span>
              </div>
            </div>

            {/* Pros & Benefits */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-emerald-400 uppercase">Key Advantages:</div>
              <div className="space-y-1">
                {routeB.pros.map((pro, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-emerald-200 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Delta: +26 km physical, <strong className="text-emerald-400 font-mono">2h 35m time saved</strong>
            </span>
            <button
              onClick={handleDispatch}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition flex items-center gap-1"
            >
              <span>Dispatch Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Overlay for the 2 Routes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              GIS Route Trajectory Comparison (Guwahati to Shillong / Remote CHC)
            </h3>
            <p className="text-[11px] text-slate-400">
              Red Dashed: Route A (direct through Barapani slide) vs. Green Solid: Route B (Bhoirymbong SH-3 Bypass)
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            GPS CORRIDOR ACTIVE
          </span>
        </div>

        <NortheastMap
          roads={roads}
          incidents={incidents}
          vehicles={vehicles}
          hubs={hubs}
          activeRouteA={routeA}
          activeRouteB={routeB}
          compact={true}
        />
      </div>
    </div>
  );
};
