import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  X,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { ScenarioPreset } from '../types/mission';

interface DemoTourOverlayProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
  onSetScenario: (scenario: ScenarioPreset) => void;
  onApplyMitigation: () => void;
  onResetMission: () => void;
}

interface DemoStep {
  number: number;
  title: string;
  badge: string;
  narrative: string;
  targetPage: string;
  actionButtonText: string;
  action: () => void;
}

export const DemoTourOverlay: React.FC<DemoTourOverlayProps> = ({
  onClose,
  onNavigate,
  onSetScenario,
  onApplyMitigation,
  onResetMission,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const steps: DemoStep[] = [
    {
      number: 1,
      title: 'Phase 1: Project Mission Brief',
      badge: 'MISSION START',
      narrative:
        'ASTRA-TWIN: "See the Failure Before It Happens." Introduce judges to the real-time spacecraft digital twin architecture.',
      targetPage: 'landing',
      actionButtonText: 'View Landing Brief',
      action: () => {
        onResetMission();
        onNavigate('landing');
      },
    },
    {
      number: 2,
      title: 'Phase 2: Launch Mission Control Command Center',
      badge: 'COMMAND CENTER',
      narrative:
        'Enter the live operational flight console. All 10 subsystems telemetered with 94% health score and verified orbital stability.',
      targetPage: 'dashboard',
      actionButtonText: 'Go to Mission Dashboard',
      action: () => {
        onNavigate('dashboard');
      },
    },
    {
      number: 3,
      title: 'Phase 3: Digital Twin Subsystem Inspector',
      badge: 'CYBER-PHYSICAL TWIN',
      narrative:
        'Inspect the interactive 3D SVG digital twin. Every module—battery, solar wings, loop heat pipes, and thrusters—is monitored.',
      targetPage: 'digital-twin',
      actionButtonText: 'Open Digital Twin View',
      action: () => {
        onNavigate('digital-twin');
      },
    },
    {
      number: 4,
      title: 'Phase 4: Inject Battery Degradation Anomaly',
      badge: 'FAULT INJECTION',
      narrative:
        'Simulate a subtle electrochemical fault in Battery Block 2. Notice how voltage drops from 28.4V down to 25.6V with thermal accumulation.',
      targetPage: 'telemetry',
      actionButtonText: 'Trigger Battery Anomaly',
      action: () => {
        onSetScenario('BATTERY_DEGRADATION');
        onNavigate('telemetry');
      },
    },
    {
      number: 5,
      title: 'Phase 5: Real-Time Anomaly Flagged',
      badge: 'ANOMALY DETECTED',
      narrative:
        'Hybrid detector flags ANOM-01 with Anomaly Score 0.91 (-3.84σ Z-Score deviation). The flight computer alerts operators.',
      targetPage: 'anomalies',
      actionButtonText: 'Inspect Anomaly Table',
      action: () => {
        onNavigate('anomalies');
      },
    },
    {
      number: 6,
      title: 'Phase 6: Predictive Failure Prognostics',
      badge: 'PREDICTIVE AI',
      narrative:
        'Digital twin predicts critical failure within 18–26 flight hours with 84% model confidence before hardware damage occurs.',
      targetPage: 'failure-prediction',
      actionButtonText: 'View Failure Prediction',
      action: () => {
        onNavigate('failure-prediction');
      },
    },
    {
      number: 7,
      title: 'Phase 7: Explainable AI — "Why Did AI Raise This Alert?"',
      badge: 'TRANSPARENT AI',
      narrative:
        'SHAP value evidence decomposition: Voltage instability (38%), Temp rise (25%), High discharge (21%), Coulombic loss (16%).',
      targetPage: 'explainable-ai',
      actionButtonText: 'View AI Evidence Rationale',
      action: () => {
        onNavigate('explainable-ai');
      },
    },
    {
      number: 8,
      title: 'Phase 8: What-If Counterfactual Sandbox',
      badge: 'SIMULATION SANDBOX',
      narrative:
        'Engineers run counterfactual stress tests in the What-If Simulator: test load shedding and eclipse transitions safely.',
      targetPage: 'what-if',
      actionButtonText: 'Explore What-If Sandbox',
      action: () => {
        onNavigate('what-if');
      },
    },
    {
      number: 9,
      title: 'Phase 9: Autonomous Mitigation Protocol Executed',
      badge: 'MITIGATION ACTIVE',
      narrative:
        'Execute AI recommendation: Shed non-critical payload instruments by 1.2 kW and configure conservative trickle-charge profile.',
      targetPage: 'explainable-ai',
      actionButtonText: 'Execute Load-Shedding',
      action: () => {
        onApplyMitigation();
        onNavigate('dashboard');
      },
    },
    {
      number: 10,
      title: 'Phase 10: Telemetry Stabilized & Spacecraft Preserved!',
      badge: 'MISSION SUCCESS',
      narrative:
        'Subsystem stabilizes at 27.6V. Health recovers from 72% back to 88%. A catastrophic in-orbit failure was averted!',
      targetPage: 'dashboard',
      actionButtonText: 'Return to Mission Control',
      action: () => {
        onNavigate('dashboard');
      },
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setAutoPlay(false);
          return prev;
        }
        const next = prev + 1;
        steps[next].action();
        return next;
      });
    }, 6500);

    return () => clearInterval(timer);
  }, [autoPlay, steps]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      steps[next].action();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prev = currentStepIndex - 1;
      setCurrentStepIndex(prev);
      steps[prev].action();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-24 md:right-8 z-50 animate-in slide-in-from-bottom-5">
      <div className="rounded-2xl border-2 border-cyan-500/60 bg-[#090e1a]/95 backdrop-blur-xl p-4 shadow-2xl space-y-3">
        {/* Top ribbon: Step progress bar */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>JUDGE DEMO FLOW</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-300 font-semibold">
              STEP {currentStep.number} OF {steps.length}: {currentStep.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded border transition-colors ${
                autoPlay ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              {autoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-slate-300" />}
              <span>{autoPlay ? 'Auto-Advancing (6s)' : 'Auto-Play'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="w-full flex gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStepIndex(idx);
                steps[idx].action();
              }}
              className={`h-1.5 rounded-full flex-1 transition-all ${
                idx === currentStepIndex
                  ? 'bg-cyan-400 ring-2 ring-cyan-500/40'
                  : idx < currentStepIndex
                  ? 'bg-cyan-800'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Narrative & Action Body */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-100 font-display">
              {currentStep.title}
            </h4>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {currentStep.narrative}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                currentStep.action();
                handleNext();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Advance Next Phase'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
