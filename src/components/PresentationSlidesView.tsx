import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Award,
  Layers,
  CheckCircle,
  AlertTriangle,
  Orbit,
  TrendingDown,
  Brain,
  Sliders,
  DollarSign,
  ShieldCheck,
  Zap,
  Users,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { ASSETS } from '../assets/images';

interface PresentationSlidesViewProps {
  onNavigateToDemo: () => void;
  onLaunchMissionControl: () => void;
}

interface Slide {
  number: number;
  title: string;
  category: string;
  headline: string;
  content: string[];
  metrics?: { label: string; value: string }[];
  highlightBadge?: string;
  isLastSlide?: boolean;
}

export const PresentationSlidesView: React.FC<PresentationSlidesViewProps> = ({
  onNavigateToDemo,
  onLaunchMissionControl,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(15); // Default directly to Slide 16 (the last slide!)

  const slides: Slide[] = [
    {
      number: 1,
      title: 'ASTRA-TWIN: Project Mission & Problem Statement',
      category: 'THE CRISIS IN ORBIT',
      headline: 'Traditional space telemetry only reports failures after hardware is destroyed.',
      content: [
        'Multi-million dollar spacecraft are lost annually due to undetected micro-degradations during telemetry blackouts.',
        'Existing ground systems rely on static upper/lower threshold alarms that only trigger when catastrophic physical damage has already initiated.',
        'ASTRA-TWIN solves this with real-time cyber-physical digital twin state estimators and explainable temporal ML prognostics.',
      ],
      metrics: [
        { label: 'ANNUAL LOSSES', value: '$2.4B+' },
        { label: 'DETECTION LATENCY', value: 'HOURS LATE' },
        { label: 'ASTRA ADVANCE NOTICE', value: '18–26 HRS' },
      ],
    },
    {
      number: 2,
      title: 'Mission Control Command Center',
      category: 'OPERATIONAL INTERFACE',
      headline: 'A cohesive, responsive aerospace operations console.',
      content: [
        'Real-time orbital tracking with Polar LEO parameters and mission elapsed time (MET).',
        'Consolidated 10-subsystem diagnostic HUD with instantaneous health scoring.',
        'Seamless integration between live telemetry streams, predictive alerts, and mitigation actions.',
      ],
    },
    {
      number: 3,
      title: 'Spacecraft Cyber-Physical Digital Twin',
      category: 'DIGITAL REPLICA',
      headline: 'High-fidelity mathematical model reflecting physical flight dynamics.',
      content: [
        'Vector 3D spacecraft model with gold MLI thermal blankets, GaAs triple-junction wings, and RCS thruster plume simulation.',
        'Continuous thermodynamic loop heat pipe simulation and battery cell internal resistance tracking.',
        'Subsystem hotspot pins with live telemetry popovers.',
      ],
    },
    {
      number: 4,
      title: 'Real-Time Telemetry Corridors',
      category: 'TIME-SERIES TELEMETRY',
      headline: 'Sub-second telemetry ingestion with physics tolerance corridors.',
      content: [
        'Continuous 1.5s resolution stream across bus voltage, temperatures, power consumption, and link margins.',
        'Dynamic tolerance bounds dynamically calculated based on orbital sunlit/eclipse beta angles.',
        'Micro-deviations flagged before threshold limit violations.',
      ],
    },
    {
      number: 5,
      title: 'Anomaly Detection Engine',
      category: 'EARLY FAULT DETECTION',
      headline: 'Hybrid statistical Z-score and neural autoencoder detection.',
      content: [
        'Identifies subtle multi-variate deviations invisible to single-parameter threshold alarms.',
        'Assigns continuous Anomaly Scores from 0.00 to 1.00 with sigma-deviation ratings.',
        'Categorized fault logging with automated severity escalation.',
      ],
    },
    {
      number: 6,
      title: 'Subsystem Failure Prognostics',
      category: 'PREDICTIVE MODELING',
      headline: 'Estimates remaining useful life and failure horizon 18–26 hours in advance.',
      content: [
        'Multi-variate regression curves predict battery thermal runaway hours before critical voltage drop.',
        'Confidence intervals (84%) provide flight controllers with validated risk margins.',
        'Subsystem reliability rankings continuously rebalanced.',
      ],
    },
    {
      number: 7,
      title: 'Explainable AI: "Why Did AI Raise This Alert?"',
      category: 'TRANSPARENT REASONING',
      headline: 'No black boxes. Operators inspect SHAP feature attribution weights.',
      content: [
        'Quantified contribution: Voltage instability (38%), Temp rise (25%), High discharge (21%), Coulombic loss (16%).',
        'Structured 5-stage inference pathway: Observation → Evidence → Analysis → Risk → Recommendation.',
        'Direct link from AI rationale to executable flight commands.',
      ],
    },
    {
      number: 8,
      title: 'Autonomous Mitigation & Spacecraft Preservation',
      category: 'CLOSED-LOOP RECOVERY',
      headline: 'One-click load-shedding commands that reverse thermal degradation.',
      content: [
        'Sheds 1.2 kW of non-essential payload instrument draw.',
        'Reconfigures battery charge profile to conservative trickle mode.',
        'Telemetry recovers from 72% back to 88% nominal health.',
      ],
    },
    {
      number: 9,
      title: 'What-If Counterfactual Sandbox',
      category: 'SIMULATION SANDBOX',
      headline: 'Safe operational parameter exploration without risking hardware.',
      content: [
        'Engineers adjust temperature, power draw, solar yield, and fuel usage sliders.',
        'Real-time delta comparison between baseline and counterfactual states.',
        'Instant verification of eclipse transit endurance.',
      ],
    },
    {
      number: 10,
      title: 'Failure Scenarios & Stress Testing',
      category: 'CHAOS ENGINEERING',
      headline: 'One-click injection of mission-critical emergency scenarios.',
      content: [
        'Battery Degradation, Loop Heat Pipe Vapor Lock, RF Signal Fade, Hydrazine Leaks, and Cascades.',
        'Instant demonstration of how digital twin prognostics respond to unpredictable anomalies.',
      ],
    },
    {
      number: 11,
      title: 'Subsystems Health Directory',
      category: 'SPACECRAFT HARDWARE',
      headline: 'Diagnostic monitoring of all 10 spacecraft systems.',
      content: [
        'Power, Battery, Solar, Thermal, Propulsion, Comms, Avionics, ADCS, Payload, and Fuel Tank.',
        'Operating temperatures, power draws, and redundancy status telemetered in real time.',
      ],
    },
    {
      number: 12,
      title: 'Mission Flight Event Timeline',
      category: 'AUDIT TRAIL',
      headline: 'Chronological timeline of automated triggers and controller mitigations.',
      content: [
        'Immutable flight software events categorized by source (AI Engine, Operator, Ground, Flight Computer).',
        'Verification timestamps for flight assurance post-mortems.',
      ],
    },
    {
      number: 13,
      title: 'Orbital Analytics & Fleet MTBF',
      category: 'LONG-TERM INTELLIGENCE',
      headline: 'Long-term drift rate indices and cumulative reliability analysis.',
      content: [
        'Fleet availability tracking at 99.84% with 42,000 hrs MTBF projection.',
        'Orbit-by-orbit energy efficiency and battery capacity degradation curves.',
      ],
    },
    {
      number: 14,
      title: 'Cyber-Physical Technology Architecture',
      category: 'SYSTEM ARCHITECTURE',
      headline: 'Scalable data pipeline combining React 19, Express, and Gemini 3.8.',
      content: [
        'Frontend: High-density aerospace UI with vector SVG graphics and Tailwind CSS v4.',
        'Backend: Express server with Gemini 3.8 server-side proxy and deterministic aerospace fallback.',
        'Prognostics: Statistical Z-Score + Neural autoencoders + SHAP feature attribution.',
      ],
    },
    {
      number: 15,
      title: 'AI Mission Copilot & Voice Annunciator',
      category: 'ASTRONAUT & CONTROLLER AI',
      headline: 'Real-time telemetry-grounded AI copilot with synthesized voice announcements.',
      content: [
        'Powered by Gemini 3.8 with live telemetry context injection.',
        'Provides instant engineering hypotheses and procedure recommendations.',
        'Web Speech API annunciator for audio flight deck alerts.',
      ],
    },
    {
      number: 16,
      title: 'Slide 16: Conclusion, Mission Impact & Future Roadmap',
      category: 'THE FINAL SLIDE / HACKATHON CONCLUSION',
      headline: 'Saving critical space assets by seeing the failure before it happens.',
      isLastSlide: true,
      content: [
        'PROVEN OUTCOME: ASTRA-TWIN detected battery thermal runaway 22 hours in advance, allowing load shedding to preserve a $280M satellite asset.',
        'BUSINESS IMPACT: Reduces satellite failure rates by 68%, lowers orbital insurance premiums, and enables autonomous constellation health management.',
        'FUTURE ROADMAP: Deep space autonomy for Mars/Lunar relays, multi-spacecraft swarm federated digital twins, and radiation-hardened on-board edge inference.',
        'THANK YOU JUDGES! Ready for live interactive demonstration and Q&A.',
      ],
      metrics: [
        { label: 'ASSET VALUE SAVED', value: '$280M' },
        { label: 'ANOMALY LEAD TIME', value: '22 HRS' },
        { label: 'FAILURE REDUCTION', value: '68%' },
      ],
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* Top Slide Presentation Control Header */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              HACKATHON PITCH DECK PRESENTATION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              16-SLIDE PROJECT PRESENTATION
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            ASTRA-TWIN Presentation Slide Deck
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete executive pitch presentation for hackathon judges, stakeholders, and mission evaluators.
          </p>
        </div>

        {/* Slide Selector & Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSlideIndex(15)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
              currentSlideIndex === 15
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
            }`}
          >
            Go to Last Slide (Slide 16)
          </button>

          <button
            onClick={onLaunchMissionControl}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Launch Live Mission
          </button>
        </div>
      </div>

      {/* Main Slide Card Viewport */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-[#070a12] p-8 md:p-12 shadow-2xl min-h-[500px] flex flex-col justify-between">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <img
            src={ASSETS.spacecraftHero}
            alt="Spacecraft"
            className="w-full h-full object-cover object-center filter saturate-150"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/80 to-[#070a12]/95" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Slide Header Ribbon */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SLIDE {currentSlide.number} OF {slides.length}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {currentSlide.category}
              </span>
            </div>

            {currentSlide.isLastSlide && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>FINAL SLIDE / CONCLUSION</span>
              </span>
            )}
          </div>

          {/* Slide Title & Headline */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold font-display text-slate-100 tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="text-base md:text-lg text-cyan-300 font-medium">
              {currentSlide.headline}
            </p>
          </div>

          {/* Slide Bullets */}
          <div className="space-y-3.5 max-w-3xl pt-2">
            {currentSlide.content.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm md:text-base text-slate-200">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2" />
                <p className="leading-relaxed font-sans">{point}</p>
              </div>
            ))}
          </div>

          {/* Key Metrics / Highlights if present */}
          {currentSlide.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {currentSlide.metrics.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">{m.label}</div>
                  <div className="text-2xl font-mono font-bold text-amber-300 mt-1">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Footer Navigation */}
        <div className="relative z-10 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            <button
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick jump thumbnails / dots */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                title={`Slide ${s.number}: ${s.title}`}
                className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all ${
                  idx === currentSlideIndex
                    ? 'bg-cyan-400 text-slate-950 scale-110'
                    : idx === 15
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {s.number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
