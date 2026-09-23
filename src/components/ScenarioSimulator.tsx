import React from 'react';
import {
  Flame,
  BatteryCharging,
  Radio,
  Droplet,
  Compass,
  Sun,
  Zap,
  RotateCcw,
  CheckCircle,
  Play,
  AlertTriangle,
} from 'lucide-react';
import { ScenarioPreset } from '../types/mission';

interface ScenarioSimulatorProps {
  activeScenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  onResetMission: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  activeScenario,
  onSelectScenario,
  onResetMission,
}) => {
  const scenarios: {
    id: ScenarioPreset;
    title: string;
    icon: any;
    color: string;
    border: string;
    bg: string;
    description: string;
    consequences: string[];
    tag: string;
  }[] = [
    {
      id: 'BATTERY_DEGRADATION',
      title: 'Battery Cell Degradation',
      icon: BatteryCharging,
      color: 'text-rose-400',
      border: 'border-rose-500/40 hover:border-rose-400',
      bg: 'bg-rose-950/20',
      description: 'Progressive internal electrochemical resistance escalation in Cell Block 2.',
      consequences: [
        'Voltage instability dropping from 28.4V to 25.6V',
        'Thermal dissipation elevation in battery bay',
        'Accelerated depth-of-discharge during eclipse',
        'Failure predicted in 18–26 hours (73% risk)',
      ],
      tag: 'RECOMMENDED DEMO',
    },
    {
      id: 'THERMAL_FAILURE',
      title: 'Thermal Control LHP Vapor Lock',
      icon: Flame,
      color: 'text-amber-400',
      border: 'border-amber-500/40 hover:border-amber-400',
      bg: 'bg-amber-950/20',
      description: 'Loop heat pipe capillary dry-out leading to core temperature runaway.',
      consequences: [
        'Internal temperature surges from 72°C to 94°C',
        'Degradation of optical payload CCD sensor alignment',
        'Over-temperature safe-mode trigger in 8–14 hours',
      ],
      tag: 'CRITICAL SEVERITY',
    },
    {
      id: 'COMMUNICATION_LOSS',
      title: 'RF Signal Fade & High Latency',
      icon: Radio,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      bg: 'bg-cyan-950/20',
      description: 'Severe X-band parabolic antenna gimbal pointing drift & phase scintillation.',
      consequences: [
        'Signal strength attenuates to -114 dBm',
        'Downlink frame latency spikes to 1,400 ms',
        'Telemetry stream packet drop rate exceeds 30%',
      ],
      tag: 'LINK MARGIN DEFICIT',
    },
    {
      id: 'FUEL_LEAK',
      title: 'Hydrazine Propulsion Leak',
      icon: Droplet,
      color: 'text-orange-400',
      border: 'border-orange-500/40 hover:border-orange-400',
      bg: 'bg-orange-950/20',
      description: 'Micro-crack on primary isolation latch valve causing propellant venting.',
      consequences: [
        'Manifold pressure drops from 22.4 bar to 11 bar',
        'Residual fuel mass rapidly decreases',
        'Attitude pertubation requiring RCS torque trim',
      ],
      tag: 'MISSION LIFE THREAT',
    },
    {
      id: 'SOLAR_PANEL_DEGRADATION',
      title: 'Solar Array Wing Degradation',
      icon: Sun,
      color: 'text-yellow-400',
      border: 'border-yellow-500/40 hover:border-yellow-400',
      bg: 'bg-yellow-950/20',
      description: 'Drive motor micro-step slip and micrometeroid optical surface pitting.',
      consequences: [
        'Photovoltaic generation drops by 55%',
        'Bus voltage ripple increases',
        'Negative energy balance across orbit cycles',
      ],
      tag: 'POWER DEFICIT',
    },
    {
      id: 'MULTI_SUBSYSTEM_FAILURE',
      title: 'Multi-Subsystem Cascade Failure',
      icon: Zap,
      color: 'text-purple-400',
      border: 'border-purple-500/40 hover:border-purple-400',
      bg: 'bg-purple-950/20',
      description: 'Simultaneous electrical transient affecting thermal, battery, and comms.',
      consequences: [
        'Cascading failures across 4 critical subsystems',
        'Mission health score plunges to 48/100',
        'Autonomous fault detection isolation recovery test',
      ],
      tag: 'CASCADE STRESS TEST',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              MISSION SCENARIO INJECTION ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
              FAULT INJECTOR
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Spacecraft Failure Scenarios
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any failure scenario to observe how the AI Digital Twin detects subtle early telemetry anomalies before irreversible loss occurs.
          </p>
        </div>

        {/* Reset Mission Button */}
        <button
          onClick={onResetMission}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100 text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>RESET TO NOMINAL MISSION</span>
        </button>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenario === sc.id;

          return (
            <div
              key={sc.id}
              className={`flex flex-col justify-between p-5 rounded-xl border transition-all ${
                isActive
                  ? `${sc.bg} ${sc.border} shadow-lg ring-1 ring-cyan-500/30`
                  : 'bg-[#070a12] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg bg-slate-900 border border-slate-800 ${sc.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {sc.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-slate-100">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    SIMULATED ANOMALY EFFECTS:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {sc.consequences.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 text-xs">›</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                {isActive ? (
                  <div className="w-full py-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>CURRENTLY ACTIVE SCENARIO</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectScenario(sc.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-100 transition-colors cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-300 text-slate-300" />
                    <span>SIMULATE THIS FAILURE</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
