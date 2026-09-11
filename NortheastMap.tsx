import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  AlertTriangle,
  Truck,
  Building2,
  CloudRain,
  Mountain,
  Compass,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { RoadSegment, Incident, Vehicle, LogisticsHub, RouteOption } from '../../types';

interface NortheastMapProps {
  roads: RoadSegment[];
  incidents: Incident[];
  vehicles: Vehicle[];
  hubs: LogisticsHub[];
  activeRouteA?: RouteOption;
  activeRouteB?: RouteOption;
  selectedVehicleId?: string;
  selectedIncidentId?: string;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onSelectIncident?: (incident: Incident) => void;
  onSelectRoad?: (road: RoadSegment) => void;
  filterRiskLevel?: string;
  filterDistrict?: string;
  filterIncidentType?: string;
  compact?: boolean;
}

export const NortheastMap: React.FC<NortheastMapProps> = ({
  roads,
  incidents,
  vehicles,
  hubs,
  activeRouteA,
  activeRouteB,
  selectedVehicleId,
  selectedIncidentId,
  onSelectVehicle,
  onSelectIncident,
  onSelectRoad,
  filterRiskLevel,
  filterDistrict,
  filterIncidentType,
  compact = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mouseGeo, setMouseGeo] = useState({ lat: 26.15, lng: 92.4, elev: 480 });

  // Map layer toggles
  const [layers, setLayers] = useState({
    roads: true,
    vehicles: true,
    incidents: true,
    hubs: true,
    weatherRadar: true,
    topography: true,
  });
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Active hover/clicked item popup
  const [hoveredItem, setHoveredItem] = useState<{
    type: 'road' | 'vehicle' | 'incident' | 'hub';
    data: any;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Calculate approximate geographic coordinates from mouse position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left - pan.x) / (rect.width * zoom);
      const relativeY = (e.clientY - rect.top - pan.y) / (rect.height * zoom);

      // Northeast bounds approx: Lng 88.0 to 97.0, Lat 28.5 to 22.0
      const approxLng = 88.0 + relativeX * 9.0;
      const approxLat = 28.5 - relativeY * 6.5;
      const approxElev = Math.round(120 + Math.sin(relativeX * 6) * 1200 + Math.cos(relativeY * 8) * 800);

      setMouseGeo({
        lat: Number(approxLat.toFixed(4)),
        lng: Number(approxLng.toFixed(4)),
        elev: Math.max(60, approxElev),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch panning and pinch-to-zoom support
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = dist / touchStartDistRef.current;
      const newZoom = Math.min(3, Math.max(0.7, touchStartZoomRef.current * scaleFactor));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistRef.current = null;
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.7));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Helper color for road status
  const getRoadColor = (status: string) => {
    switch (status) {
      case 'safe':
        return '#10b981'; // Green
      case 'moderate':
        return '#f59e0b'; // Yellow / Amber
      case 'high_risk':
        return '#ef4444'; // Red
      case 'blocked':
        return '#7f1d1d'; // Dark red / Blackish red
      default:
        return '#64748b';
    }
  };

  // Filtered lists
  const filteredRoads = roads.filter((r) => {
    if (filterRiskLevel && filterRiskLevel !== 'all' && r.status !== filterRiskLevel) return false;
    if (filterDistrict && filterDistrict !== 'all' && !r.district.toLowerCase().includes(filterDistrict.toLowerCase())) return false;
    return true;
  });

  const filteredIncidents = incidents.filter((inc) => {
    if (filterIncidentType && filterIncidentType !== 'all' && inc.type !== filterIncidentType) return false;
    if (filterRiskLevel && filterRiskLevel !== 'all') {
      if (filterRiskLevel === 'blocked' && inc.severity !== 'critical') return false;
      if (filterRiskLevel === 'high_risk' && inc.severity !== 'high' && inc.severity !== 'critical') return false;
    }
    return true;
  });

  return (
    <div
      ref={containerRef}
      className={`gis-canvas-container relative w-full overflow-hidden bg-slate-950 select-none border border-slate-800/80 rounded-xl shadow-2xl ${
        compact ? 'h-[360px]' : 'h-[580px] lg:h-[680px]'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
    >
      {/* Map Background Grid & Coordinate Compass */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-lg text-xs font-mono text-slate-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-400 tracking-wider">LIVE GIS RADAR</span>
          <span className="text-slate-600">|</span>
          <span>NORTHEAST INDIA REGION (NER)</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            {mouseGeo.lat}° N, {mouseGeo.lng}° E ({mouseGeo.elev}m ASL)
          </span>
        </div>

        {/* Legend pills */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-lg text-xs">
          <span className="text-slate-400 font-medium mr-1">Road Status:</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_8px_#10b981]" /> Safe
          </span>
          <span className="flex items-center gap-1 text-amber-400 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Moderate
          </span>
          <span className="flex items-center gap-1 text-red-400 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_#ef4444]" /> High Risk
          </span>
          <span className="flex items-center gap-1 text-red-950 font-bold bg-red-200/90 px-1.5 py-0.5 rounded ml-2">
            Blocked
          </span>
        </div>
      </div>

      {/* Floating Interactive Controls (Zoom / Layers / Reset) */}
      <div className="absolute right-3 top-14 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700/80 shadow-md transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700/80 shadow-md transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset View"
          className="w-9 h-9 flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-700/80 shadow-md transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Layer Switcher Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Toggle Map Layers"
            className={`w-9 h-9 flex items-center justify-center rounded-lg border shadow-md transition ${
              showLayerMenu
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-11 top-0 w-48 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl z-30 text-xs space-y-2">
              <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>GIS Layers</span>
                <span className="text-[10px] text-emerald-400">ACTIVE</span>
              </div>
              <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.roads}
                  onChange={(e) => setLayers({ ...layers, roads: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Road Network Corridors</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.vehicles}
                  onChange={(e) => setLayers({ ...layers, vehicles: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Active Supply Vehicles</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.incidents}
                  onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Landslides & Disruptions</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.hubs}
                  onChange={(e) => setLayers({ ...layers, hubs: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Hospitals & Warehouses</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.weatherRadar}
                  onChange={(e) => setLayers({ ...layers, weatherRadar: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Precipitation Cloud Radar</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.topography}
                  onChange={(e) => setLayers({ ...layers, topography: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Topographic Mountain Ridges</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Main SVG GIS Canvas */}
      <svg
        viewBox="0 0 800 580"
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <defs>
          {/* Gradients & Filters */}
          <linearGradient id="brahmaputraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
          </linearGradient>

          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Pattern for high rain clouds */}
          <pattern id="rainClouds" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="14" fill="#38bdf8" fillOpacity="0.08" />
            <circle cx="45" cy="30" r="22" fill="#0ea5e9" fillOpacity="0.12" />
            <circle cx="35" cy="50" r="16" fill="#0284c7" fillOpacity="0.06" />
          </pattern>
        </defs>

        {/* 1. Base Geography: State Outlines & Mountain Terrain */}
        {layers.topography && (
          <g id="terrain-contours" className="opacity-40 pointer-events-none">
            {/* Himalayan Ridge arcs (Sikkim & Arunachal) */}
            <path
              d="M 80 180 Q 140 140, 240 120 T 480 90 T 720 130"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 100 210 Q 200 170, 350 160 T 600 150"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Khasi & Jaintia Hills Ridge (Meghalaya) */}
            <path
              d="M 330 380 Q 400 370, 470 385"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Naga & Patkai Hills Ridge */}
            <path
              d="M 580 300 Q 640 370, 660 480"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Lushai / Mizo Hills */}
            <path
              d="M 520 480 Q 550 540, 560 570"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* State Regional Boundaries (Stylized Polygons) */}
        <g id="state-territories" className="opacity-30">
          {/* Assam Valley */}
          <polygon
            points="320,270 470,260 590,240 680,260 620,320 500,320 360,330 320,290"
            fill="#065f46"
            fillOpacity="0.15"
            stroke="#059669"
            strokeWidth="1"
          />
          {/* Meghalaya Plateau */}
          <polygon
            points="330,350 460,350 460,410 330,410"
            fill="#0284c7"
            fillOpacity="0.1"
            stroke="#0284c7"
            strokeWidth="1"
          />
          {/* Arunachal North */}
          <polygon
            points="240,110 500,80 720,110 700,220 520,180 320,180"
            fill="#334155"
            fillOpacity="0.2"
            stroke="#475569"
            strokeWidth="1"
          />
          {/* Nagaland & Manipur */}
          <polygon
            points="580,310 660,320 670,490 600,470 580,360"
            fill="#4338ca"
            fillOpacity="0.12"
            stroke="#6366f1"
            strokeWidth="1"
          />
          {/* Mizoram & Tripura */}
          <polygon
            points="490,470 570,480 550,570 470,550"
            fill="#0f766e"
            fillOpacity="0.12"
            stroke="#14b8a6"
            strokeWidth="1"
          />
        </g>

        {/* Major Waterway: Mighty Brahmaputra River Line */}
        <path
          d="M 720 220 C 640 250, 560 260, 480 275 S 380 285, 300 290"
          fill="none"
          stroke="url(#brahmaputraGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          className="animate-pulse"
        />
        <text x="440" y="270" fill="#38bdf8" opacity="0.6" fontSize="9" fontWeight="600" letterSpacing="2">
          BRAHMAPUTRA RIVER VALLEY
        </text>

        {/* Weather Precipitation Radar Clouds */}
        {layers.weatherRadar && (
          <g id="weather-layer">
            {/* Active Monsoon cloud over Meghalaya/Ri-Bhoi (168mm) */}
            <circle cx="390" cy="350" r="45" fill="url(#rainClouds)" />
            <circle cx="390" cy="350" r="40" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1" />
            <text x="350" y="325" fill="#38bdf8" fontSize="8" fontWeight="600" opacity="0.8">
              OROGRAPHIC PRECIP: 168mm
            </text>

            {/* Teesta cloudburst cluster */}
            <circle cx="130" cy="220" r="35" fill="#ef4444" fillOpacity="0.12" stroke="#ef4444" strokeDasharray="2 2" strokeWidth="1" />
            <text x="100" y="200" fill="#f87171" fontSize="8" fontWeight="600" opacity="0.8">
              CLOUDBURST: 210mm
            </text>
          </g>
        )}

        {/* State Labels */}
        <text x="410" y="240" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1.5" opacity="0.7">
          ASSAM
        </text>
        <text x="375" y="405" fill="#94a3b8" fontSize="11" fontWeight="700" letterSpacing="1" opacity="0.7">
          MEGHALAYA
        </text>
        <text x="450" y="150" fill="#94a3b8" fontSize="11" fontWeight="700" letterSpacing="1" opacity="0.6">
          ARUNACHAL PRADESH
        </text>
        <text x="630" y="340" fill="#94a3b8" fontSize="10" fontWeight="700" opacity="0.6">
          NAGALAND
        </text>
        <text x="640" y="440" fill="#94a3b8" fontSize="10" fontWeight="700" opacity="0.6">
          MANIPUR
        </text>
        <text x="510" y="530" fill="#94a3b8" fontSize="10" fontWeight="700" opacity="0.6">
          MIZORAM
        </text>
        <text x="395" y="500" fill="#94a3b8" fontSize="10" fontWeight="700" opacity="0.6">
          TRIPURA
        </text>
        <text x="115" y="180" fill="#94a3b8" fontSize="10" fontWeight="700" opacity="0.6">
          SIKKIM
        </text>

        {/* 2. Road Network Corridors */}
        {layers.roads && (
          <g id="road-network">
            {filteredRoads.map((road) => {
              const pathD = road.pathCoords
                .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
                .join(' ');
              const color = getRoadColor(road.status);
              const isBlocked = road.status === 'blocked';
              const isHighRisk = road.status === 'high_risk';

              return (
                <g
                  key={road.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectRoad && onSelectRoad(road)}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    setHoveredItem({
                      type: 'road',
                      data: road,
                      x: road.pathCoords[Math.floor(road.pathCoords.length / 2)].x,
                      y: road.pathCoords[Math.floor(road.pathCoords.length / 2)].y,
                    });
                  }}
                >
                  {/* Outer casing / shadow */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#020617"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Main Road Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={isBlocked || isHighRisk ? '4.5' : '3.5'}
                    strokeDasharray={isBlocked ? '6 4' : 'none'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={isHighRisk ? 'url(#glowRed)' : undefined}
                    className="transition-all group-hover:stroke-width-6"
                  />

                  {/* Highway Code Label tag */}
                  <text
                    x={road.pathCoords[Math.floor(road.pathCoords.length / 2)].x + 6}
                    y={road.pathCoords[Math.floor(road.pathCoords.length / 2)].y - 6}
                    fill="#f8fafc"
                    fontSize="9"
                    fontWeight="700"
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {road.highwayCode}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 3. AI Route Comparison Overlays (Route A vs Route B) */}
        {activeRouteA && (
          <g id="route-a-overlay">
            <path
              d={activeRouteA.pathCoords.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="5"
              strokeDasharray="7 5"
              strokeLinecap="round"
              className="opacity-80"
            />
          </g>
        )}

        {activeRouteB && (
          <g id="route-b-overlay">
            <path
              d={activeRouteB.pathCoords.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glowGreen)"
              className="animate-pulse"
            />
          </g>
        )}

        {/* 4. Logistics Hubs & Hospitals */}
        {layers.hubs && (
          <g id="logistics-hubs">
            {hubs.map((hub) => {
              const isHospital = hub.type === 'hospital';
              return (
                <g
                  key={hub.id}
                  transform={`translate(${hub.coords.x}, ${hub.coords.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredItem({
                      type: 'hub',
                      data: hub,
                      x: hub.coords.x,
                      y: hub.coords.y,
                    })
                  }
                >
                  <circle
                    r="9"
                    fill={isHospital ? '#0f172a' : '#1e293b'}
                    stroke={isHospital ? '#38bdf8' : '#e2e8f0'}
                    strokeWidth="1.5"
                    className="shadow-lg"
                  />
                  {isHospital ? (
                    // Cross for Hospital
                    <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                  ) : (
                    // Box for Warehouse
                    <rect x="-3" y="-3" width="6" height="6" fill="#fbbf24" rx="1" />
                  )}
                  <text
                    x="12"
                    y="3"
                    fill="#cbd5e1"
                    fontSize="8"
                    fontWeight="600"
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  >
                    {hub.city}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 5. Incidents / Landslide / Flood Markers */}
        {layers.incidents && (
          <g id="incident-markers">
            {filteredIncidents.map((inc) => {
              const isCritical = inc.severity === 'critical';
              const isSelected = selectedIncidentId === inc.id;

              return (
                <g
                  key={inc.id}
                  transform={`translate(${inc.coords.x}, ${inc.coords.y})`}
                  className="cursor-pointer"
                  onClick={() => onSelectIncident && onSelectIncident(inc)}
                  onMouseEnter={() =>
                    setHoveredItem({
                      type: 'incident',
                      data: inc,
                      x: inc.coords.x,
                      y: inc.coords.y,
                    })
                  }
                >
                  {/* Warning pulse ring */}
                  <circle
                    r={isCritical ? '18' : '14'}
                    fill={isCritical ? '#ef4444' : '#f59e0b'}
                    fillOpacity="0.3"
                    className="animate-ping"
                  />

                  {/* Outer circle */}
                  <circle
                    r="10"
                    fill={isCritical ? '#dc2626' : '#d97706'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '3' : '1.5'}
                    className="shadow-2xl"
                  />

                  {/* Hazard Exclamation mark icon */}
                  <path
                    d="M 0 -5 L 0 1 M 0 4 L 0 5"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* 6. Live Vehicles */}
        {layers.vehicles && (
          <g id="vehicle-markers">
            {vehicles.map((v) => {
              const isSelected = selectedVehicleId === v.id;
              const isCritical = v.cargoCategory === 'CRITICAL';
              const isRerouted = v.status === 'rerouted';

              return (
                <g
                  key={v.id}
                  transform={`translate(${v.coords.x}, ${v.coords.y})`}
                  className="cursor-pointer"
                  onClick={() => onSelectVehicle && onSelectVehicle(v)}
                  onMouseEnter={() =>
                    setHoveredItem({
                      type: 'vehicle',
                      data: v,
                      x: v.coords.x,
                      y: v.coords.y,
                    })
                  }
                >
                  {/* Pulse ring for critical vehicle */}
                  {isCritical && (
                    <circle
                      r="16"
                      fill="#10b981"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Vehicle Body Pin */}
                  <circle
                    r="9"
                    fill={isRerouted ? '#8b5cf6' : isCritical ? '#059669' : '#0284c7'}
                    stroke={isSelected ? '#38bdf8' : '#ffffff'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="shadow-lg"
                  />

                  {/* Mini Direction Pointer */}
                  <path
                    d="M 0 -4 L 3 3 L -3 3 Z"
                    fill="#ffffff"
                    transform={`rotate(${v.headingDeg})`}
                  />

                  {/* Vehicle Code Label */}
                  <rect
                    x="-18"
                    y="11"
                    width="36"
                    height="13"
                    rx="3"
                    fill="#0f172a"
                    fillOpacity="0.85"
                    stroke="#334155"
                    strokeWidth="0.5"
                  />
                  <text
                    x="0"
                    y="20"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="7"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {v.code}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Floating Hover Card / Popup */}
      {hoveredItem && (
        <div
          className="absolute z-30 pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs max-w-xs transition-all transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${((hoveredItem.x / 800) * 100 * zoom) + (pan.x / (containerRef.current?.clientWidth || 1)) * 100}%`,
            top: `${((hoveredItem.y / 580) * 100 * zoom) + (pan.y / (containerRef.current?.clientHeight || 1)) * 100}%`,
          }}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {hoveredItem.type === 'vehicle' && (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  {hoveredItem.data.code}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    hoveredItem.data.cargoCategory === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {hoveredItem.data.cargoCategory}
                </span>
              </div>
              <p className="font-semibold text-slate-200 text-[11px] mb-1">{hoveredItem.data.cargoType}</p>
              <div className="space-y-0.5 text-slate-400 text-[11px]">
                <p>
                  <span className="text-slate-500">Destination:</span> {hoveredItem.data.destination}
                </p>
                <p>
                  <span className="text-slate-500">ETA:</span> <strong className="text-slate-200">{hoveredItem.data.eta}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Speed:</span> {hoveredItem.data.speedKmh} km/h
                </p>
              </div>
              {onSelectVehicle && (
                <button
                  onClick={() => {
                    onSelectVehicle(hoveredItem.data);
                    setHoveredItem(null);
                  }}
                  className="mt-2 w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-medium transition"
                >
                  Open Vehicle Telemetry
                </button>
              )}
            </div>
          )}

          {hoveredItem.type === 'incident' && hoveredItem.data && (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-bold text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {hoveredItem.data.type?.toUpperCase()}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-800">
                  {hoveredItem.data.severity}
                </span>
              </div>
              <p className="font-semibold text-slate-200 text-[11px] mb-1">{hoveredItem.data.title}</p>
              <p className="text-slate-400 text-[10px] line-clamp-2 mb-1.5">{hoveredItem.data.description}</p>
              <div className="text-[10px] text-amber-400 font-mono">
                AI Risk Score: {hoveredItem.data.aiRiskScore}% (Clearing: {hoveredItem.data.estimatedClearingTime})
              </div>
              {onSelectIncident && (
                <button
                  onClick={() => {
                    onSelectIncident(hoveredItem.data);
                    setHoveredItem(null);
                  }}
                  className="mt-2 w-full py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-medium transition"
                >
                  Inspect Incident Details
                </button>
              )}
            </div>
          )}

          {hoveredItem.type === 'road' && (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-bold text-slate-200">{hoveredItem.data.name}</span>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{
                    backgroundColor: `${getRoadColor(hoveredItem.data.status)}20`,
                    color: getRoadColor(hoveredItem.data.status),
                  }}
                >
                  {hoveredItem.data.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <p>
                  <span className="text-slate-500">District:</span> {hoveredItem.data.district} ({hoveredItem.data.state})
                </p>
                <p>
                  <span className="text-slate-500">Risk Score:</span>{' '}
                  <strong className="text-slate-200">{hoveredItem.data.riskScore}/100</strong>
                </p>
                <p>
                  <span className="text-slate-500">Rainfall 24h:</span> {hoveredItem.data.currentWeather.rainfall24hMm} mm
                </p>
                <p className="text-[10px] text-slate-300 italic line-clamp-2 mt-1">
                  "{hoveredItem.data.aiExplanation}"
                </p>
              </div>
            </div>
          )}

          {hoveredItem.type === 'hub' && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {hoveredItem.data.name}
              </div>
              <p className="text-[11px] text-slate-400 mb-1">
                {hoveredItem.data.city}, {hoveredItem.data.state}
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800">
                <span className="text-slate-500">Stock Capacity:</span>
                <span
                  className={`font-bold ${
                    hoveredItem.data.stockLevelPct < 40 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {hoveredItem.data.stockLevelPct}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Map Status Bar */}
      <div className="absolute bottom-2 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-[11px] text-slate-400">
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 pointer-events-auto">
          <span className="flex items-center gap-1 text-slate-300">
            <Mountain className="w-3 h-3 text-slate-400" />
            Active Corridors: <strong className="text-emerald-400">{filteredRoads.length}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Truck className="w-3 h-3 text-blue-400" />
            Tracked Fleet: <strong className="text-blue-400">{vehicles.length}</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Hazards: <strong className="text-red-400">{filteredIncidents.length}</strong>
          </span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-auto text-[10px] text-slate-500 font-mono">
          PROJECTION: EPSG:4326 (WGS84) • SATELLITE TELEMETRY SYNC: LIVE
        </div>
      </div>
    </div>
  );
};
