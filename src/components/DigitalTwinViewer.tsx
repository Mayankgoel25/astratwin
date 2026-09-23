import React, { useState } from 'react';
import {
  Zap,
  BatteryCharging,
  Sun,
  Thermometer,
  Flame,
  Radio,
  Cpu,
  Compass,
  Camera,
  Droplet,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { SubsystemDetail, SubsystemId, HealthStatus, TelemetryFrame } from '../types/mission';
import { ASSETS } from '../assets/images';

interface DigitalTwinViewerProps {
  subsystems: SubsystemDetail[];
  currentFrame: TelemetryFrame;
  onNavigateToAI: (subsystemId: SubsystemId) => void;
  onApplyMitigation: () => void;
  isMitigated: boolean;
}

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({
  subsystems,
  currentFrame,
  onNavigateToAI,
  onApplyMitigation,
  isMitigated,
}) => {
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<SubsystemId>('battery');
  const [activeLayer, setActiveLayer] = useState<'all' | 'thermal' | 'electrical' | 'propellant'>('all');
  const [isRotating, setIsRotating] = useState(true);

  const selectedSubsystem =
    subsystems.find((s) => s.id === selectedSubsystemId) || subsystems[0];

  const getStatusBadge = (status: HealthStatus) => {
    switch (status) {
      case 'NOMINAL':
        return { label: 'NOMINAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' };
      case 'WARNING':
        return { label: 'WARNING', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' };
      case 'DEGRADED':
        return { label: 'DEGRADED', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', dot: 'bg-orange-400' };
      case 'CRITICAL':
        return { label: 'CRITICAL', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-400 animate-ping' };
      default:
        return { label: 'OFFLINE', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', dot: 'bg-blue-400' };
    }
  };

  const getSubsystemIcon = (id: SubsystemId) => {
    switch (id) {
      case 'battery':
        return BatteryCharging;
      case 'power':
        return Zap;
      case 'solar':
        return Sun;
      case 'thermal':
        return Thermometer;
      case 'propulsion':
        return Flame;
      case 'communication':
        return Radio;
      case 'avionics':
        return Cpu;
      case 'attitude':
        return Compass;
      case 'payload':
        return Camera;
      case 'fuel':
        return Droplet;
      default:
        return Cpu;
    }
  };

  const statusInfo = getStatusBadge(selectedSubsystem.status);
  const SelectedIcon = getSubsystemIcon(selectedSubsystem.id);

  // Hotspot Subsystem Coordinates on Spacecraft Map (percentage)
  const subsystemHotspots: { id: SubsystemId; name: string; x: number; y: number; labelPos: 'top' | 'bottom' | 'left' | 'right' }[] = [
    { id: 'solar', name: 'Solar Array (Left)', x: 18, y: 44, labelPos: 'bottom' },
    { id: 'battery', name: 'Battery Bay', x: 44, y: 56, labelPos: 'bottom' },
    { id: 'power', name: 'Power PDU', x: 48, y: 40, labelPos: 'top' },
    { id: 'thermal', name: 'Thermal Louvers', x: 54, y: 32, labelPos: 'top' },
    { id: 'communication', name: 'High-Gain Dish', x: 56, y: 18, labelPos: 'right' },
    { id: 'avionics', name: 'OBC Core', x: 42, y: 46, labelPos: 'left' },
    { id: 'propulsion', name: 'RCS Thrusters', x: 52, y: 78, labelPos: 'bottom' },
    { id: 'attitude', name: 'ADCS Wheels', x: 38, y: 36, labelPos: 'left' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-[#090d16]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              ASTRA-01 DIGITAL TWIN REPLICA
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PHYSICS REAL-TIME
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100">
            Interactive Spacecraft Subsystem Architecture
          </h2>
          <p className="text-xs text-slate-400">
            Click any subsystem node or visual hotspot to inspect real-time physics parameters, anomaly states, and predictive failure bounds.
          </p>
        </div>

        {/* Layer Filters & Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeLayer === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Systems
            </button>
            <button
              onClick={() => setActiveLayer('thermal')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeLayer === 'thermal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Thermal Flux
            </button>
            <button
              onClick={() => setActiveLayer('electrical')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeLayer === 'electrical' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Power Grid
            </button>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isRotating
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isRotating ? '● Orbit Drift' : '○ Locked'}
          </button>
        </div>
      </div>

      {/* Main Grid: Spacecraft Canvas on Left + Detailed Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Center Spacecraft Visualizer (7 or 8 columns) */}
        <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-800 bg-[#070a12] overflow-hidden relative min-h-[500px]">
          {/* Background Grid & Starfield */}
          <div className="absolute inset-0 bg-grid-aerospace opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-dot-aerospace opacity-20 pointer-events-none" />

          {/* Top HUD Telemetry Overlay */}
          <div className="absolute top-3 left-4 z-10 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
            <span>SUN BETA: <strong className="text-slate-200">+34.2°</strong></span>
            <span aria-hidden="true">·</span>
            <span>ECLIPSE IN: <strong className="text-slate-200">18m 42s</strong></span>
            <span aria-hidden="true">·</span>
            <span>ATTITUDE: <strong className="text-emerald-400">NADIR-POINTING</strong></span>
          </div>

          {/* Visual Canvas Area with SVG Spacecraft Model */}
          <div className="relative flex-1 flex items-center justify-center p-6">
            {/* Embedded Cinematic Background Image for Aerospace Realism */}
            <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none overflow-hidden">
              <img
                src={ASSETS.spacecraftHero}
                alt="ASTRA Spacecraft in Orbit"
                className="w-full h-full object-cover object-center filter saturate-150"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-[#070a12]" />
            </div>

            {/* Interactive Vector Spacecraft Diagram */}
            <div className={`relative z-10 w-full max-w-xl aspect-[16/10] transition-transform duration-1000 ${isRotating ? 'scale-[1.02]' : 'scale-100'}`}>
              <svg viewBox="0 0 800 500" className="w-full h-full filter drop-shadow-2xl">
                <defs>
                  {/* Solar Panel Cells Pattern */}
                  <pattern id="solarGrid" width="16" height="12" patternUnits="userSpaceOnUse">
                    <rect width="16" height="12" fill="#0d233a" stroke="#1e40af" strokeWidth="0.8" />
                    <line x1="0" y1="6" x2="16" y2="6" stroke="#38bdf8" strokeWidth="0.4" strokeOpacity="0.6" />
                  </pattern>

                  {/* Gold MLI Blanket Gradient */}
                  <linearGradient id="goldMli" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="80%" stopColor="#b45309" />
                  </linearGradient>

                  {/* High Gain Dish Gradient */}
                  <radialGradient id="dishGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="70%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#334155" />
                  </radialGradient>

                  {/* Anomaly Glow Filters */}
                  <filter id="glowRose" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Left Solar Array Wing */}
                <g className="cursor-pointer transition-opacity hover:opacity-90" onClick={() => setSelectedSubsystemId('solar')}>
                  {/* Array Boom */}
                  <line x1="160" y1="250" x2="310" y2="250" stroke="#64748b" strokeWidth="7" />
                  <circle cx="310" cy="250" r="8" fill="#94a3b8" />
                  {/* Array Panel 1 */}
                  <rect x="50" y="170" width="105" height="160" rx="3" fill="url(#solarGrid)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Array Panel 2 */}
                  <rect x="160" y="170" width="105" height="160" rx="3" fill="url(#solarGrid)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Solar Array Highlights */}
                  <line x1="50" y1="210" x2="265" y2="210" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="50" y1="290" x2="265" y2="290" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                </g>

                {/* Right Solar Array Wing */}
                <g className="cursor-pointer transition-opacity hover:opacity-90" onClick={() => setSelectedSubsystemId('solar')}>
                  {/* Array Boom */}
                  <line x1="490" y1="250" x2="640" y2="250" stroke="#64748b" strokeWidth="7" />
                  <circle cx="490" cy="250" r="8" fill="#94a3b8" />
                  {/* Array Panel 3 */}
                  <rect x="535" y="170" width="105" height="160" rx="3" fill="url(#solarGrid)" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Array Panel 4 */}
                  <rect x="645" y="170" width="105" height="160" rx="3" fill="url(#solarGrid)" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="535" y1="210" x2="750" y2="210" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="535" y1="290" x2="750" y2="290" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                </g>

                {/* Main Satellite Bus Body (Octagonal / Box Geometry) */}
                <g>
                  {/* Main Bus Shell */}
                  <rect
                    x="310"
                    y="150"
                    width="180"
                    height="200"
                    rx="14"
                    fill="url(#goldMli)"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    filter="drop-shadow(0 0 12px rgba(245,158,11,0.2))"
                  />

                  {/* Honeycomb Structural Bay lines */}
                  <rect x="325" y="165" width="150" height="80" rx="6" fill="#1e293b" fillOpacity="0.8" stroke="#475569" strokeWidth="1.2" />
                  <rect x="325" y="255" width="150" height="80" rx="6" fill="#0f172a" fillOpacity="0.9" stroke="#334155" strokeWidth="1.2" />

                  {/* Battery Bay Hot-zone (Lower Center) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedSubsystemId('battery')}
                  >
                    <rect
                      x="335"
                      y="265"
                      width="60"
                      height="60"
                      rx="4"
                      fill={selectedSubsystem.id === 'battery' && selectedSubsystem.status === 'CRITICAL' ? '#881337' : '#1e293b'}
                      stroke={selectedSubsystem.status === 'CRITICAL' ? '#f43f5e' : '#06b6d4'}
                      strokeWidth={selectedSubsystem.id === 'battery' ? 2.5 : 1.5}
                      className={selectedSubsystem.status === 'CRITICAL' ? 'animate-pulse' : ''}
                    />
                    {/* Battery cell lines */}
                    <line x1="347" y1="275" x2="347" y2="315" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="357" y1="275" x2="357" y2="315" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="367" y1="275" x2="367" y2="315" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="377" y1="275" x2="377" y2="315" stroke="#f43f5e" strokeWidth="2" />
                    <text x="365" y="260" textAnchor="middle" fill="#fda4af" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      BATTERY [!]
                    </text>
                  </g>

                  {/* Power PDU Module */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedSubsystemId('power')}
                  >
                    <rect
                      x="405"
                      y="265"
                      width="60"
                      height="60"
                      rx="4"
                      fill="#1e293b"
                      stroke="#38bdf8"
                      strokeWidth={selectedSubsystem.id === 'power' ? 2.5 : 1.5}
                    />
                    <path d="M435 275 L425 295 L445 295 L435 315" fill="none" stroke="#38bdf8" strokeWidth="2" />
                    <text x="435" y="260" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">
                      PDU BUS
                    </text>
                  </g>

                  {/* Avionics OBC Core */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedSubsystemId('avionics')}
                  >
                    <rect
                      x="335"
                      y="175"
                      width="60"
                      height="60"
                      rx="4"
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth={selectedSubsystem.id === 'avionics' ? 2.5 : 1.5}
                    />
                    <circle cx="365" cy="205" r="14" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                    <text x="365" y="208" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontFamily="monospace">
                      LEON4
                    </text>
                  </g>

                  {/* Thermal Louver Radiator */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedSubsystemId('thermal')}
                  >
                    <rect
                      x="405"
                      y="175"
                      width="60"
                      height="60"
                      rx="4"
                      fill="#1e293b"
                      stroke="#f59e0b"
                      strokeWidth={selectedSubsystem.id === 'thermal' ? 2.5 : 1.5}
                    />
                    {/* Louver slats */}
                    <line x1="412" y1="185" x2="458" y2="185" stroke="#f59e0b" strokeWidth="1.5" />
                    <line x1="412" y1="195" x2="458" y2="195" stroke="#f59e0b" strokeWidth="1.5" />
                    <line x1="412" y1="205" x2="458" y2="205" stroke="#f59e0b" strokeWidth="1.5" />
                    <line x1="412" y1="215" x2="458" y2="215" stroke="#f59e0b" strokeWidth="1.5" />
                    <line x1="412" y1="225" x2="458" y2="225" stroke="#f59e0b" strokeWidth="1.5" />
                  </g>

                  {/* High Gain Communication Parabolic Dish (Top) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedSubsystemId('communication')}
                  >
                    <path
                      d="M360 150 Q400 90 440 150 Z"
                      fill="url(#dishGrad)"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                    <line x1="400" y1="120" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="2.5" />
                    <circle cx="400" cy="78" r="4.5" fill="#06b6d4" />
                    {/* Pulsing Communication Microwave Radiation Arc */}
                    <path
                      d="M380 65 Q400 50 420 65"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                      className="animate-pulse"
                    />
                    <path
                      d="M370 52 Q400 35 430 52"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  </g>

                  {/* Propulsion Thruster Nozzles (Bottom) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setSelectedSubsystemId('propulsion')}
                  >
                    <path d="M380 350 L370 380 L395 380 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M420 350 L405 380 L430 380 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Animated thruster exhaust plume */}
                    <path
                      d="M372 382 Q382 410 393 382"
                      fill="#38bdf8"
                      fillOpacity="0.6"
                      className="animate-pulse"
                    />
                    <path
                      d="M407 382 Q417 410 428 382"
                      fill="#38bdf8"
                      fillOpacity="0.6"
                      className="animate-pulse"
                    />
                  </g>
                </g>

                {/* Subsystem Hotspot Markers with Real-time Status */}
                {subsystemHotspots.map((hs) => {
                  const sub = subsystems.find((s) => s.id === hs.id);
                  const isSelected = selectedSubsystem.id === hs.id;
                  const isCrit = sub?.status === 'CRITICAL';
                  const isWarn = sub?.status === 'WARNING';
                  const isDegr = sub?.status === 'DEGRADED';

                  const badgeBg = isCrit
                    ? '#f43f5e'
                    : isWarn
                    ? '#f59e0b'
                    : isDegr
                    ? '#f97316'
                    : '#10b981';

                  return (
                    <g
                      key={hs.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setSelectedSubsystemId(hs.id)}
                    >
                      {/* Pulsing ring if selected or critical */}
                      {(isSelected || isCrit) && (
                        <circle
                          cx={(hs.x / 100) * 800}
                          cy={(hs.y / 100) * 500}
                          r={isCrit ? 18 : 14}
                          fill="none"
                          stroke={badgeBg}
                          strokeWidth="1.5"
                          strokeDasharray="4,3"
                          className="animate-spin"
                        />
                      )}
                      <circle
                        cx={(hs.x / 100) * 800}
                        cy={(hs.y / 100) * 500}
                        r="8"
                        fill={badgeBg}
                        stroke="#0f172a"
                        strokeWidth="2"
                        filter="drop-shadow(0 0 6px rgba(0,0,0,0.8))"
                      />
                      <circle
                        cx={(hs.x / 100) * 800}
                        cy={(hs.y / 100) * 500}
                        r="3"
                        fill="#ffffff"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Subsystem Quick Switch Carousel on Bottom */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {subsystems.map((sub) => {
                const isSelected = selectedSubsystem.id === sub.id;
                const Icon = getSubsystemIcon(sub.id);
                const subStatus = getStatusBadge(sub.status);

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubsystemId(sub.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-slate-100 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{sub.name.split(' ')[0]}</span>
                    <span className={`w-2 h-2 rounded-full ${subStatus.dot}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Subsystem Inspector Drawer (4 or 5 columns) */}
        <div className="lg:col-span-4 flex flex-col rounded-xl border border-slate-800 bg-[#090d16] p-5 space-y-5">
          {/* Subsystem Card Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <SelectedIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  {selectedSubsystem.category}
                </div>
                <h3 className="text-base font-bold font-display text-slate-100">
                  {selectedSubsystem.name}
                </h3>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded border text-xs font-mono font-bold flex items-center gap-1.5 ${statusInfo.color}`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
              <span>{statusInfo.label}</span>
            </div>
          </div>

          {/* Subsystem Health & Risk Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">HEALTH SCORE</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-mono font-bold text-slate-100">{selectedSubsystem.health}</span>
                <span className="text-xs text-slate-400 font-mono">%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedSubsystem.health >= 85 ? 'bg-emerald-400' : selectedSubsystem.health >= 70 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${selectedSubsystem.health}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">FAILURE RISK</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-mono font-bold text-rose-400">{selectedSubsystem.riskScore}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                LEVEL: <span className="font-bold text-slate-200">{selectedSubsystem.riskLevel}</span>
              </div>
            </div>
          </div>

          {/* Primary Telemetry Readout */}
          <div className="space-y-2 p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{selectedSubsystem.primaryMetric}:</span>
              <span className="font-mono font-semibold text-slate-100">{selectedSubsystem.primaryValue}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{selectedSubsystem.secondaryMetric}:</span>
              <span className="font-mono font-semibold text-slate-100">{selectedSubsystem.secondaryValue}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Operating Temperature:</span>
              <span className="font-mono font-semibold text-slate-100">{selectedSubsystem.operatingTemp} °C</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Redundancy Architecture:</span>
              <span className="font-mono text-cyan-400">{selectedSubsystem.redundancyMode}</span>
            </div>
          </div>

          {/* Predicted Failure Window */}
          {selectedSubsystem.predictedTimeToFailureHours ? (
            <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PREDICTED FAILURE TIME: {selectedSubsystem.predictedTimeToFailureHours.min}–{selectedSubsystem.predictedTimeToFailureHours.max} HOURS</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Failure probability calculated at <strong>{selectedSubsystem.failureProbability}%</strong> if current thermal/voltage load profile continues unmitigated.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 font-mono">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No imminent critical failure predicted (&gt;1,200 hrs MTBF)</span>
            </div>
          )}

          {/* Contributing Risk Factors */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              AI RISK FACTOR WEIGHTS
            </div>
            <div className="space-y-1.5">
              {selectedSubsystem.contributingFactors.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="truncate">{factor.name}</span>
                    <span className="font-mono text-slate-400">{factor.weightPercent}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${factor.weightPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => onNavigateToAI(selectedSubsystem.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-100 border border-slate-700 transition-colors"
            >
              <span>Explain Why AI Raised This Alert</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {selectedSubsystem.id === 'battery' && selectedSubsystem.status === 'CRITICAL' && (
              <button
                onClick={onApplyMitigation}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Execute Recommended Action: Shed Loads</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
