import React from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Clock,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Award,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';
import { DISTRICT_ACCESSIBILITY_STATS } from '../../data/mockData';

export const AnalyticsScreen: React.FC = () => {
  // Disruptions monthly trend data
  const monthlyDisruptions = [
    { month: 'Apr', count: 4, label: 'Pre-Monsoon' },
    { month: 'May', count: 9, label: 'Early Rain' },
    { month: 'Jun', count: 24, label: 'Monsoon Onset' },
    { month: 'Jul', count: 38, label: 'Peak Inundation' },
    { month: 'Aug', count: 31, label: 'Active Slides' },
    { month: 'Sep', count: 18, label: 'Current' },
  ];

  // High-Risk Corridors Leaderboard
  const highRiskCorridors = [
    { corridor: 'NH-10 Sevoke — Gangtok (Teesta)', incidents: 22, avgClearHours: 26.4, riskIndex: 94 },
    { corridor: 'NH-6 Byrnihat — Barapani — Shillong', incidents: 14, avgClearHours: 18.2, riskIndex: 82 },
    { corridor: 'NH-29 Dimapur — Kohima Pass', incidents: 8, avgClearHours: 8.5, riskIndex: 58 },
    { corridor: 'NH-715 Kaziranga Eco-Highway', incidents: 6, avgClearHours: 12.0, riskIndex: 62 },
    { corridor: 'NH-13 Trans-Arunachal (Banderdewa)', incidents: 3, avgClearHours: 5.2, riskIndex: 24 },
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
            STRATEGIC PERFORMANCE METRICS • SIH 2026
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            North Eastern Region Logistics Accessibility & Resilience Analytics
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Monsoon 2026 Live Surveillance Period</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Average Delivery Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Avg Delivery Time</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">4h 12m</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -38% Delay
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            With AI proactive bypass routing (vs 6h 50m baseline)
          </p>
        </div>

        {/* KPI 2: Emergency Response Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Emergency Response Time</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">24 mins</span>
            <span className="text-[11px] font-bold text-emerald-400">Target &lt;30m</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            NDRF / BRO Quick Reaction Force dispatch trigger
          </p>
        </div>

        {/* KPI 3: Vehicle Fleet Safety */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Cold-Chain Integrity</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">99.4%</span>
            <span className="text-[11px] font-bold text-emerald-400">Zero Spoilage</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Zero medical cargo lost to slide stranding
          </p>
        </div>

        {/* KPI 4: Overall Accessibility Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Regional Accessibility Score</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-mono">74 / 100</span>
            <span className="text-[11px] font-bold text-slate-300">Moderate</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Weighted across 8 Northeast States
          </p>
        </div>
      </div>

      {/* Two Columns: Disruption Trends Chart & High-Risk Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Disruption Trend SVG Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Monthly Road Disruptions (Landslides & Floods)
              </h3>
              <p className="text-[11px] text-slate-400">
                Monsoon correlation analysis across National Highway corridors
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">TOTAL: 124 EVENTS</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {monthlyDisruptions.map((item, idx) => {
              const heightPct = (item.count / 40) * 100;
              const isCurrent = item.month === 'Sep';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold font-mono text-slate-300 group-hover:text-emerald-400 transition">
                    {item.count}
                  </span>

                  <div className="w-full max-w-[38px] bg-slate-950 rounded-t-lg overflow-hidden h-40 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                          : heightPct > 70
                          ? 'bg-gradient-to-t from-red-700 to-red-500'
                          : 'bg-gradient-to-t from-blue-700 to-blue-500'
                      }`}
                    />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Primary Cause: Orographic Downpours (62%)</span>
            <span>River Bank Toe Erosion (28%)</span>
          </div>
        </div>

        {/* High-Risk Corridors Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              High-Risk Highway Corridors Leaderboard
            </h3>
            <span className="text-[10px] text-red-400 font-semibold uppercase">
              VULNERABILITY INDEX
            </span>
          </div>

          <div className="space-y-2.5">
            {highRiskCorridors.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-500 w-4">#{idx + 1}</span>
                  <div>
                    <div className="font-semibold text-slate-200">{c.corridor}</div>
                    <div className="text-[11px] text-slate-400">
                      {c.incidents} Incidents • Avg Clearance: {c.avgClearHours}h
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono font-bold text-xs ${
                      c.riskIndex > 80
                        ? 'text-red-400'
                        : c.riskIndex > 50
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    Risk: {c.riskIndex}%
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {c.riskIndex > 80 ? 'Critical Pass' : 'Monitoring'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disruptions by Administrative District Table (Prompt Requirement) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Northeast District Accessibility Index & Active Blockage Status
            </h3>
            <p className="text-[11px] text-slate-400">
              Government decision-support metrics across Assam, Meghalaya, Sikkim, Nagaland & Arunachal
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-semibold">
            8 DISTRICT HUBS TRACKED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Accessibility Score</th>
                <th className="py-2.5 px-3">Active Disruptions</th>
                <th className="py-2.5 px-3">Critical Medical Cargoes</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DISTRICT_ACCESSIBILITY_STATS.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-white">{d.district}</td>
                  <td className="py-2.5 px-3 text-slate-400">{d.state}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{d.accessibilityPct}%</span>
                      <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${d.accessibilityPct}%` }}
                          className={`h-full rounded-full ${
                            d.accessibilityPct < 50
                              ? 'bg-red-500'
                              : d.accessibilityPct < 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">
                    {d.activeDisruptions > 0 ? (
                      <span className="text-red-400">{d.activeDisruptions} Active</span>
                    ) : (
                      <span className="text-emerald-400">Clear</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{d.criticalVehicles} Convoys</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        d.accessibilityPct < 50
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : d.accessibilityPct < 75
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {d.accessibilityPct < 50
                        ? 'CRITICAL BOTTLENECK'
                        : d.accessibilityPct < 75
                        ? 'MODERATE ACCESS'
                        : 'OPTIMAL CORRIDOR'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
