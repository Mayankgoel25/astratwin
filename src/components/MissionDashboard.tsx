import React from 'react';
import {
  Satellite,
  Orbit,
  Activity,
  AlertTriangle,
  TrendingDown,
  Sliders,
  BatteryCharging,
  Thermometer,
  Zap,
  Radio,
  Droplet,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  TelemetryFrame,
  SubsystemDetail,
  AnomalyRecord,
  FailurePrediction,
  MissionAlert,
  ScenarioPreset,
} from '../types/mission';
import { ASSETS } from '../assets/images';

interface MissionDashboardProps {
  currentFrame: TelemetryFrame;
  subsystems: SubsystemDetail[];
  anomalies: AnomalyRecord[];
  predictions: FailurePrediction[];
  alerts: MissionAlert[];
  activeScenario: ScenarioPreset;
  onNavigate: (page: string) => void;
  onSelectScenario: (sc: ScenarioPreset) => void;
}

export const MissionDashboard: React.FC<MissionDashboardProps> = ({
  currentFrame,
  subsystems,
  anomalies,
  predictions,
  alerts,
  activeScenario,
  onNavigate,
  onSelectScenario,
}) => {
  const primaryPrediction = predictions[0];
  const criticalSubsystems = subsystems.filter((s) => s.status === 'CRITICAL' || s.status === 'WARNING');

  return (
    <div className="space-y-5">
      {/* Top Mission Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#090d16] p-5 shadow-2xl">
        {/* Subtle backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none overflow-hidden">
          <img
            src={ASSETS.missionControlBackdrop}
            alt="Mission Control"
            className="w-full h-full object-cover object-right"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#090d16]/70 to-[#090d16]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                SPACECRAFT IDENTIFIER: ASTRA-01
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ORBIT 1,429 · POLAR LEO
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-slate-100 tracking-tight">
              Mission Control Command Center
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time cyber-physical digital twin actively predicting anomalies, simulating stress loads, and safeguarding spacecraft integrity.
            </p>
          </div>

          {/* Quick Mission Action Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('digital-twin')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch Digital Twin</span>
            </button>
            <button
              onClick={() => onSelectScenario('BATTERY_DEGRADATION')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 rounded-lg transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Battery Anomaly</span>
            </button>
            <button
              onClick={() => onNavigate('what-if')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 fill-slate-950" />
              <span>What-If Stress Sim</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">MISSION HEALTH</span>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
              {currentFrame.healthScore}%
            </div>
            <span className="text-[10px] text-slate-400">STATUS: {currentFrame.healthScore >= 85 ? 'NOMINAL' : 'DEGRADED'}</span>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">BUS VOLTAGE</span>
            <div className={`text-xl font-mono font-bold mt-0.5 ${currentFrame.voltage < 27.5 ? 'text-rose-400' : 'text-slate-100'}`}>
              {currentFrame.voltage} V
            </div>
            <span className="text-[10px] text-slate-400">NOMINAL: 28.4V</span>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">CORE TEMP</span>
            <div className={`text-xl font-mono font-bold mt-0.5 ${currentFrame.temperature > 78 ? 'text-amber-400' : 'text-slate-100'}`}>
              {currentFrame.temperature} °C
            </div>
            <span className="text-[10px] text-slate-400">LIMIT: 76.0°C</span>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">BATTERY SOC</span>
            <div className="text-xl font-mono font-bold text-slate-100 mt-0.5">
              {currentFrame.batteryPercent}%
            </div>
            <span className="text-[10px] text-slate-400">DISCHARGE: 14.2A</span>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">FUEL HYDRAZINE</span>
            <div className="text-xl font-mono font-bold text-slate-100 mt-0.5">
              {currentFrame.fuelPercent}%
            </div>
            <span className="text-[10px] text-slate-400">PRESSURE: 22.4 BAR</span>
          </div>

          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">RF LINK MARGIN</span>
            <div className="text-xl font-mono font-bold text-cyan-300 mt-0.5">
              {currentFrame.signalStrengthDb} dBm
            </div>
            <span className="text-[10px] text-slate-400">LATENCY: {currentFrame.commLatencyMs}ms</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Spacecraft Twin Preview (Left) + Subsystem Health Radar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Middle Left: Spacecraft Visual Summary (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Orbit className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold font-display text-slate-100">
                Digital Twin Subsystem Synchronizer
              </h2>
            </div>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full 3D Twin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Interactive Subsystem Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {subsystems.slice(0, 8).map((sub) => {
              const isCrit = sub.status === 'CRITICAL';
              const isWarn = sub.status === 'WARNING';
              const isDeg = sub.status === 'DEGRADED';

              const statusColor = isCrit
                ? 'border-rose-500/50 bg-rose-950/20 text-rose-400'
                : isWarn
                ? 'border-amber-500/50 bg-amber-950/20 text-amber-400'
                : isDeg
                ? 'border-orange-500/50 bg-orange-950/20 text-orange-400'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

              return (
                <div
                  key={sub.id}
                  onClick={() => onNavigate('digital-twin')}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${statusColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase truncate">{sub.name.split(' ')[0]}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCrit ? 'bg-rose-400 animate-ping' : isWarn ? 'bg-amber-400' : isDeg ? 'bg-orange-400' : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                  <div className="text-base font-mono font-bold text-slate-100 mt-1">
                    {sub.health}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {sub.primaryValue}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Active Anomaly Notice if detected */}
          {anomalies.length > 0 && (
            <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Anomaly Active:</strong> {anomalies[0].parameter} at {anomalies[0].currentValue} ({anomalies[0].deviationPercent}% deviation)
                </span>
              </div>
              <button
                onClick={() => onNavigate('explainable-ai')}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-rose-500 hover:bg-rose-400 text-slate-950 transition-colors whitespace-nowrap cursor-pointer"
              >
                Inspect Why
              </button>
            </div>
          )}
        </div>

        {/* Middle Right: AI Predictive Risk Spotlight (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold font-display text-slate-100">
                  Subsystem Failure Prognostics
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI PREDICTIVE
              </span>
            </div>

            {primaryPrediction ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">ESTIMATED FAILURE WINDOW</div>
                      <div className="text-lg font-mono font-bold text-amber-300">
                        {primaryPrediction.estimatedTimeToFailure}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      RISK: {primaryPrediction.failureProbability}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {primaryPrediction.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {primaryPrediction.consequenceSummary}
                  </p>
                </div>

                {/* Contributing factors pills */}
                <div className="flex flex-wrap gap-1.5">
                  {primaryPrediction.contributingFactors.map((cf, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {cf.factor} ({cf.weightPercent}%)
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs font-mono">
                No imminent failure predicted. Spacecraft systems within margin.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onNavigate('explainable-ai')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Explore AI Reasoning & SHAP Attribution</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Mission Alerts (Left 6 Cols) + Quick What-If Preview (Right 6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bottom Left: Alert Center Feed */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold font-display text-slate-100">
                Active Mission Alerts ({alerts.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : alert.severity === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="font-semibold text-slate-200">{alert.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {alert.subsystem} · Value: <strong className="text-slate-300">{alert.currentValue}</strong> (Expected: {alert.expectedRange})
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('explainable-ai')}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono transition-colors whitespace-nowrap cursor-pointer"
                >
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Right: Quick What-If Stress Banner */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold font-display text-slate-100">
                  What-If Counterfactual Sandbox
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                SAFE SIMULATION
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Test what happens to battery life and internal temperature if payload power consumption increases by 25% during an eclipse transit.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">BASELINE TEMP</span>
                <span className="text-slate-200 font-bold">{currentFrame.temperature}°C</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">SIMULATED SURGE</span>
                <span className="text-amber-400 font-bold">{Number((currentFrame.temperature + 9.5).toFixed(1))}°C</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('what-if')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open What-If Simulator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
