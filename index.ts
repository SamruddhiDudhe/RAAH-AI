export type RoadStatus = 'safe' | 'moderate' | 'high_risk' | 'blocked';

export type IncidentType = 'landslide' | 'flood' | 'road_blockage' | 'road_damage' | 'accident' | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type PriorityCategory = 'CRITICAL' | 'HIGH' | 'NORMAL';

export type VehicleStatus = 'in_transit' | 'rerouted' | 'delayed' | 'delivered' | 'standby';

export type UserRole = 'authority' | 'logistics_manager' | 'field_officer' | 'vehicle_operator';

export interface RoadSegment {
  id: string;
  name: string;
  highwayCode: string;
  state: string;
  district: string;
  startPoint: { name: string; x: number; y: number; lat: number; lng: number };
  endPoint: { name: string; x: number; y: number; lat: number; lng: number };
  pathCoords: Array<{ x: number; y: number }>;
  status: RoadStatus;
  riskScore: number; // 0 to 100
  lengthKm: number;
  elevationProfile: { minM: number; maxM: number; avgSlopeDeg: number };
  currentWeather: {
    condition: string;
    rainfall24hMm: number;
    rainfall7dMm: number;
    windKmh: number;
    saturationPct: number;
  };
  pavementIndex: number; // 0 to 100
  historicalIncidentsCount: number;
  affectedVehiclesCount: number;
  aiExplanation: string;
}

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: SeverityLevel;
  roadId: string;
  roadName: string;
  locationName: string;
  milestoneKm: string;
  coords: { x: number; y: number; lat: number; lng: number };
  reportedAt: string;
  reportedBy: { name: string; badge: string; department: string };
  description: string;
  photoUrl: string;
  weatherCondition: string;
  rainfallMm: number;
  affectedRoads: string[];
  affectedVehicleIds: string[];
  aiRiskScore: number;
  aiPredictionReasoning: string;
  recommendedAction: string;
  status: 'active' | 'under_clearance' | 'cleared' | 'investigating';
  estimatedClearingTime: string;
  responseAgency: string; // e.g. "NDRF 1st Bn & BRO Task Force 752"
}

export interface Vehicle {
  id: string;
  code: string; // e.g., "NER-102"
  driverName: string;
  driverPhone: string;
  operatorOrg: string; // e.g. "State Disaster Medical Supply Cell"
  cargoType: string;
  cargoCategory: PriorityCategory;
  cargoWeightTons: number;
  temperatureControlled: boolean;
  currentTempC?: number;
  targetTempC?: number;
  origin: string;
  destination: string;
  currentLocationName: string;
  coords: { x: number; y: number; lat: number; lng: number };
  headingDeg: number;
  speedKmh: number;
  fuelPct: number;
  eta: string;
  routeRisk: RoadStatus;
  status: VehicleStatus;
  activeRouteId: string;
  alternateRouteAvailable: boolean;
  notes: string;
}

export interface RouteOption {
  id: string;
  name: string;
  isRecommended: boolean;
  distanceKm: number;
  etaMinutes: number;
  etaFormatted: string;
  safetyScore: number; // 0 to 100
  weatherRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  disruptionProbabilityPct: number;
  trafficLevel: 'Light' | 'Moderate' | 'Heavy' | 'Choked';
  highRiskSegmentsCount: number;
  blockedSegmentsCount: number;
  pathCoords: Array<{ x: number; y: number }>;
  summary: string;
  aiJustification: string;
  pros: string[];
  cons: string[];
}

export interface SystemAlert {
  id: string;
  title: string;
  severity: SeverityLevel;
  timestamp: string;
  location: string;
  roadName: string;
  affectedRoadIds: string[];
  affectedVehicleIds: string[];
  recommendedAction: string;
  acknowledged: boolean;
  resolved: boolean;
  dispatchedToDriver: boolean;
}

export interface LogisticsHub {
  id: string;
  name: string;
  type: 'hospital' | 'warehouse' | 'ndrf_base' | 'checkpost';
  city: string;
  state: string;
  coords: { x: number; y: number; lat: number; lng: number };
  capacityStatus: 'optimal' | 'strained' | 'critical';
  stockLevelPct: number;
}

export interface FieldReportInput {
  incidentType: IncidentType;
  locationName: string;
  milestone: string;
  district: string;
  latitude: number;
  longitude: number;
  severity: SeverityLevel;
  description: string;
  photoDataUrl?: string;
  isRoadBlocked: boolean;
  estimatedDelayHours: number;
}

export interface QueuedFieldReport extends FieldReportInput {
  id: string;
  createdAt: string;
  synced: boolean;
}
