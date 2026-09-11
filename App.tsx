import React, { useState } from 'react';
import { Sidebar, ScreenId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { GisMapScreen } from './components/screens/GisMapScreen';
import { RiskPredictionScreen } from './components/screens/RiskPredictionScreen';
import { RouteOptimizationScreen } from './components/screens/RouteOptimizationScreen';
import { VehicleTrackingScreen } from './components/screens/VehicleTrackingScreen';
import { FieldReportScreen } from './components/screens/FieldReportScreen';
import { AlertCenterScreen } from './components/screens/AlertCenterScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { IncidentDetailsScreen } from './components/screens/IncidentDetailsScreen';
import { EmergencyPriorityScreen } from './components/screens/EmergencyPriorityScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

import {
  MOCK_ROAD_SEGMENTS,
  MOCK_INCIDENTS,
  MOCK_VEHICLES,
  MOCK_ALERTS,
  MOCK_LOGISTICS_HUBS,
} from './data/mockData';
import {
  RoadSegment,
  Incident,
  Vehicle,
  SystemAlert,
  UserRole,
} from './types';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('authority');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core application state
  const [roads, setRoads] = useState<RoadSegment[]>(MOCK_ROAD_SEGMENTS);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [alerts, setAlerts] = useState<SystemAlert[]>(MOCK_ALERTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident>(MOCK_INCIDENTS[0]);

  // Derived counts for sidebar and header badges
  const activeIncidentsCount = incidents.filter((i) => i.status === 'active').length;
  const unacknowledgedAlertsCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalVehiclesCount = vehicles.filter((v) => v.cargoCategory === 'CRITICAL').length;

  // Handlers
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const handleRerouteVehicle = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId || v.code === vehicleId
          ? {
              ...v,
              status: 'rerouted',
              routeRisk: 'safe',
              currentLocationName: `${v.currentLocationName} (Via Safe Bypass)`,
            }
          : v
      )
    );
  };

  const handleGenerateAlert = (
    newAlertData: Omit<
      SystemAlert,
      'id' | 'timestamp' | 'acknowledged' | 'resolved' | 'dispatchedToDriver'
    >
  ) => {
    const newAlert: SystemAlert = {
      ...newAlertData,
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      acknowledged: false,
      resolved: false,
      dispatchedToDriver: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleSubmitNewIncident = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);

    // Auto-generate an associated alert for the new incident
    handleGenerateAlert({
      title: `Field Incident: ${newIncident.title}`,
      severity: newIncident.severity,
      location: newIncident.locationName,
      roadName: newIncident.roadName,
      affectedRoadIds: newIncident.affectedRoads,
      affectedVehicleIds: newIncident.affectedVehicleIds,
      recommendedAction: newIncident.recommendedAction,
    });
  };

  const handleSelectIncidentFromEntity = (inc: Incident) => {
    setSelectedIncident(inc);
    setActiveScreen('incidents');
  };

  const handleSelectVehicleFromEntity = (veh: Vehicle) => {
    setActiveScreen('vehicles');
  };

  const handleSelectRoadFromEntity = (road: RoadSegment) => {
    setActiveScreen('risk_prediction');
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
      } flex flex-col antialiased selection:bg-emerald-500 selection:text-black transition-colors duration-200`}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentScreen={activeScreen}
          onNavigate={(s) => {
            setActiveScreen(s);
            setMobileMenuOpen(false);
          }}
          userRole={userRole}
          activeIncidentsCount={activeIncidentsCount}
          unacknowledgedAlertsCount={unacknowledgedAlertsCount}
          criticalVehiclesCount={criticalVehiclesCount}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <Header
            currentScreen={activeScreen}
            userRole={userRole}
            onChangeUserRole={setUserRole}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            unacknowledgedAlertsCount={unacknowledgedAlertsCount}
            onOpenAlerts={() => setActiveScreen('alerts')}
            onOpenMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          />

          {/* Screen Content View */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
            {/* Screen 1: Command Center Dashboard */}
            {activeScreen === 'dashboard' && (
              <DashboardScreen
                roads={roads}
                incidents={incidents}
                vehicles={vehicles}
                hubs={MOCK_LOGISTICS_HUBS}
                alerts={alerts}
                onNavigate={setActiveScreen}
                onSelectVehicle={handleSelectVehicleFromEntity}
                onSelectIncident={handleSelectIncidentFromEntity}
                onSelectRoad={handleSelectRoadFromEntity}
                onRerouteVehicle={handleRerouteVehicle}
              />
            )}

            {/* Screen 2: Live GIS Accessibility Map */}
            {activeScreen === 'gis_map' && (
              <GisMapScreen
                roads={roads}
                incidents={incidents}
                vehicles={vehicles}
                hubs={MOCK_LOGISTICS_HUBS}
                onSelectVehicle={handleSelectVehicleFromEntity}
                onSelectIncident={handleSelectIncidentFromEntity}
                onSelectRoad={handleSelectRoadFromEntity}
              />
            )}

            {/* Screen 3: AI Risk Prediction Screen */}
            {activeScreen === 'risk_prediction' && (
              <RiskPredictionScreen
                roads={roads}
                onGenerateAlert={handleGenerateAlert}
              />
            )}

            {/* Screen 4: AI Route Optimization Screen */}
            {activeScreen === 'route_optimization' && (
              <RouteOptimizationScreen
                roads={roads}
                incidents={incidents}
                vehicles={vehicles}
                hubs={MOCK_LOGISTICS_HUBS}
                onDispatchRouteToVehicle={handleRerouteVehicle}
              />
            )}

            {/* Screen 5: Vehicle Tracking Screen */}
            {activeScreen === 'vehicles' && (
              <VehicleTrackingScreen
                vehicles={vehicles}
                onRerouteVehicle={handleRerouteVehicle}
                onSelectVehicle={handleSelectVehicleFromEntity}
              />
            )}

            {/* Screen 6: Incident / Field Report Screen */}
            {activeScreen === 'field_report' && (
              <FieldReportScreen
                isOnline={isOnline}
                onToggleOnline={() => setIsOnline(!isOnline)}
                onSubmitNewIncident={handleSubmitNewIncident}
              />
            )}

            {/* Screen 7: Alert Center */}
            {activeScreen === 'alerts' && (
              <AlertCenterScreen
                alerts={alerts}
                vehicles={vehicles}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onRerouteVehicle={handleRerouteVehicle}
                onNavigate={setActiveScreen}
              />
            )}

            {/* Screen 8: Analytics Screen */}
            {activeScreen === 'analytics' && <AnalyticsScreen />}

            {/* Screen 9: Incident Details Screen */}
            {activeScreen === 'incidents' && (
              <IncidentDetailsScreen
                incidents={incidents}
                selectedIncident={selectedIncident}
                onSelectIncident={setSelectedIncident}
                vehicles={vehicles}
                roads={roads}
                onNavigate={setActiveScreen}
                onRerouteVehicle={handleRerouteVehicle}
              />
            )}

            {/* Screen 10: Emergency Priority Routing */}
            {activeScreen === 'emergency_priority' && (
              <EmergencyPriorityScreen vehicles={vehicles} />
            )}

            {/* Screen: Settings */}
            {activeScreen === 'settings' && <SettingsScreen />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
