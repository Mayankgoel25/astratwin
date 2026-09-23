import React, { useState } from 'react';
import {
  Activity,
  SlidersHorizontal,
  Maximize2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { TelemetryFrame, AnomalyRecord } from '../types/mission';

interface TelemetryChartsProps {
  history: TelemetryFrame[];
  currentFrame: TelemetryFrame;
  anomalies: AnomalyRecord[];
}

type TimeRange = '5M' | '30M' | '1H' | '6H' | '24H';

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({
  history,
  currentFrame,
  anomalies,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('5M');
  const [selectedChannel, setSelectedChannel] = useState<'voltage' | 'temp' | 'battery' | 'power' | 'signal'>('voltage');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Filter or scale history based on time range
  const displayHistory = history.slice(-40);

  // Channel configuration
  const channelConfigs = {
    voltage: {
      name: 'Battery Bus Voltage',
      unit: 'V',
      color: '#38bdf8', // sky
      min: 24.0,
      max: 30.0,
      baselineLow: 27.5,
      baselineHigh: 29.0,
      getter: (f: TelemetryFrame) => f.voltage,
    },
    temp: {
      name: 'Internal Core Temperature',
      unit: '°C',
      color: '#f59e0b', // amber
      min: 60.0,
      max: 95.0,
      baselineLow: 68.0,
      baselineHigh: 76.0,
      getter: (f: TelemetryFrame) => f.temperature,
    },
    battery: {
      name: 'Battery State of Charge (SoC)',
      unit: '%',
      color: '#10b981', // emerald
      min: 40.0,
      max: 100.0,
      baselineLow: 75.0,
      baselineHigh: 95.0,
      getter: (f: TelemetryFrame) => f.batteryPercent,
    },
    power: {
      name: 'Total Bus Power Draw',
      unit: 'kW',
      color: '#818cf8', // indigo
      min: 2.0,
      max: 6.5,
      baselineLow: 4.2,
      baselineHigh: 5.2,
      getter: (f: TelemetryFrame) => f.powerKw,
    },
    signal: {
      name: 'X-Band Downlink Signal Strength',
      unit: 'dBm',
      color: '#06b6d4', // cyan
      min: -120.0,
      max: -60.0,
      baselineLow: -85.0,
      baselineHigh: -72.0,
      getter: (f: TelemetryFrame) => f.signalStrengthDb,
    },
  };

  const activeConfig = channelConfigs[selectedChannel];

  // Helper to map values to SVG (x, y) coordinates
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const points = displayHistory.map((frame, index) => {
    const val = activeConfig.getter(frame);
    const x = padding.left + (index / Math.max(1, displayHistory.length - 1)) * graphWidth;
    const clampedVal = Math.max(activeConfig.min, Math.min(activeConfig.max, val));
    const y =
      padding.top +
      graphHeight -
      ((clampedVal - activeConfig.min) / (activeConfig.max - activeConfig.min)) * graphHeight;
    return { x, y, val, frame };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, curr, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`
    : '';

  // Baseline tolerance corridor coordinates
  const baselineTopY =
    padding.top +
    graphHeight -
    ((activeConfig.baselineHigh - activeConfig.min) / (activeConfig.max - activeConfig.min)) * graphHeight;
  const baselineBottomY =
    padding.top +
    graphHeight -
    ((activeConfig.baselineLow - activeConfig.min) / (activeConfig.max - activeConfig.min)) * graphHeight;

  // Active Anomaly markers for this channel
  const relevantAnomalies = anomalies.filter((a) => {
    if (selectedChannel === 'voltage' && a.parameter.toLowerCase().includes('voltage')) return true;
    if (selectedChannel === 'temp' && a.parameter.toLowerCase().includes('temp')) return true;
    if (selectedChannel === 'signal' && a.parameter.toLowerCase().includes('signal')) return true;
    return false;
  });

  const hoveredPoint = hoveredPointIndex !== null ? points[hoveredPointIndex] : null;

  return (
    <div className="space-y-4">
      {/* Chart Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-[#090d16]">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
            HIGH-PRECISION TELEMETRY STREAM
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <span>{activeConfig.name}</span>
            <span className="text-xs font-mono text-slate-400">[{activeConfig.unit}]</span>
          </h2>
        </div>

        {/* Channel Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 p-1 rounded-lg text-xs">
          <button
            onClick={() => setSelectedChannel('voltage')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedChannel === 'voltage' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Voltage (V)
          </button>
          <button
            onClick={() => setSelectedChannel('temp')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedChannel === 'temp' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Temperature (°C)
          </button>
          <button
            onClick={() => setSelectedChannel('battery')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedChannel === 'battery' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Battery SoC (%)
          </button>
          <button
            onClick={() => setSelectedChannel('power')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedChannel === 'power' ? 'bg-indigo-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Power (kW)
          </button>
          <button
            onClick={() => setSelectedChannel('signal')}
            className={`px-3 py-1.5 rounded transition-colors ${
              selectedChannel === 'signal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RF Signal (dBm)
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Canvas */}
      <div className="rounded-xl border border-slate-800 bg-[#070a12] p-4 relative overflow-hidden">
        {/* Top Chart Stats Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              CURRENT: <strong className="text-slate-100 font-semibold">{activeConfig.getter(currentFrame)} {activeConfig.unit}</strong>
            </span>
            <span>
              FLIGHT BASELINE: <strong className="text-cyan-400">{activeConfig.baselineLow} – {activeConfig.baselineHigh} {activeConfig.unit}</strong>
            </span>
            {relevantAnomalies.length > 0 && (
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ANOMALY FLAGGED ({relevantAnomalies[0].deviationPercent}% DEV)</span>
              </span>
            )}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/60 rounded px-1 py-0.5 text-[11px]">
            {(['5M', '30M', '1H', '6H', '24H'] as TimeRange[]).map((tr) => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timeRange === tr ? 'bg-slate-700 text-slate-100 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Time-Series Chart */}
        <div className="relative w-full aspect-[21/9] min-h-[300px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full select-none"
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeConfig.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={activeConfig.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + ratio * graphHeight;
              const val = (activeConfig.max - ratio * (activeConfig.max - activeConfig.min)).toFixed(1);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Nominal Baseline Envelope Corridor */}
            <rect
              x={padding.left}
              y={baselineTopY}
              width={graphWidth}
              height={Math.max(2, baselineBottomY - baselineTopY)}
              fill="#06b6d4"
              fillOpacity="0.06"
              stroke="#06b6d4"
              strokeOpacity="0.25"
              strokeDasharray="3,3"
            />
            <text
              x={svgWidth - padding.right - 6}
              y={baselineTopY - 4}
              textAnchor="end"
              fill="#06b6d4"
              fontSize="9"
              fontFamily="monospace"
            >
              UPPER TOLERANCE [{activeConfig.baselineHigh}]
            </text>
            <text
              x={svgWidth - padding.right - 6}
              y={baselineBottomY + 11}
              textAnchor="end"
              fill="#06b6d4"
              fontSize="9"
              fontFamily="monospace"
            >
              LOWER TOLERANCE [{activeConfig.baselineLow}]
            </text>

            {/* Telemetry Area Fill */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Telemetry Line Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke={activeConfig.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Anomaly Highlight Zone if Out-of-Bounds */}
            {points.map((pt, idx) => {
              const isAnomaly = pt.val < activeConfig.baselineLow || pt.val > activeConfig.baselineHigh;
              if (!isAnomaly) return null;
              return (
                <g key={`anom-${idx}`}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#f43f5e" fillOpacity="0.8" />
                  <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" />
                </g>
              );
            })}

            {/* Latest Live Point Pulse */}
            {points.length > 0 && (
              <g>
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r="5"
                  fill={activeConfig.color}
                />
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r="10"
                  fill="none"
                  stroke={activeConfig.color}
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              </g>
            )}

            {/* Interactive Hover Columns */}
            {points.map((pt, idx) => (
              <rect
                key={idx}
                x={pt.x - graphWidth / (points.length * 2)}
                y={padding.top}
                width={graphWidth / points.length}
                height={graphHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPointIndex(idx)}
              />
            ))}

            {/* Crosshair Cursor Indicator when Hovered */}
            {hoveredPoint && (
              <g>
                <line
                  x1={hoveredPoint.x}
                  y1={padding.top}
                  x2={hoveredPoint.x}
                  y2={padding.top + graphHeight}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="5"
                  fill="#ffffff"
                  stroke={activeConfig.color}
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          {/* Hover Floating Monospace HUD Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg bg-slate-900/95 border border-slate-700 shadow-2xl text-xs font-mono text-slate-100"
              style={{
                left: `${Math.min(80, Math.max(10, (hoveredPoint.x / svgWidth) * 100))}%`,
                top: '15px',
              }}
            >
              <div className="text-[10px] text-slate-400">TIME: {hoveredPoint.frame.timeFormatted} UTC</div>
              <div className="font-bold text-cyan-300">
                VALUE: {hoveredPoint.val} {activeConfig.unit}
              </div>
              <div className="text-[10px] text-slate-400">
                {hoveredPoint.val < activeConfig.baselineLow || hoveredPoint.val > activeConfig.baselineHigh ? (
                  <span className="text-rose-400 font-bold">OUT-OF-SPEC CORRIDOR</span>
                ) : (
                  <span className="text-emerald-400">NOMINAL IN-BOUNDS</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Multi-parameter Sub-telemetry Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">VOLTAGE STABILITY</span>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
              {currentFrame.voltage} V <span className="text-[10px] text-cyan-400">(±0.15)</span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">CORE TEMPERATURE</span>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
              {currentFrame.temperature} °C <span className="text-[10px] text-amber-400">NORMAL MAX: 76°C</span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">COMM CARRIER LATENCY</span>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
              {currentFrame.commLatencyMs} ms <span className="text-[10px] text-emerald-400">SVALBARD GS</span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">PAYLOAD POWER YIELD</span>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
              {currentFrame.solarOutputKw} kW <span className="text-[10px] text-indigo-400">GEN</span> / {currentFrame.powerKw} kW <span className="text-[10px] text-rose-400">LOAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
