import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Wifi,
  WifiOff,
  UserCheck,
  AlertTriangle,
  Clock,
  Search,
  ChevronDown,
  Shield,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { UserRole } from '../../types';
import { ScreenId } from './Sidebar';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  currentScreen: ScreenId;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  unacknowledgedAlertsCount: number;
  onOpenAlerts: () => void;
  onQuickSearch?: (query: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  currentScreen,
  userRole,
  onChangeUserRole,
  isOnline,
  onToggleOnline,
  unacknowledgedAlertsCount,
  onOpenAlerts,
  onQuickSearch,
  theme = 'light',
  onToggleTheme,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getScreenTitle = (id: ScreenId): { title: string; subtitle: string } => {
    switch (id) {
      case 'dashboard':
        return {
          title: 'Command Center Dashboard',
          subtitle: 'Real-Time Northeast Road Network & Logistics Decision Grid',
        };
      case 'gis_map':
        return {
          title: 'Live GIS Accessibility Map',
          subtitle: 'Interactive Terrain, Flood Zones & Mountain Road Risk Layers',
        };
      case 'route_optimization':
        return {
          title: 'AI Route Optimization',
          subtitle: 'Risk-Aware Alternate Routing Prioritizing Safety & Feasibility',
        };
      case 'risk_prediction':
        return {
          title: 'AI Disruption Risk Prediction',
          subtitle: 'Explainable Machine Learning Model for Landslide & Flash Flood Triggers',
        };
      case 'vehicles':
        return {
          title: 'Essential Supply Vehicle Tracking',
          subtitle: 'Cold-Chain Telemetry, Active GPS Corridors & Rerouting Controls',
        };
      case 'emergency_priority':
        return {
          title: 'Emergency Priority Routing',
          subtitle: 'Dedicated Green-Corridor Clearance for Life-Saving Supplies',
        };
      case 'incidents':
        return {
          title: 'Active Incidents & Hazards',
          subtitle: 'Comprehensive Ground Damage Reports & Clearing Units',
        };
      case 'alerts':
        return {
          title: 'Alert Center & Dispatch',
          subtitle: 'Automated Real-Time Highway Threat Broadcasts & Reroute Approvals',
        };
      case 'field_report':
        return {
          title: 'Field Officer Incident Reporter',
          subtitle: 'Offline-Resilient Mobile Field Reporting & Auto-Sync Engine',
        };
      case 'analytics':
        return {
          title: 'Disruption Analytics & KPIs',
          subtitle: 'State-Level Accessibility Trends & Response Time Metrics',
        };
      case 'settings':
        return {
          title: 'System & Demo Configuration',
          subtitle: 'Monsoon Severity Simulation & Telemetry Stream Parameters',
        };
      default:
        return {
          title: 'Command Center Dashboard',
          subtitle: 'Real-Time Northeast Road Network & Logistics Decision Grid',
        };
    }
  };

  const currentInfo = getScreenTitle(currentScreen) || {
    title: 'Command Center Dashboard',
    subtitle: 'Real-Time Northeast Road Network & Logistics Decision Grid',
  };

  const roles: Array<{ id: UserRole; title: string; desc: string }> = [
    {
      id: 'authority',
      title: 'District / Disaster Authority',
      desc: 'District Magistrate, ASDMA / SDMA Command',
    },
    {
      id: 'logistics_manager',
      title: 'Logistics Manager',
      desc: 'FCI, Medical Supply Depot, Relief Transport',
    },
    {
      id: 'field_officer',
      title: 'Field Officer',
      desc: 'Border Roads Organisation (BRO), PWD, Police',
    },
    {
      id: 'vehicle_operator',
      title: 'Vehicle Operator',
      desc: 'Driver Navigation Console & Emergency Alerts',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
      {/* Left: Mobile Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
          <span className="font-black text-xs tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
            RAAH AI
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              {currentInfo.title}
            </h1>
            <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              LIVE RADAR
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-400 truncate max-w-md lg:max-w-xl">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Controls (Clock, Role Switcher, Online Toggle, Alert Bell) */}
      <div className="flex items-center gap-2.5">
        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{timeStr || '08:45:12 IST'}</span>
        </div>

        {/* Offline / Online Network Mode Simulator */}
        <button
          onClick={onToggleOnline}
          title={isOnline ? 'Network Online (Click to simulate field offline mode)' : 'Network Offline (Field Mode)'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Offline Sync Mode</span>
            </>
          )}
        </button>

        {/* Theme Toggle (White / Dark Lookout) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Current: White Theme. Click to switch to Dark' : 'Current: Dark Theme. Click to switch to White'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline font-semibold">White Lookout</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span className="hidden sm:inline font-semibold">Dark</span>
              </>
            )}
          </button>
        )}

        {/* Persona / Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline capitalize">{userRole.replace('_', ' ')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-40 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Switch Target User Role
              </div>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onChangeUserRole(r.id);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition ${
                    userRole === r.id
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-[10px] text-slate-400">{r.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alert Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700 transition"
          title="Open Alert Center"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unacknowledgedAlertsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
