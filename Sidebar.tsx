import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  Map,
  Route,
  Activity,
  Truck,
  AlertOctagon,
  Bell,
  FileSpreadsheet,
  BarChart3,
  Flame,
  Settings,
  X,
  ChevronRight,
  Radio,
  Building,
  GripHorizontal,
  Move,
  RotateCcw,
} from 'lucide-react';
import { UserRole } from '../../types';

export type ScreenId =
  | 'dashboard'
  | 'gis_map'
  | 'route_optimization'
  | 'risk_prediction'
  | 'vehicles'
  | 'incidents'
  | 'alerts'
  | 'field_report'
  | 'emergency_priority'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unacknowledgedAlertsCount: number;
  activeIncidentsCount: number;
  criticalVehiclesCount: number;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  unacknowledgedAlertsCount,
  activeIncidentsCount,
  criticalVehiclesCount,
  userRole,
}) => {
  // 2D Movable tab position state (draggable with mouse and touch)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number } | null>(null);

  const startDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      clientX,
      clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStartHeader = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.clientX;
      const deltaY = e.clientY - dragStartRef.current.clientY;
      setPosition({
        x: dragStartRef.current.posX + deltaX,
        y: dragStartRef.current.posY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStartRef.current.clientX;
      const deltaY = e.touches[0].clientY - dragStartRef.current.clientY;
      setPosition({
        x: dragStartRef.current.posX + deltaX,
        y: dragStartRef.current.posY + deltaY,
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isOpenMobile) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpenMobile]);

  const navItems: Array<{
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
    },
    {
      id: 'gis_map',
      label: 'Live GIS Map',
      icon: Map,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'route_optimization',
      label: 'Route Intelligence',
      icon: Route,
    },
    {
      id: 'risk_prediction',
      label: 'AI Risk Prediction',
      icon: Activity,
    },
    {
      id: 'vehicles',
      label: 'Vehicle Tracking',
      icon: Truck,
      badge: criticalVehiclesCount > 0 ? `${criticalVehiclesCount} Critical` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'emergency_priority',
      label: 'Emergency Routing',
      icon: Flame,
      badge: 'Priority',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      id: 'incidents',
      label: 'Incidents Details',
      icon: AlertOctagon,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
    {
      id: 'alerts',
      label: 'Alert Center',
      icon: Bell,
      badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : undefined,
      badgeColor: 'bg-red-600 text-white animate-pulse',
    },
    {
      id: 'field_report',
      label: 'Field Reports',
      icon: FileSpreadsheet,
      badge: 'Offline ready',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      id: 'analytics',
      label: 'Analytics & KPIs',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'System & Demo Config',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container - Movable Tab */}
      <aside
        style={{
          transform: isOpenMobile
            ? `translate3d(${position.x}px, ${position.y}px, 0)`
            : position.x !== 0 || position.y !== 0
            ? `translate3d(${position.x}px, ${position.y}px, 0)`
            : undefined,
          transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] h-[100dvh] bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 select-none ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } ${isDragging ? 'ring-2 ring-emerald-500/50 shadow-2xl scale-[1.01]' : ''}`}
      >
        {/* Movable Grab Handle Bar */}
        <div
          onMouseDown={handleMouseDownHeader}
          onTouchStart={handleTouchStartHeader}
          className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between cursor-grab active:cursor-grabbing text-slate-400 select-none hover:bg-slate-950 transition-colors"
          title="Click and drag to move this tab anywhere"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-emerald-400">
            <Move className="w-3 h-3 text-emerald-400" />
            <span>DRAG TO MOVE TAB</span>
          </div>

          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-slate-500 hover:text-slate-300" />
            {(position.x !== 0 || position.y !== 0) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPosition({ x: 0, y: 0 });
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 border border-slate-700 font-mono transition"
                title="Reset tab position"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Brand Header */}
        <div
          onMouseDown={handleMouseDownHeader}
          onTouchStart={handleTouchStartHeader}
          className="p-4 border-b border-slate-800/90 flex items-center justify-between cursor-grab active:cursor-grabbing"
          title="Click and drag here to move tab"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40 shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider font-mono brand-logo-title">
                  RAAH AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold tracking-tight">
                “Predict. Plan. Respond. Deliver.”
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Scope Banner */}
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700 project-scope-banner">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-0.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Northeast Accessibility Grid</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-tight font-medium">
            AI-Powered Smart Logistics & Road Disruption Intelligence
          </p>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-1 custom-scrollbar">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Screens
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-500/50'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        isActive
                          ? 'bg-emerald-700/80 text-white border-emerald-400/40'
                          : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Role & Government Badge Footer */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-950/60">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Building className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Active Persona
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate capitalize">
                {userRole.replace('_', ' ')}
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          </div>

          <div className="mt-2 text-[10px] text-center text-slate-500">
            Govt. of India • Smart India Hackathon 2026
          </div>
        </div>
      </aside>
    </>
  );
};
