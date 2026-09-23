import React from 'react';
import {
  Clock,
  Cpu,
  Brain,
  User,
  Radio,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { MissionTimelineEvent } from '../types/mission';

interface EventTimelineViewProps {
  events: MissionTimelineEvent[];
}

export const EventTimelineView: React.FC<EventTimelineViewProps> = ({ events }) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'AI_ENGINE':
        return Brain;
      case 'OPERATOR':
        return User;
      case 'GROUND_TELECOMM':
        return Radio;
      default:
        return Cpu;
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
      case 'HIGH':
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      case 'WARNING':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      default:
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              TEMPORAL TELEMETRY LOGS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              AUDIT TRAIL
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Mission Flight Event Timeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological log of flight software triggers, AI anomaly predictions, and operator mitigation commands.
          </p>
        </div>
      </div>

      {/* Timeline Sequence */}
      <div className="rounded-xl border border-slate-800 bg-[#070a12] p-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
          {events.map((evt) => {
            const Icon = getSourceIcon(evt.source);
            const sevColor = getSeverityColor(evt.severity);

            return (
              <div key={evt.id} className="relative flex items-start gap-4 pl-10">
                {/* Node Dot */}
                <div className={`absolute left-3 -translate-x-1/2 w-5 h-5 rounded-full border flex items-center justify-center ${sevColor}`}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>

                <div className="flex-1 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${sevColor}`}>
                        {evt.source}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {evt.timeFormatted}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      ID: {evt.id} · SUB: {evt.subsystem}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {evt.details}
                  </p>

                  {evt.actionTaken && (
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{evt.actionTaken}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
