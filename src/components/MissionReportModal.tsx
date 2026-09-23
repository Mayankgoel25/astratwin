import React from 'react';
import {
  Printer,
  Download,
  X,
  Satellite,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
} from 'lucide-react';
import { TelemetryFrame, SubsystemDetail, FailurePrediction, AnomalyRecord } from '../types/mission';

interface MissionReportModalProps {
  currentFrame: TelemetryFrame;
  subsystems: SubsystemDetail[];
  predictions: FailurePrediction[];
  anomalies: AnomalyRecord[];
  onClose: () => void;
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({
  currentFrame,
  subsystems,
  predictions,
  anomalies,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportData = {
      satellite: 'ASTRA-01',
      reportType: 'FLIGHT_ASSURANCE_DIAGNOSTIC_LOG',
      generatedAt: new Date().toISOString(),
      healthScore: currentFrame.healthScore,
      telemetry: currentFrame,
      subsystems,
      anomalies,
      failurePredictions: predictions,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASTRA-01_MISSION_REPORT_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-700 bg-[#090d16] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-slate-100">
                ASTRA-01 Mission Flight Assurance Report
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Document Ref: ASTRA-FAR-2026-0922 · Generated {new Date().toUTCString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-100 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans text-slate-300">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-400 uppercase font-bold">EXECUTIVE HEALTH ASSESSMENT</span>
              <span className="text-slate-400">MET: T+142:18:42</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-slate-100">{currentFrame.healthScore}%</span>
              <span className="text-xs font-mono text-slate-400">COMPOSITE MISSION HEALTH INDEX</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Spacecraft ASTRA-01 is currently in Orbit #1,429. Physical telemetry parameters are telemetered with 1.5s resolution.
              {anomalies.length > 0 ? (
                <span className="text-amber-300 font-medium"> {anomalies.length} active anomalies have been flagged by the predictive autoencoder.</span>
              ) : (
                <span className="text-emerald-400 font-medium"> All 10 subsystems telemetering within nominal tolerance limits.</span>
              )}
            </p>
          </div>

          {/* Subsystems Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
              1. SUBSYSTEM STATUS MATRIX
            </h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden font-mono text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-2.5">Subsystem</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Health</th>
                    <th className="p-2.5">Key Metric</th>
                    <th className="p-2.5">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subsystems.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-bold text-slate-200">{s.name}</td>
                      <td className="p-2.5 text-slate-400">{s.category}</td>
                      <td className="p-2.5 font-bold">{s.health}%</td>
                      <td className="p-2.5 text-slate-300">{s.primaryMetric}: {s.primaryValue}</td>
                      <td className="p-2.5 text-slate-300">{s.riskLevel} ({s.riskScore}%)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Failure Predictions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
              2. PROGNOSTIC MODEL PREDICTIONS & MITIGATION DIRECTIVES
            </h4>
            {predictions.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
                <div className="flex justify-between items-center font-mono">
                  <span className="font-bold text-rose-300">{p.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    RISK: {p.failureProbability}% (CONFIDENCE: {p.confidence}%)
                  </span>
                </div>
                <div className="text-slate-300">
                  <strong>Estimated Time-to-Failure:</strong> {p.estimatedTimeToFailure}
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{p.consequenceSummary}</p>
                <div className="pt-2 border-t border-rose-500/20 text-[11px] font-mono text-cyan-300">
                  <strong>Action Directive:</strong> {p.mitigationProtocol}
                </div>
              </div>
            ))}
          </div>

          {/* Signature Block */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <div>APPROVED: FLIGHT OPERATIONS DIRECTOR</div>
            <div>ASTRA-TWIN CYBER-PHYSICAL ENGINE VERIFIED</div>
          </div>
        </div>
      </div>
    </div>
  );
};
