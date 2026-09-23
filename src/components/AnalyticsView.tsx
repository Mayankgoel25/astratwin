import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { TelemetryFrame, SubsystemDetail } from '../types/mission';

interface AnalyticsViewProps {
  currentFrame: TelemetryFrame;
  subsystems: SubsystemDetail[];
  history: TelemetryFrame[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentFrame,
  subsystems,
  history,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              LONG-TERM TELEMETRY ANALYTICS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              ORBIT #1,429 ANALYSIS
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Spacecraft Reliability & Telemetry Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical correlations, mean-time-between-failure (MTBF) tracking, and subsystem energy efficiency trends.
          </p>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#070a12] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">ORBITAL PERIOD</span>
          <div className="text-xl font-mono font-bold text-slate-100">95.4 MIN</div>
          <span className="text-[11px] text-slate-400">Altitude: 540 km LEO</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-[#070a12] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">SOLAR BETA ANGLE</span>
          <div className="text-xl font-mono font-bold text-cyan-400">+34.2°</div>
          <span className="text-[11px] text-slate-400">Sunlit ratio: 64%</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-[#070a12] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">CUMULATIVE TELEMETRY</span>
          <div className="text-xl font-mono font-bold text-slate-100">4.82 GB</div>
          <span className="text-[11px] text-slate-400">Packet Loss: &lt;0.01%</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-[#070a12] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">FLEET AVAILABILITY</span>
          <div className="text-xl font-mono font-bold text-emerald-400">99.84%</div>
          <span className="text-[11px] text-slate-400">Total MTBF: 42,000 hrs</span>
        </div>
      </div>

      {/* Subsystem Health Comparison Matrix */}
      <div className="rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Subsystem Health & Degradation Rate Index</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">30-DAY DRIFT RATE</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {subsystems.map((sub) => (
            <div key={sub.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-sans font-semibold text-slate-200">{sub.name}</span>
                <span className="text-cyan-300 font-bold">{sub.health}% Health</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    sub.health >= 85 ? 'bg-emerald-400' : sub.health >= 70 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${sub.health}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Power Draw: {sub.powerDrawKw} kW</span>
                <span>Operating Temp: {sub.operatingTemp}°C</span>
                <span>Risk Score: {sub.riskScore}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
