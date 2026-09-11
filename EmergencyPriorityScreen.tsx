import React, { useState } from 'react';
import {
  Siren,
  ShieldAlert,
  Clock,
  Car,
  Truck,
  CheckCircle2,
  Navigation,
  Sparkles,
  Zap,
  PhoneCall,
  ShieldCheck,
  Flame,
  Radio,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PriorityCategory, Vehicle } from '../../types';

interface EmergencyPriorityScreenProps {
  vehicles: Vehicle[];
}

export const EmergencyPriorityScreen: React.FC<EmergencyPriorityScreenProps> = ({ vehicles }) => {
  const [selectedPriority, setSelectedPriority] = useState<PriorityCategory>('CRITICAL');
  const [selectedVehicleCode, setSelectedVehicleCode] = useState<string>('NER-102');
  const [policeEscortEnabled, setPoliceEscortEnabled] = useState<boolean>(true);
  const [tollPreemptionEnabled, setTollPreemptionEnabled] = useState<boolean>(true);
  const [corridorActive, setCorridorActive] = useState<boolean>(false);

  // Dynamic parameters based on priority tier
  const priorityConfigs = {
    CRITICAL: {
      label: 'Critical Priority (Medicines / Cryogenic Oxygen)',
      safetyBufferPct: 40,
      maxSlopeToleranceDeg: 18,
      riskThreshold: 'Strict (Risk < 25%)',
      estimatedTimeSaved: '2h 45m',
      clearanceProtocol: 'Inter-State Green Corridor Protocol Level 1',
      policeAssistanceRequired: true,
      color: 'red',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
    },
    HIGH: {
      label: 'High Priority (Food Grains / Relief Water)',
      safetyBufferPct: 25,
      maxSlopeToleranceDeg: 24,
      riskThreshold: 'Moderate (Risk < 50%)',
      estimatedTimeSaved: '1h 50m',
      clearanceProtocol: 'District Rapid Logistics Corridor Level 2',
      policeAssistanceRequired: false,
      color: 'amber',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    },
    NORMAL: {
      label: 'Normal Priority (General Supplies & Reconstruction)',
      safetyBufferPct: 10,
      maxSlopeToleranceDeg: 32,
      riskThreshold: 'Standard (Risk < 75%)',
      estimatedTimeSaved: '45m',
      clearanceProtocol: 'Standard Commercial Traffic Management',
      policeAssistanceRequired: false,
      color: 'blue',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    },
  };

  const currentConfig = priorityConfigs[selectedPriority];

  const handleActivateCorridor = () => {
    setCorridorActive(true);
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCorridorActive(false), 6000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800 flex items-center gap-1">
              <Siren className="w-3 h-3 text-red-400 animate-pulse" />
              EMERGENCY PROTOCOL MANAGEMENT
            </span>
            <span className="text-[10px] font-mono text-slate-400">DISASTER LOGISTICS SLA</span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Emergency Priority Routing & Green Corridor Preemption
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Inter-Agency State Police & NDRF Net: Connected</span>
        </div>
      </div>

      {/* Corridor Active Confirmation Banner */}
      {corridorActive && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/90 to-slate-900 border-2 border-red-500 text-white text-xs shadow-2xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-600 text-white animate-bounce">
                <Siren className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm uppercase text-red-300 tracking-wider">
                  Emergency Green Corridor Activated!
                </h3>
                <p className="text-slate-200 text-xs">
                  Convoy {selectedVehicleCode} granted sovereign right-of-way. Automated toll gate override & Police Escort Patrol dispatched.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs bg-red-900/80 px-2.5 py-1 rounded border border-red-700">
              ETA REDUCED BY {currentConfig.estimatedTimeSaved}
            </span>
          </div>
        </div>
      )}

      {/* Priority Level Selection Tabs (Prompt Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            tier: 'CRITICAL' as PriorityCategory,
            title: 'Critical Priority',
            subtitle: 'Life-saving Medicines & Oxygen',
            icon: Siren,
            color: 'border-red-500/80 hover:border-red-400',
            activeBg: 'bg-red-950/40 border-red-500 ring-2 ring-red-500/40',
            desc: 'Zero-tolerance for geotechnical risk. Automated police escort.',
          },
          {
            tier: 'HIGH' as PriorityCategory,
            title: 'High Priority',
            subtitle: 'Food Grains, Water & Relief Kits',
            icon: Truck,
            color: 'border-amber-500/60 hover:border-amber-400',
            activeBg: 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/40',
            desc: 'High resilience bypasses. Accelerated checkpoint clearance.',
          },
          {
            tier: 'NORMAL' as PriorityCategory,
            title: 'Normal Priority',
            subtitle: 'General Supplies & Equipment',
            icon: ShieldCheck,
            color: 'border-blue-500/50 hover:border-blue-400',
            activeBg: 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/40',
            desc: 'Standard highway operations with hazard notifications.',
          },
        ].map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPriority === p.tier;

          return (
            <button
              key={p.tier}
              type="button"
              onClick={() => setSelectedPriority(p.tier)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between space-y-3 ${
                isSelected ? p.activeBg : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      p.tier === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400'
                        : p.tier === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{p.title}</div>
                    <div className="text-[11px] text-slate-400">{p.subtitle}</div>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-400 leading-tight">{p.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Parameters: Dynamic Safety Buffer, Lane Recommendations & Escort Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dynamic Safety Buffer Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Dynamic Safety Buffer
            </span>
            <span className="text-[10px] font-mono text-emerald-400">AI ALGORITHM</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <div className="text-4xl font-black text-white font-mono">
              +{currentConfig.safetyBufferPct}%
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Added Buffer Margin on Geotechnical Risk
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
              <span>Max Slope Tolerance:</span>
              <span className="text-white font-mono font-bold">
                &le; {currentConfig.maxSlopeToleranceDeg}° Gradient
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
              <span>Allowable Risk Threshold:</span>
              <span className="text-emerald-400 font-bold">{currentConfig.riskThreshold}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
              <span>Clearance Protocol:</span>
              <span className="text-slate-200 font-medium text-[11px] text-right">
                {currentConfig.clearanceProtocol}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            The safety buffer dynamically recalculates safe speed envelopes and enforces 0% proximity to active slide runout zones.
          </p>
        </div>

        {/* Priority Lane Recommendations & Time Saved */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-400" />
              Priority Lane & Time Savings
            </span>
            <span className="text-[10px] font-mono text-emerald-400">OPTIMIZED</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <div className="text-4xl font-black text-emerald-400 font-mono">
              {currentConfig.estimatedTimeSaved}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Estimated Transit Time Saved
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Dedicated Lane Clearance:</strong> Priority lane designated along NH-6 & SH-3 bypass.
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Brahmaputra Ferry Slip Priority:</strong> Instant roll-on/roll-off clearance for life-saving convoys.
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Replaces manual checkpoint queueing with RFID automated Fastag toll gate barrier clearance.
          </p>
        </div>

        {/* Escort / Police Assistance Flags (Prompt Requirement) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-400" />
                Escort & Police Flags
              </span>
              <span className="text-[10px] font-mono text-amber-400">INTER-STATE ESCORT</span>
            </div>

            <div className="space-y-3 mt-3">
              {/* Toggle 1: Police Patrol Escort */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">State Police Pilot Vehicle</div>
                  <div className="text-[10px] text-slate-400">
                    Highway Patrol escort for night mountain transit
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={policeEscortEnabled}
                  onChange={(e) => setPoliceEscortEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 2: Fastag Toll Override */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Automated Toll Override</div>
                  <div className="text-[10px] text-slate-400">
                    Preempt boom barrier via FASTag emergency code
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tollPreemptionEnabled}
                  onChange={(e) => setTollPreemptionEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              {/* Vehicle Assignment */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                  Assign Convoy Vehicle
                </label>
                <select
                  value={selectedVehicleCode}
                  onChange={(e) => setSelectedVehicleCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.code}>
                      {v.code} — {v.cargoType} ({v.currentLocationName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleActivateCorridor}
            className="w-full mt-3 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950 transition flex items-center justify-center gap-2"
          >
            <Siren className="w-4 h-4" />
            <span>Activate Emergency Green Corridor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
