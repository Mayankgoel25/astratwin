import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  RotateCcw,
  Download,
  ShieldCheck,
  Cpu,
  Brain,
  Radio,
  Satellite,
  Volume2,
  FileSpreadsheet,
  FileText,
  Play,
  Pause,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { TelemetryFrame, SubsystemDetail, ScenarioPreset } from '../types/mission';
import { telemetryEngine } from '../services/telemetryEngine';
import { Language, SUPPORTED_LANGUAGES, TranslationDictionary } from '../services/i18n';
import { Globe, Database, ExternalLink } from 'lucide-react';

interface SettingsAdminViewProps {
  currentFrame: TelemetryFrame;
  subsystems: SubsystemDetail[];
  activeScenario: ScenarioPreset;
  onResetMission: () => void;
  audioAnnounceEnabled: boolean;
  onToggleAudioAnnounce: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationDictionary;
}

export const SettingsAdminView: React.FC<SettingsAdminViewProps> = ({
  currentFrame,
  subsystems,
  activeScenario,
  onResetMission,
  audioAnnounceEnabled,
  onToggleAudioAnnounce,
  language,
  onLanguageChange,
  t,
}) => {
  // Settings State
  const [selectedSatellite, setSelectedSatellite] = useState<'ASTRA-01' | 'ASTRA-02' | 'ASTRA-03'>('ASTRA-01');
  const [zScoreThreshold, setZScoreThreshold] = useState<number>(3.0);
  const [autoencoderTolerance, setAutoencoderTolerance] = useState<number>(0.85);
  const [simulationSpeed, setSimulationSpeed] = useState<string>('1x');
  const [xaiMethod, setXaiMethod] = useState<'SHAP' | 'PHYSICS_BOUNDS' | 'HYBRID'>('HYBRID');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveSettings = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleExportCSV = () => {
    const history = telemetryEngine.getHistory();
    const headers = 'Timestamp,Time,Voltage_V,Temperature_C,Battery_Percent,Fuel_Percent,Power_kW,Signal_dBm,HealthScore\n';
    const rows = history
      .map(
        (f) =>
          `${f.timestamp},"${f.timeFormatted}",${f.voltage},${f.temperature},${f.batteryPercent},${f.fuelPercent},${f.powerKw},${f.signalStrengthDb},${f.healthScore}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASTRA-01_TELEMETRY_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      spacecraft: selectedSatellite,
      exportedAt: new Date().toISOString(),
      currentFrame,
      subsystems,
      activeScenario,
      telemetryHistory: telemetryEngine.getHistory(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASTRA-01_FULL_MISSION_STATE_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              MISSION CONTROL ADMIN CONSOLE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SLIDE 16 / CONFIGURATION
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Settings, Admin & Simulation Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure spacecraft models, adjust anomaly sensitivity thresholds, replay telemetry passes, and export flight datasets.
          </p>
        </div>

        {/* Save Confirmation or Action */}
        <div className="flex items-center gap-2">
          {savedNotification && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Settings Synchronized!</span>
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Spacecraft Model & Anomaly Thresholds (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mission Language Localization Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Mission Human Language Localization</span>
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 uppercase">I18N SUPPORT</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Switch primary flight controller display language between English, French (Français), Hindi (हिन्दी), and German (Deutsch). AI diagnostics, navigation telemetry ribbons, and annunciator reports adapt instantly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-center ${
                    language === lang.code
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-2xl mb-1">{lang.flag}</span>
                  <span className="text-xs font-semibold text-slate-100">{lang.nativeName}</span>
                  <span className="text-[10px] font-mono text-slate-400">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Connected Supabase Database Storage Card */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-[#070a12] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase Spacecraft Digital Twin Storage</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                CONNECTED
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Project ID:</span>
                <span className="font-mono text-emerald-400">lugmtagstkfbnblpfjsl</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Pipeline Tables:</span>
                <span className="font-mono text-cyan-400">telemetry, anomalies, predictions, recommendations, alerts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Security:</span>
                <span className="font-mono text-emerald-300">Row Level Security (RLS) Active</span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Real-time simulation frames stream to Supabase with automatic anomaly detection.</span>
              <a
                href="https://supabase.com/dashboard/project/lugmtagstkfbnblpfjsl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-mono"
              >
                <span>Supabase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Spacecraft Target Selection */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span>Active Spacecraft Model</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">CONSTELLATION</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => setSelectedSatellite('ASTRA-01')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  selectedSatellite === 'ASTRA-01'
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-100">ASTRA-01 (Earth Observation / LEO)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ACTIVE TARGET
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  540 km Sun-Synchronous Polar Orbit · 10 Subsystems · GaAs Triple-junction Wings.
                </p>
              </button>

              <button
                onClick={() => setSelectedSatellite('ASTRA-02')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  selectedSatellite === 'ASTRA-02'
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">ASTRA-02 (Polar InSAR Radar)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    STANDBY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  620 km Dawn-Dusk Orbit · L-band Synthetic Aperture Radar Array.
                </p>
              </button>

              <button
                onClick={() => setSelectedSatellite('ASTRA-03')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  selectedSatellite === 'ASTRA-03'
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">ASTRA-03 (Deep Space Lunar Relay)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    SCHEDULED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Cislunar Halo Orbit · Optical Laser Inter-Satellite Link.
                </p>
              </button>
            </div>
          </div>

          {/* Anomaly Detection Sensitivity Thresholds */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Detection Sensitivity Corridors</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">MATH BOUNDS</span>
            </div>

            {/* Z-Score Sensitivity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Statistical Z-Score Threshold</span>
                <span className="font-mono text-cyan-400 font-bold">{zScoreThreshold.toFixed(1)} σ</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="4.5"
                step="0.1"
                value={zScoreThreshold}
                onChange={(e) => setZScoreThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1.5σ (Ultra-Sensitive)</span>
                <span>3.0σ (Flight Nominal)</span>
                <span>4.5σ (Conservative)</span>
              </div>
            </div>

            {/* Neural Autoencoder Tolerance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Neural Autoencoder Anomaly Threshold</span>
                <span className="font-mono text-cyan-400 font-bold">{autoencoderTolerance.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={autoencoderTolerance}
                onChange={(e) => setAutoencoderTolerance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.50 (Aggressive)</span>
                <span>0.85 (Standard)</span>
                <span>0.95 (High Tolerance)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Simulation Control, Data Export, AI Modes (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Simulation & Mission Control */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>Simulation & Clock Controller</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">TELEMETRY ENGINE</span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
              <span className="text-slate-300">Telemetry Ingestion Rate:</span>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded p-1">
                {['0.5x', '1x', '2x', '5x'].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimulationSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      simulationSpeed === spd ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60">
              <span className="text-slate-300">Voice Annunciator Alerts:</span>
              <button
                onClick={onToggleAudioAnnounce}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors ${
                  audioAnnounceEnabled
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{audioAnnounceEnabled ? 'ACTIVE (SPEECH ON)' : 'MUTED'}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={onResetMission}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reset Spacecraft Telemetry to Nominal Baseline</span>
              </button>
            </div>
          </div>

          {/* Explainable AI Algorithm Modes */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Explainable AI Attribution Mode</span>
              </h3>
              <span className="text-[11px] font-mono text-purple-300">XAI CONFIG</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setXaiMethod('SHAP')}
                className={`p-2.5 rounded-lg border text-center font-mono transition-colors ${
                  xaiMethod === 'SHAP'
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                SHAP Kernel
              </button>
              <button
                onClick={() => setXaiMethod('PHYSICS_BOUNDS')}
                className={`p-2.5 rounded-lg border text-center font-mono transition-colors ${
                  xaiMethod === 'PHYSICS_BOUNDS'
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Physics Bounds
              </button>
              <button
                onClick={() => setXaiMethod('HYBRID')}
                className={`p-2.5 rounded-lg border text-center font-mono transition-colors ${
                  xaiMethod === 'HYBRID'
                    ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Hybrid Ensemble
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Hybrid Ensemble combines empirical thermodynamic physics qualification margins with Shapley additive feature importance decomposition.
            </p>
          </div>

          {/* Export Flight Telemetry Datasets */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export Telemetry & Audit Logs</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">DATA PIPELINE</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export CSV Stream</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Export JSON State</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
