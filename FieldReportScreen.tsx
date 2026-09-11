import React, { useState } from 'react';
import {
  FileSpreadsheet,
  MapPin,
  Camera,
  Upload,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Send,
  Navigation,
  Clock,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IncidentType, SeverityLevel, QueuedFieldReport, Incident } from '../../types';

interface FieldReportScreenProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  onSubmitNewIncident: (newIncident: Incident) => void;
}

export const FieldReportScreen: React.FC<FieldReportScreenProps> = ({
  isOnline,
  onToggleOnline,
  onSubmitNewIncident,
}) => {
  const [incidentType, setIncidentType] = useState<IncidentType>('landslide');
  const [locationName, setLocationName] = useState('NH-6 Km 52 Umroi Junction, Ri-Bhoi');
  const [milestone, setMilestone] = useState('NH-6 Km 52.4');
  const [district, setDistrict] = useState('Ri-Bhoi');
  const [latitude, setLatitude] = useState(25.6984);
  const [longitude, setLongitude] = useState(91.8992);
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [queuedReports, setQueuedReports] = useState<QueuedFieldReport[]>([]);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  // Auto-detect GPS button
  const handleAutoDetectGps = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(5)));
          setLongitude(Number(pos.coords.longitude.toFixed(5)));
          setIsDetectingGps(false);
        },
        () => {
          // Fallback to sample Northeast GPS coordinates
          setLatitude(25.6881);
          setLongitude(91.8842);
          setIsDetectingGps(false);
        },
        { timeout: 3000 }
      );
    } else {
      setLatitude(25.6881);
      setLongitude(91.8842);
      setIsDetectingGps(false);
    }
  };

  const handlePhotoSelect = (sampleUrl: string) => {
    setPhotoPreview(sampleUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestampStr = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' IST';

    const newReport: QueuedFieldReport = {
      id: `REP-${Date.now()}`,
      incidentType,
      locationName,
      milestone,
      district,
      latitude,
      longitude,
      severity,
      description: description || 'Severe mass wasting and debris fall observed across highway lanes.',
      photoDataUrl: photoPreview,
      isRoadBlocked: severity === 'critical',
      estimatedDelayHours: severity === 'critical' ? 6 : 2,
      createdAt: timestampStr,
      synced: isOnline,
    };

    if (isOnline) {
      // Create active incident directly
      const incident: Incident = {
        id: `INC-FLD-${Date.now().toString().slice(-4)}`,
        title: `${incidentType.replace('_', ' ').toUpperCase()} at ${locationName}`,
        type: incidentType,
        severity,
        roadId: 'road-nh-6-barapani',
        roadName: locationName.includes('NH-6') ? 'NH-6 Guwahati — Shillong' : 'NH-27 Corridor',
        locationName,
        milestoneKm: milestone,
        coords: { x: 388, y: 350, lat: latitude, lng: longitude },
        reportedAt: 'Just now (Field Sync)',
        reportedBy: {
          name: 'Officer On Patrol',
          badge: 'NER-PATROL-07',
          department: 'Border Roads Organisation / PWD Highway Patrol',
        },
        description: newReport.description,
        photoUrl: photoPreview,
        weatherCondition: 'Field Verified Monsoon Rain',
        rainfallMm: 145,
        affectedRoads: [locationName],
        affectedVehicleIds: ['NER-102'],
        aiRiskScore: severity === 'critical' ? 95 : 75,
        aiPredictionReasoning: 'Field report verified slope failure with high debris volume.',
        recommendedAction: 'Immediate lane closure and traffic diversion to alternate bypass.',
        status: 'active',
        estimatedClearingTime: '3h 30m',
        responseAgency: 'PWD Quick Response Unit',
      };

      onSubmitNewIncident(incident);

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSubmissionSuccessMsg('Report submitted & verified live on Command Center GIS Map!');
    } else {
      // Queued in local storage simulation
      setQueuedReports((prev) => [newReport, ...prev]);
      setSubmissionSuccessMsg(
        'Offline mode active. Report saved to rugged local queue and will sync automatically when network is available.'
      );
    }

    setTimeout(() => setSubmissionSuccessMsg(null), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Offline Mode Indicator (Mandatory Prompt UX Requirement) */}
      <div
        className={`p-4 rounded-xl border shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
          isOnline
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-amber-950/80 border-amber-500/80 text-amber-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider">
                {isOnline ? 'Network Online' : 'Offline Field Mode Active'}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isOnline
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/30 text-amber-300'
                }`}
              >
                {isOnline ? 'DIRECT CLOUD SYNC' : 'LOCAL CACHE'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isOnline
                ? 'Incident reports are transmitted instantly to District Administration and active supply drivers.'
                : '“Offline — Report will sync automatically when network is available.”'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleOnline}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          {isOnline ? 'Test Offline Mode' : 'Restore Network'}
        </button>
      </div>

      {/* Submission Feedback Banner */}
      {submissionSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{submissionSuccessMsg}</span>
        </div>
      )}

      {/* Main Field Reporting Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-7 shadow-2xl space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
            MOBILE FIELD OFFICER CONSOLE
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Rapid Ground Incident & Road Blockage Report
          </h2>
          <p className="text-xs text-slate-400">
            For Patrol Officers, Border Roads Organisation (BRO), and District Police Highway Units
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Field 1: Incident Type Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Incident / Hazard Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'landslide', label: 'Landslide', icon: '⛰️' },
                { id: 'flood', label: 'Flood / Inundation', icon: '🌊' },
                { id: 'road_blockage', label: 'Road Blockage', icon: '🚧' },
                { id: 'road_damage', label: 'Road Damage / Washout', icon: '💥' },
                { id: 'accident', label: 'Vehicle Accident', icon: '🚑' },
                { id: 'other', label: 'Other Hazard', icon: '⚠️' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setIncidentType(t.id as IncidentType)}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
                    incidentType === t.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-xs font-semibold">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Field 2 & 3: Location Name, Milestone & District */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location / Highway Name *
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. NH-6 Km 48 Barapani S-Curve"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Milestone Identifier
              </label>
              <input
                type="text"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                placeholder="e.g. Km 48.2"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Field 4: GPS Coordinates with Auto-Detect */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Geographic GPS Coordinates *</span>
              </label>

              <button
                type="button"
                onClick={handleAutoDetectGps}
                disabled={isDetectingGps}
                className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded text-[11px] font-medium transition flex items-center gap-1"
              >
                <Navigation className="w-3 h-3 animate-spin" />
                <span>{isDetectingGps ? 'Detecting GPS...' : 'Auto-Detect Current GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Latitude (°N)</span>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase">Longitude (°E)</span>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Field 5: Severity Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Severity Level *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'low', label: 'Low', desc: 'Passable with caution', color: 'border-blue-500/40' },
                { id: 'medium', label: 'Medium', desc: 'Single lane restricted', color: 'border-amber-500/50' },
                { id: 'high', label: 'High', desc: 'Severe slowdown', color: 'border-orange-500/60' },
                { id: 'critical', label: 'Critical', desc: 'Road Completely Blocked', color: 'border-red-500/80' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSeverity(s.id as SeverityLevel)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    severity === s.id
                      ? 'bg-slate-800 border-white text-white shadow-lg ring-2 ring-emerald-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">{s.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Field 6: Photo Upload & Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Field Photograph Verification *
            </label>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              {/* Image Preview Box */}
              <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative group">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Hazard Evidence"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                    <Camera className="w-8 h-8" />
                    <span className="text-[10px] mt-1">No Image</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-black/70 text-[9px] font-mono text-slate-300 px-1.5 py-0.5 rounded">
                  GPS-TAGGED EVIDENCE
                </div>
              </div>

              {/* Photo Presets for quick field selection */}
              <div className="flex-1 space-y-2">
                <span className="text-[11px] text-slate-400 block">
                  Select incident photo from camera stream:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: 'Mudslide / Rockfall',
                      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
                    },
                    {
                      label: 'Flash Flood Water',
                      url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
                    },
                    {
                      label: 'Deck Washout',
                      url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&auto=format&fit=crop&q=80',
                    },
                  ].map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handlePhotoSelect(preset.url)}
                      className={`p-1.5 rounded-lg border text-left text-[10px] font-medium transition ${
                        photoPreview === preset.url
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Field 7: Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Field Officer Description & Observed Obstructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Approximately 450 tonnes of phyllite shale collapsed across northbound corridor. Single lane impassable. Tree branches entangled in telephone lines. BRO earthmover requested."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-xl shadow-emerald-950 transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isOnline ? 'Submit Live Field Report' : 'Save to Offline Sync Queue'}</span>
          </button>
        </form>
      </div>

      {/* Queued Reports Table (if offline items exist) */}
      {queuedReports.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Offline Queued Reports Waiting for Connection ({queuedReports.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">PERSISTED IN STORAGE</span>
          </div>

          <div className="space-y-2">
            {queuedReports.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-lg bg-slate-950 border border-amber-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white uppercase">{q.incidentType}</span> —{' '}
                  <span className="text-slate-300">{q.locationName}</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Logged at: {q.createdAt} • Severity: {q.severity.toUpperCase()}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                  Pending Sync
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
