import React from 'react';
import {
  Brain,
  HelpCircle,
  ShieldAlert,
  ArrowDown,
  CheckCircle,
  Sliders,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ExplainableEvidence, SubsystemId } from '../types/mission';

interface ExplainableAIPanelProps {
  evidence: ExplainableEvidence;
  onApplyMitigation: () => void;
  isMitigated: boolean;
  onOpenWhatIf: () => void;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({
  evidence,
  onApplyMitigation,
  isMitigated,
  onOpenWhatIf,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              AEROSPACE EXPLAINABLE AI (XAI)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SHAP ATTRIBUTION
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Why Did AI Raise This Alert?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent algorithmic accountability: Multi-parameter evidence decomposition, root cause causality, and engineer-verifiable physics rationale.
          </p>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 px-4 py-2.5 rounded-lg shrink-0">
          <Brain className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-[10px] font-mono text-slate-400">MODEL CONFIDENCE</div>
            <div className="text-lg font-mono font-bold text-cyan-300">
              {evidence.confidenceScore}% <span className="text-xs text-slate-400">HIGH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quantitative Evidence Decomposition (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <div className="text-[11px] font-mono uppercase text-slate-400">PRIMARY PREDICTION</div>
              <div className="text-base font-bold font-display text-rose-400 mt-0.5">
                {evidence.predictionTitle}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Subsystem: <strong className="text-slate-200">{evidence.subsystem}</strong>
              </div>
            </div>

            {/* Evidence Weights List */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-300 mb-2">
                <span>EVIDENCE FACTOR</span>
                <span>WEIGHT (%)</span>
              </div>
              <div className="space-y-3">
                {evidence.evidenceWeights.map((ew, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-200">{ew.factor}</span>
                      <span className="font-mono font-bold text-cyan-400">{ew.percentage}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${ew.percentage}%` }}
                      />
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      {ew.benchmark}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attribution Method Explanation Box */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono">
              <strong>Algorithm:</strong> Shapley Additive Explanations (Kernel SHAP) applied to digital twin simulated state vectors vs baseline nominal flight parameters.
            </div>
          </div>

          {/* Quick What-If Link CTA */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-cyan-300">Simulate Mitigation Impact</div>
              <div className="text-[11px] text-slate-400">Test load shedding and thermal recovery in the What-If Simulator.</div>
            </div>
            <button
              onClick={onOpenWhatIf}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
            >
              Open What-If
            </button>
          </div>
        </div>

        {/* Right Column: Step-by-Step AI Reasoning Chain (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">INFERENCE CHAIN</div>
                <h3 className="text-base font-bold font-display text-slate-100">
                  Step-by-Step AI Engineering Reasoning
                </h3>
              </div>
              <div className="text-xs font-mono text-emerald-400">
                5 OF 5 PHASES VERIFIED
              </div>
            </div>

            {/* Reasoning Steps Sequence */}
            <div className="space-y-3 relative">
              {evidence.reasoningSteps.map((step, idx) => {
                const isLast = idx === evidence.reasoningSteps.length - 1;

                const getStageBadge = (stage: string) => {
                  switch (stage) {
                    case 'OBSERVATION':
                      return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
                    case 'EVIDENCE':
                      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                    case 'ANALYSIS':
                      return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                    case 'RISK':
                      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                    case 'RECOMMENDATION':
                      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                    default:
                      return 'bg-slate-800 text-slate-300 border-slate-700';
                  }
                };

                return (
                  <div key={idx} className="relative">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition-colors space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStageBadge(step.stage)}`}>
                          STAGE {idx + 1}: {step.stage}
                        </span>
                        {step.metricDetail && (
                          <span className="text-[11px] font-mono text-cyan-300">
                            {step.metricDetail}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-slate-100">
                        {step.title}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>

                    {!isLast && (
                      <div className="flex justify-center my-1">
                        <ArrowDown className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Engineer Execution Button */}
            <div className="pt-3 border-t border-slate-800/80">
              {isMitigated ? (
                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>AI Recommendation Executed: Spacecraft load reduced. Telemetry returning to nominal corridor.</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-slate-200">Recommended Action Ready</div>
                    <div className="text-[11px] text-slate-400">Apply autonomous load-shedding and battery trickle-charge profile.</div>
                  </div>
                  <button
                    onClick={onApplyMitigation}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    Execute AI Recommendation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
