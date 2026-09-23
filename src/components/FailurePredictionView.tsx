import React from 'react';
import {
  TrendingDown,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { FailurePrediction, SubsystemDetail } from '../types/mission';

interface FailurePredictionViewProps {
  predictions: FailurePrediction[];
  subsystems: SubsystemDetail[];
  onOpenExplainableAI: () => void;
  onOpenWhatIf: () => void;
}

export const FailurePredictionView: React.FC<FailurePredictionViewProps> = ({
  predictions,
  subsystems,
  onOpenExplainableAI,
  onOpenWhatIf,
}) => {
  const primaryPrediction = predictions[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40' };
      case 'HIGH':
        return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' };
      case 'MODERATE':
        return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' };
      default:
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              SUBSYSTEM PROGNOSTICS & RELIABILITY
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
              TEMPORAL ML MODEL
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Predictive Subsystem Failure Modeling
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimates degradation lead time and failure probability hours before physical damage occurs.
          </p>
        </div>

        {/* Demo Notice Disclaimer (Mandatory per problem brief) */}
        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-slate-400">
          PROGNOSTICS: <span className="text-cyan-300 font-semibold">DIGITAL TWIN SIMULATION</span>
        </div>
      </div>

      {/* Grid: Subsystem Risk Bars on Left (5 Cols) + Detailed Primary Prediction on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Subsystem Risk Rankings */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              <span>SUBSYSTEM RISK RANKINGS</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">PROBABILITY</span>
          </div>

          <div className="space-y-3.5">
            {subsystems
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((sub) => {
                const colors = getRiskColor(sub.riskLevel);
                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-200">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                          {sub.riskLevel}
                        </span>
                        <span className="font-mono font-bold text-slate-100 w-10 text-right">
                          {sub.riskScore}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          sub.riskScore >= 70 ? 'bg-rose-500' : sub.riskScore >= 45 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${sub.riskScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Side: Detailed Predicted Failure Spotlight */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-5">
          {primaryPrediction ? (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    MOST CRITICAL FAILURE PREDICTION
                  </div>
                  <h3 className="text-lg font-bold font-display text-rose-400 mt-1">
                    {primaryPrediction.title}
                  </h3>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Affected Subsystem: <strong className="text-slate-100">{primaryPrediction.subsystemName}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">RISK LEVEL</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {primaryPrediction.riskLevel}
                  </span>
                </div>
              </div>

              {/* Key Prognostic KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">FAILURE PROBABILITY</div>
                  <div className="text-xl font-mono font-bold text-rose-400 mt-1">
                    {primaryPrediction.failureProbability}%
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">TIME-TO-FAILURE WINDOW</div>
                  <div className="text-xl font-mono font-bold text-amber-300 mt-1">
                    {primaryPrediction.estimatedTimeToFailure}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">MODEL CONFIDENCE</div>
                  <div className="text-xl font-mono font-bold text-cyan-300 mt-1">
                    {primaryPrediction.confidence}%
                  </div>
                </div>
              </div>

              {/* Contributing Factors */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  PRIMARY CONTRIBUTING ANOMALY FACTORS:
                </div>
                <div className="space-y-1.5">
                  {primaryPrediction.contributingFactors.map((cf, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-slate-200 font-medium">{cf.factor}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-400">TREND: {cf.trend}</span>
                        <span className="font-mono font-bold text-cyan-400">{cf.weightPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consequence & Mitigation Summary */}
              <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
                <div className="font-bold text-rose-300 font-mono">MISSION IMPACT CONSEQUENCE:</div>
                <p className="text-slate-300 leading-relaxed">
                  {primaryPrediction.consequenceSummary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={onOpenExplainableAI}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Brain className="w-4 h-4" />
                  <span>View Explainable AI "Why?" Evidence</span>
                </button>
                <button
                  onClick={onOpenWhatIf}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>Test in What-If Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              No failure predictions flagged. All subsystems nominal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
