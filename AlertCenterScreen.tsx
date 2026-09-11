import React, { useState } from 'react';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Route,
  Navigation,
  CheckCircle2,
  Radio,
  Clock,
  Shield,
  Truck,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SystemAlert, Vehicle } from '../../types';
import { ScreenId } from '../layout/Sidebar';

interface AlertCenterScreenProps {
  alerts: SystemAlert[];
  vehicles: Vehicle[];
  onAcknowledgeAlert: (alertId: string) => void;
  onRerouteVehicle: (vehicleId: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const AlertCenterScreen: React.FC<AlertCenterScreenProps> = ({
  alerts,
  vehicles,
  onAcknowledgeAlert,
  onRerouteVehicle,
  onNavigate,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'unacknowledged' && a.acknowledged) return false;
    if (filterSeverity === 'critical' && a.severity !== 'critical') return false;
    if (filterSeverity === 'high' && a.severity !== 'high' && a.severity !== 'critical') return false;
    return true;
  });

  const handleReroute = (alert: SystemAlert) => {
    if (alert.affectedVehicleIds.length > 0) {
      alert.affectedVehicleIds.forEach((vId) => onRerouteVehicle(vId));
      onAcknowledgeAlert(alert.id);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      setActionFeedback(
        `Vehicles [${alert.affectedVehicleIds.join(', ')}] rerouted successfully to safe bypass corridor.`
      );
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleAcknowledge = (alertId: string) => {
    onAcknowledgeAlert(alertId);
    setActionFeedback('Alert acknowledged by District Disaster Authority command.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
              DISASTER THREAT & REROUTE ADVISORY
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {alerts.length} Total Registered Alerts
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Real-Time Alert Dispatch & Automated Decision Feed
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Alerts ({alerts.length})</option>
            <option value="unacknowledged">Unacknowledged Only</option>
            <option value="critical">Critical Severity Only</option>
            <option value="high">High & Critical</option>
          </select>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionFeedback}</span>
        </div>
      )}

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isHigh = alert.severity === 'high';

          return (
            <div
              key={alert.id}
              className={`bg-slate-900 border rounded-xl p-5 shadow-lg transition space-y-3.5 ${
                !alert.acknowledged
                  ? isCritical
                    ? 'border-red-600/80 bg-red-950/10'
                    : 'border-amber-600/60'
                  : 'border-slate-800 opacity-90'
              }`}
            >
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <AlertOctagon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          isCritical
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {alert.severity} SEVERITY
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{alert.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {alert.acknowledged ? (
                    <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 animate-pulse">
                      ACTION REQUIRED
                    </span>
                  )}
                </div>
              </div>

              {/* Alert Details: Location, Affected Roads & Affected Vehicles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1 font-semibold">
                    <MapPin className="w-3 h-3 text-red-400" />
                    Hazard Location
                  </span>
                  <div className="font-semibold text-slate-200 mt-1">{alert.location}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{alert.roadName}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1 font-semibold">
                    <Route className="w-3 h-3 text-blue-400" />
                    Affected Highway Corridor
                  </span>
                  <div className="font-semibold text-slate-200 mt-1">
                    {alert.affectedRoadIds.join(', ')}
                  </div>
                  <div className="text-[11px] text-red-400 font-medium">Debris hazard active</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1 font-semibold">
                    <Truck className="w-3 h-3 text-emerald-400" />
                    Affected Supply Vehicles
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {alert.affectedVehicleIds.map((vId) => (
                      <span
                        key={vId}
                        className="font-mono font-bold text-xs text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                      >
                        {vId}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-amber-300 mt-0.5">Cold chain & medicines</div>
                </div>
              </div>

              {/* Recommended Action (Prompt Requirement) */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-200 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-400">AI Recommended Action:</span>{' '}
                  <span>{alert.recommendedAction}</span>
                </div>
              </div>

              {/* Three Mandatory Buttons (Prompt Requirement) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('route_optimization')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Route className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Route</span>
                  </button>

                  <button
                    onClick={() => handleReroute(alert)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Reroute Vehicle</span>
                  </button>
                </div>

                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledge Alert</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
