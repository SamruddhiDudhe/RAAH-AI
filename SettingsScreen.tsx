import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  Cpu,
  Shield,
  Wifi,
  Radio,
  Globe,
  Database,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsScreen: React.FC = () => {
  const [modelSensitivity, setModelSensitivity] = useState<number>(85);
  const [satelliteFallbackMinutes, setSatelliteFallbackMinutes] = useState<number>(10);
  const [smsBroadcastEnabled, setSmsBroadcastEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('en');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSaveSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
            SYSTEM ARCHITECTURE & TELEMETRY CONFIGURATION
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            RAAH AI Government Command Center Configuration
          </h2>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">
            Configuration saved and deployed to edge IoT nodes across Northeast corridors!
          </span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: AI Model & Risk Sensitivity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              AI Risk Sensitivity & Thresholds
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Slope Disruption Trigger Sensitivity:</span>
                <span className="font-mono font-bold text-emerald-400">{modelSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={modelSensitivity}
                onChange={(e) => setModelSensitivity(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Higher sensitivity prompts proactive rerouting earlier during rainfall surges.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Satellite Telemetry Sync Interval:</span>
                <span className="font-mono font-bold text-blue-400">{satelliteFallbackMinutes} Mins</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={satelliteFallbackMinutes}
                onChange={(e) => setSatelliteFallbackMinutes(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Frequency of GPS ping fallback through GSAT/NavIC transponders in shadow valleys.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Disaster Alert & Multi-Channel Broadcast */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Bell className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Disaster Broadcast Channels
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <div className="text-white font-semibold">Cell Broadcast & SMS Gateway</div>
                <div className="text-[10px] text-slate-400">
                  Broadcast alerts to drivers within 50km radius
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsBroadcastEnabled}
                onChange={(e) => setSmsBroadcastEnabled(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <div className="text-white font-semibold">Regional Language Interface</div>
                <div className="text-[10px] text-slate-400">
                  Multilingual support for drivers & field officers
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-xs"
              >
                <option value="en">English</option>
                <option value="as">Assamese (অসমীয়া)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* System Information & SIH 2026 Credits */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200">RAAH AI v2.6.4 Production Build</span>
          <span className="text-[10px] font-mono text-emerald-400">SMART INDIA HACKATHON 2026</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Developed for AI-Powered Smart Logistics & Accessibility Intelligence for the North Eastern Region of India.
          Ministry of Development of North Eastern Region (MDoNER) & National Disaster Management Authority (NDMA) alignment.
        </p>
      </div>
    </div>
  );
};
