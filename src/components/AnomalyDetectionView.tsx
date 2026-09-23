import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle,
  HelpCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { AnomalyRecord, SubsystemId } from '../types/mission';

interface AnomalyDetectionViewProps {
  anomalies: AnomalyRecord[];
  onNavigateToExplainableAI: () => void;
  onNavigateToDigitalTwin: () => void;
}

export const AnomalyDetectionView: React.FC<AnomalyDetectionViewProps> = ({
  anomalies,
  onNavigateToExplainableAI,
  onNavigateToDigitalTwin,
}) => {
  const [selectedDetector, setSelectedDetector] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAnomalyId, setActiveAnomalyId] = useState<string>(anomalies[0]?.id || 'ANOM-01');

  const filteredAnomalies = anomalies.filter((a) => {
    if (selectedDetector !== 'ALL' && a.detectorType !== selectedDetector) return false;
    if (searchQuery && !a.parameter.toLowerCase().includes(searchQuery.toLowerCase()) && !a.subsystemName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const selectedAnomaly = anomalies.find((a) => a.id === activeAnomalyId) || anomalies[0];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              REAL-TIME ANOMALY DETECTOR ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
              ACTIVE FAULT DETECTION
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Spacecraft Telemetry Anomaly Detection
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuously compares incoming flight telemetry against mathematical physics digital twin models and baseline statistical corridors.
          </p>
        </div>

        {/* Detector Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 p-1 rounded-lg text-xs">
          {['ALL', 'HYBRID', 'STATISTICAL_Z', 'RULE_BASED'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedDetector(type)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedDetector === type ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Anomaly Table on Left + Detailed Inspector Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Anomaly List Table (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>DETECTED TELEMETRY ANOMALIES ({filteredAnomalies.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">SELECT TO INSPECT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Subsystem</th>
                  <th className="py-2.5 px-3">Parameter</th>
                  <th className="py-2.5 px-3">Observed</th>
                  <th className="py-2.5 px-3">Expected</th>
                  <th className="py-2.5 px-3 text-right">Anomaly Score</th>
                  <th className="py-2.5 px-3 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredAnomalies.map((anom) => {
                  const isSelected = selectedAnomaly?.id === anom.id;
                  const isCrit = anom.severity === 'CRITICAL' || anom.severity === 'HIGH';

                  return (
                    <tr
                      key={anom.id}
                      onClick={() => setActiveAnomalyId(anom.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 text-cyan-200'
                          : 'hover:bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {anom.subsystemName}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {anom.parameter}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-400">
                        {anom.currentValue}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {anom.nominalRange}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-amber-300">
                        {anom.anomalyScore.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            isCrit
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {anom.severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detailed Anomaly Inspector (5 Cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4 flex flex-col justify-between">
          {selectedAnomaly ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    ANOMALY ID: {selectedAnomaly.id} · {selectedAnomaly.detectorType}
                  </span>
                  <h3 className="text-base font-bold font-display text-slate-100 mt-0.5">
                    {selectedAnomaly.parameter}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Subsystem: <strong className="text-slate-200">{selectedAnomaly.subsystemName}</strong>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">DEVIATION</div>
                  <div className="text-base font-bold text-rose-400">
                    +{selectedAnomaly.deviationPercent}%
                  </div>
                </div>
              </div>

              {/* Anomaly Breakdown Cards */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">1. WHAT HAPPENED?</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{selectedAnomaly.explanation.whatHappened}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">2. WHY IS THIS ABNORMAL?</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{selectedAnomaly.explanation.whyAbnormal}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">3. POSSIBLE ROOT CAUSE</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{selectedAnomaly.explanation.possibleCause}</p>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase block font-bold">4. MISSION IMPACT</span>
                  <p className="text-slate-300 leading-relaxed font-sans">{selectedAnomaly.explanation.impact}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              Select an anomaly from the table to inspect details.
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <button
              onClick={onNavigateToExplainableAI}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Explain "Why?" in Explainable AI Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateToDigitalTwin}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Locate Subsystem in Digital Twin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
