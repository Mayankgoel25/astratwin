import React from 'react';
import {
  Network,
  Cpu,
  Layers,
  Database,
  Radio,
  ShieldCheck,
  Code2,
  Server,
  Settings,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              ENGINEERING SPECIFICATION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SYSTEM ARCHITECTURE
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            ASTRA-TWIN Technology Stack & Data Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Technical overview of the physics digital twin runtime, temporal ML models, and Gemini AI pipeline.
          </p>
        </div>
      </div>

      {/* Tech Stack Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Code2 className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-100">
            Frontend Mission Console
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
            <li>• React 19 + TypeScript (Strict)</li>
            <li>• Tailwind CSS v4 Aerospace Theme</li>
            <li>• Vector SVG Digital Twin Canvas</li>
            <li>• Tabular Numerals & High Density HUD</li>
          </ul>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-100">
            Server & AI Engine
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
            <li>• Express Full-Stack Server (`server.ts`)</li>
            <li>• @google/genai TypeScript SDK</li>
            <li>• Gemini 3.8 Server-Side Proxy</li>
            <li>• Deterministic Fallback Logic</li>
          </ul>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-100">
            Prognostic Models
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
            <li>• Statistical Z-Score (30-day baseline)</li>
            <li>• Physics Thermodynamic State Solver</li>
            <li>• Temporal Failure Lead-Time ML</li>
            <li>• Kernel SHAP Attribution Weighting</li>
          </ul>
        </div>
      </div>

      {/* Cyber-Physical Pipeline Flowchart */}
      <div className="rounded-xl border border-slate-800 bg-[#070a12] p-6 space-y-4">
        <h3 className="text-sm font-bold font-display text-slate-100 uppercase tracking-wider">
          Dataflow Pipeline: Spacecraft Telemetry to Operator Action
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">1. INGESTION</span>
            <p className="text-slate-300 text-[11px] font-sans">
              Downlink packets sampled at 1.5s resolution across 16 channels.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold block">2. DIGITAL TWIN</span>
            <p className="text-slate-300 text-[11px] font-sans">
              Parallel simulation computes baseline expectation for current orbit phase.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">3. ANOMALY DETECT</span>
            <p className="text-slate-300 text-[11px] font-sans">
              Detects statistical deviation (&gt;3σ) before hardware bounds fail.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-rose-400 font-bold block">4. PROGNOSTICS</span>
            <p className="text-slate-300 text-[11px] font-sans">
              Calculates 18–26h failure horizon & generates SHAP attribution weights.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold block">5. RECOVERY</span>
            <p className="text-slate-300 text-[11px] font-sans">
              Uplinks AI load-shedding mitigation to stabilize spacecraft.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
