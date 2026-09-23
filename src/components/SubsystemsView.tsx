import React from 'react';
import {
  Cpu,
  BatteryCharging,
  Sun,
  Thermometer,
  Flame,
  Radio,
  Compass,
  Camera,
  Droplet,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { SubsystemDetail, SubsystemId } from '../types/mission';
import { ASSETS } from '../assets/images';

interface SubsystemsViewProps {
  subsystems: SubsystemDetail[];
  onSelectSubsystem: (id: SubsystemId) => void;
  onNavigateToDigitalTwin: () => void;
}

export const SubsystemsView: React.FC<SubsystemsViewProps> = ({
  subsystems,
  onSelectSubsystem,
  onNavigateToDigitalTwin,
}) => {
  const getSubsystemIcon = (id: SubsystemId) => {
    switch (id) {
      case 'battery':
        return BatteryCharging;
      case 'power':
        return Zap;
      case 'solar':
        return Sun;
      case 'thermal':
        return Thermometer;
      case 'propulsion':
        return Flame;
      case 'communication':
        return Radio;
      case 'avionics':
        return Cpu;
      case 'attitude':
        return Compass;
      case 'payload':
        return Camera;
      case 'fuel':
        return Droplet;
      default:
        return Cpu;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              ASTRA-01 CYBER-PHYSICAL SUBSYSTEMS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ALL 10 SYSTEMS TELEMETERED
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Spacecraft Subsystem Health Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full diagnostic overview of bus electronics, mechanical actuators, thermal dissipation loops, and payload instrumentation.
          </p>
        </div>

        <button
          onClick={onNavigateToDigitalTwin}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md cursor-pointer whitespace-nowrap"
        >
          <span>Open Interactive Digital Twin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subsystem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subsystems.map((sub) => {
          const Icon = getSubsystemIcon(sub.id);
          const isCrit = sub.status === 'CRITICAL';
          const isWarn = sub.status === 'WARNING';
          const isDeg = sub.status === 'DEGRADED';

          const statusColor = isCrit
            ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
            : isWarn
            ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
            : isDeg
            ? 'border-orange-500/40 bg-orange-950/20 text-orange-300'
            : 'border-slate-800 bg-[#070a12] text-slate-300 hover:border-slate-700';

          return (
            <div
              key={sub.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${statusColor}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isCrit
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : isWarn
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : isDeg
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {sub.category}
                  </div>
                  <h3 className="text-base font-bold font-display text-slate-100 mt-0.5">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                {/* Subsystem Health Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">HEALTH:</span>
                    <span className="font-bold text-slate-100">{sub.health}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.health >= 85 ? 'bg-emerald-400' : sub.health >= 70 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sub.health}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block truncate">{sub.primaryMetric}</span>
                    <span className="font-bold text-slate-200">{sub.primaryValue}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block truncate">{sub.secondaryMetric}</span>
                    <span className="font-bold text-slate-200">{sub.secondaryValue}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 mt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectSubsystem(sub.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  <span>Inspect Subsystem</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
