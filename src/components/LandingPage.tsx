import React from 'react';
import {
  Satellite,
  Orbit,
  Activity,
  AlertTriangle,
  TrendingDown,
  Brain,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Network,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ASSETS } from '../assets/images';

interface LandingPageProps {
  onLaunchMissionControl: () => void;
  onExploreDigitalTwin: () => void;
  onStartJudgeDemo: () => void;
  onOpenSlides?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchMissionControl,
  onExploreDigitalTwin,
  onStartJudgeDemo,
  onOpenSlides,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#090d16] p-8 md:p-14 shadow-2xl">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none">
          <img
            src={ASSETS.spacecraftHero}
            alt="Spacecraft Digital Twin in Orbit"
            className="w-full h-full object-cover object-center filter saturate-150"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-[#090d16]/90" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>ASTRA-TWIN · SPACECRAFT DIGITAL TWIN HACKATHON PLATFORM</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-slate-100 leading-tight">
            See the Failure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
              Before It Happens.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl">
            Space missions lose millions of dollars when anomalies are detected too late. ASTRA-TWIN fuses high-fidelity physics-based digital twins with explainable AI to detect microscopic telemetry deviations, predict subsystem failure windows, and simulate counterfactual mitigations.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onLaunchMissionControl}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <span>Launch Mission Control</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDigitalTwin}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              <Orbit className="w-4 h-4 text-cyan-400" />
              <span>Explore Digital Twin</span>
            </button>

            <button
              onClick={onStartJudgeDemo}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 font-medium text-xs border border-purple-500/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>10-Phase Judge Demo Flow</span>
            </button>

            {onOpenSlides && (
              <button
                onClick={onOpenSlides}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-xs border border-amber-500/40 transition-colors cursor-pointer"
              >
                <span>Pitch Deck (16 Slides)</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* The Spacecraft Reliability Crisis (Problem Statement) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-100">
            The Latency Dilemma
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            LEO and deep-space missions only communicate during scheduled ground station passes. When telemetry flags a hard limit violation, irreversible hardware loss has often already begun.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Orbit className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-100">
            Cyber-Physical Digital Twin
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ASTRA-TWIN runs a parallel mathematical replica of all 10 spacecraft subsystems—evaluating thermodynamic dissipation, cell impedance, and propellant line dynamics in real time.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-100">
            Explainable AI (XAI)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No black-box guesses. Flight operators see SHAP-attributed root causes: Observation → Evidence → Analysis → Risk → Actionable mitigation protocol.
          </p>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
            ENGINEERING CAPABILITIES
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-100">
            Full-Spectrum Spacecraft Assurance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
            <div className="text-cyan-400 font-mono text-xs font-bold">01 / TWIN REPLICA</div>
            <h4 className="text-sm font-bold text-slate-100 font-display">
              Subsystem Hotspot Mapping
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive 3D vector model reflecting real-time voltage, solar wing flux, loop heat pipes, and cold gas thrusters.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
            <div className="text-amber-400 font-mono text-xs font-bold">02 / DETECTORS</div>
            <h4 className="text-sm font-bold text-slate-100 font-display">
              Z-Score & Autoencoder
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects micro-voltage drops and thermal gradient accumulation before conventional threshold alarms trigger.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
            <div className="text-rose-400 font-mono text-xs font-bold">03 / PROGNOSTICS</div>
            <h4 className="text-sm font-bold text-slate-100 font-display">
              Failure Lead Time Estimator
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Predicts failure probability and time-to-failure windows (e.g. 18–26 hours for battery collapse) with confidence metrics.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
            <div className="text-purple-400 font-mono text-xs font-bold">04 / SANDBOX</div>
            <h4 className="text-sm font-bold text-slate-100 font-display">
              What-If Counterfactual Sim
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stress-test power curves, eclipse passages, and payload loads without risking real satellite hardware.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Architecture Section */}
      <section className="rounded-2xl border border-slate-800 bg-[#090d16] p-8 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              SYSTEM ARCHITECTURE
            </span>
            <h3 className="text-xl font-bold font-display text-slate-100 mt-1">
              End-to-End Cyber-Physical Data Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            ASTRA-TWIN STACK: REACT + EXPRESS + GEMINI 3.8
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">LAYER 1: TELEMETRY</span>
            <p className="text-slate-300 font-sans text-xs">
              Simulated telemetry ingestion engine modeling orbit kinematics, solar illumination beta angles, and load variations.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold">LAYER 2: DIGITAL TWIN</span>
            <p className="text-slate-300 font-sans text-xs">
              State estimator tracking thermodynamic dissipation, cell impedance curves, and RF link budget margin.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-rose-400 font-bold">LAYER 3: PREDICTION</span>
            <p className="text-slate-300 font-sans text-xs">
              Statistical deviation + neural autoencoder flagging subtle anomalies and estimating time-to-failure bounds.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-purple-400 font-bold">LAYER 4: AI REASONING</span>
            <p className="text-slate-300 font-sans text-xs">
              Gemini 3.8 API integration explaining root causes to mission operators and recommending load-shedding actions.
            </p>
          </div>
        </div>
      </section>

      {/* Hackathon Project / Team Info */}
      <section className="p-6 rounded-xl border border-slate-800 bg-[#070a12] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
        <div>
          <div className="text-cyan-400 font-bold">HACKATHON SUBMISSION: ASTRA-TWIN</div>
          <div className="text-slate-400 mt-0.5">
            Spacecraft Health Assurance & Predictive Mission Control System
          </div>
        </div>

        <button
          onClick={onLaunchMissionControl}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <span>Launch Mission Control Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
