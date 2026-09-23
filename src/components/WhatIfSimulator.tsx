import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Battery,
  Thermometer,
  Activity,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { WhatIfParams, WhatIfImpact } from '../types/mission';
import { telemetryEngine } from '../services/telemetryEngine';

export const WhatIfSimulator: React.FC = () => {
  const [params, setParams] = useState<WhatIfParams>({
    tempDeltaPercent: 10,
    powerConsumptionDeltaPercent: 20,
    solarGenerationDeltaPercent: -15,
    fuelConsumptionDeltaPercent: 5,
    commLoadDeltaPercent: 10,
  });

  const [hasRun, setHasRun] = useState(true);
  const [impact, setImpact] = useState<WhatIfImpact>(() => telemetryEngine.computeWhatIf(params));

  const handleParamChange = (key: keyof WhatIfParams, val: number) => {
    const updated = { ...params, [key]: val };
    setParams(updated);
    setImpact(telemetryEngine.computeWhatIf(updated));
  };

  const handleReset = () => {
    const resetParams: WhatIfParams = {
      tempDeltaPercent: 0,
      powerConsumptionDeltaPercent: 0,
      solarGenerationDeltaPercent: 0,
      fuelConsumptionDeltaPercent: 0,
      commLoadDeltaPercent: 0,
    };
    setParams(resetParams);
    setImpact(telemetryEngine.computeWhatIf(resetParams));
  };

  const applyPreset = (presetName: string) => {
    let newParams: WhatIfParams;
    switch (presetName) {
      case 'ECLIPSE':
        newParams = {
          tempDeltaPercent: -15,
          powerConsumptionDeltaPercent: 10,
          solarGenerationDeltaPercent: -80,
          fuelConsumptionDeltaPercent: 0,
          commLoadDeltaPercent: 0,
        };
        break;
      case 'SURGE':
        newParams = {
          tempDeltaPercent: 15,
          powerConsumptionDeltaPercent: 35,
          solarGenerationDeltaPercent: 0,
          fuelConsumptionDeltaPercent: 5,
          commLoadDeltaPercent: 40,
        };
        break;
      case 'MANEUVER':
        newParams = {
          tempDeltaPercent: 5,
          powerConsumptionDeltaPercent: 15,
          solarGenerationDeltaPercent: -20,
          fuelConsumptionDeltaPercent: 45,
          commLoadDeltaPercent: 20,
        };
        break;
      default:
        newParams = {
          tempDeltaPercent: 10,
          powerConsumptionDeltaPercent: 20,
          solarGenerationDeltaPercent: -15,
          fuelConsumptionDeltaPercent: 5,
          commLoadDeltaPercent: 10,
        };
    }
    setParams(newParams);
    setImpact(telemetryEngine.computeWhatIf(newParams));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
      case 'HIGH':
        return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      case 'MODERATE':
        return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              DIGITAL TWIN PROGNOSTIC ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              PHYSICS SOLVER
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            What-If Scenario Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test counterfactual operational stress tests without risking real satellite flight hardware.
          </p>
        </div>

        {/* Quick Stress Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('SURGE')}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors"
          >
            Payload Surge +35%
          </button>
          <button
            onClick={() => applyPreset('ECLIPSE')}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors"
          >
            Eclipse Pass (-80% Solar)
          </button>
          <button
            onClick={() => applyPreset('MANEUVER')}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors"
          >
            Thruster Burn (+45% Fuel)
          </button>
          <button
            onClick={handleReset}
            title="Reset parameters"
            className="p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters (6 Columns) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>SIMULATION PARAMETERS</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">INPUT VARIABLES</span>
          </div>

          {/* Slider 1: Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Core Thermal Load</span>
              <span className="font-mono text-cyan-400 font-bold">
                {params.tempDeltaPercent > 0 ? `+${params.tempDeltaPercent}%` : `${params.tempDeltaPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              step="5"
              value={params.tempDeltaPercent}
              onChange={(e) => handleParamChange('tempDeltaPercent', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-20% Cooling</span>
              <span>Nominal (0%)</span>
              <span>+50% Radiative Heat</span>
            </div>
          </div>

          {/* Slider 2: Power Consumption */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Power Consumption Draw</span>
              <span className="font-mono text-cyan-400 font-bold">
                {params.powerConsumptionDeltaPercent > 0
                  ? `+${params.powerConsumptionDeltaPercent}%`
                  : `${params.powerConsumptionDeltaPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="60"
              step="5"
              value={params.powerConsumptionDeltaPercent}
              onChange={(e) => handleParamChange('powerConsumptionDeltaPercent', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-30% Load Shed</span>
              <span>Nominal (4.8 kW)</span>
              <span>+60% Full Instrumentation</span>
            </div>
          </div>

          {/* Slider 3: Solar Generation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Solar Array Generation</span>
              <span className="font-mono text-cyan-400 font-bold">
                {params.solarGenerationDeltaPercent > 0
                  ? `+${params.solarGenerationDeltaPercent}%`
                  : `${params.solarGenerationDeltaPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-80"
              max="30"
              step="5"
              value={params.solarGenerationDeltaPercent}
              onChange={(e) => handleParamChange('solarGenerationDeltaPercent', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-80% Eclipse</span>
              <span>Nominal (5.2 kW)</span>
              <span>+30% Perihelion Yield</span>
            </div>
          </div>

          {/* Slider 4: Fuel Consumption */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Fuel / Thruster Consumption</span>
              <span className="font-mono text-cyan-400 font-bold">
                {params.fuelConsumptionDeltaPercent > 0
                  ? `+${params.fuelConsumptionDeltaPercent}%`
                  : `${params.fuelConsumptionDeltaPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="60"
              step="5"
              value={params.fuelConsumptionDeltaPercent}
              onChange={(e) => handleParamChange('fuelConsumptionDeltaPercent', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-20% Quiescent</span>
              <span>Nominal</span>
              <span>+60% Orbital Correction</span>
            </div>
          </div>

          <button
            onClick={() => setImpact(telemetryEngine.computeWhatIf(params))}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RUN ORBITAL SIMULATION SOLVER</span>
          </button>
        </div>

        {/* Right Side: Simulated Impact (6 Columns) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>SIMULATED IMPACT</span>
            </div>
            <div className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getRiskColor(impact.simulatedRisk)}`}>
              PREDICTED RISK: {impact.simulatedRisk}
            </div>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Battery Impact Card */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Battery className="w-3.5 h-3.5 text-cyan-400" />
                <span>BATTERY LEVEL</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-mono font-bold text-slate-300">
                  {impact.baselineBatteryPercent}%
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className={`text-xl font-mono font-bold ${impact.simulatedBatteryPercent < 60 ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {impact.simulatedBatteryPercent}%
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Delta: {impact.simulatedBatteryPercent < impact.baselineBatteryPercent ? (
                  <span className="text-rose-400 font-semibold">
                    -{(impact.baselineBatteryPercent - impact.simulatedBatteryPercent).toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    +{(impact.simulatedBatteryPercent - impact.baselineBatteryPercent).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            {/* Temperature Impact Card */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>CORE TEMP</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-mono font-bold text-slate-300">
                  {impact.baselineTemp}°C
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className={`text-xl font-mono font-bold ${impact.simulatedTemp > 80 ? 'text-rose-400' : 'text-amber-300'}`}>
                  {impact.simulatedTemp}°C
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Delta: {impact.simulatedTemp > impact.baselineTemp ? (
                  <span className="text-rose-400 font-semibold">
                    +{(impact.simulatedTemp - impact.baselineTemp).toFixed(1)}°C
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    -{(impact.baselineTemp - impact.simulatedTemp).toFixed(1)}°C
                  </span>
                )}
              </div>
            </div>

            {/* Mission Health Score Impact */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>MISSION HEALTH</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-mono font-bold text-slate-300">
                  {impact.baselineHealth}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className={`text-xl font-mono font-bold ${impact.simulatedHealth < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {impact.simulatedHealth}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Score: {impact.simulatedHealth < impact.baselineHealth ? (
                  <span className="text-rose-400 font-semibold">
                    -{impact.baselineHealth - impact.simulatedHealth} PTS
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    +{impact.simulatedHealth - impact.baselineHealth} PTS
                  </span>
                )}
              </div>
            </div>

            {/* Risk Category Shift */}
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>RISK LEVEL</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono font-bold text-slate-300">
                  {impact.baselineRisk}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className={`text-base font-mono font-bold ${getRiskColor(impact.simulatedRisk).split(' ')[0]}`}>
                  {impact.simulatedRisk}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {impact.marginViolationRisk ? (
                  <span className="text-rose-400 font-bold">BOUNDS VIOLATION</span>
                ) : (
                  <span className="text-emerald-400">SAFE OPERATING MARGIN</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Prognostic Rationale Box */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              PROGNOSTIC FLIGHT ASSESSMENT
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              {impact.primaryRiskSummary}
            </p>
            {impact.powerDeficitKw > 0 && (
              <div className="text-xs text-amber-300 font-mono pt-1">
                ⚠ Estimated Bus Power Deficit: <strong>{impact.powerDeficitKw} kW</strong> during eclipse transit.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
