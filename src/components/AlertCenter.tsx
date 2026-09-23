import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Eye,
  Check,
  RotateCcw,
  Search,
} from 'lucide-react';
import { MissionAlert, AlertSeverity } from '../types/mission';

interface AlertCenterProps {
  alerts: MissionAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onResolveAlert: (id: string) => void;
  onInvestigateAlert: (alert: MissionAlert) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  onInvestigateAlert,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'RESOLVED') return a.status === 'RESOLVED';
    if (filterSeverity === 'ACTIVE') return a.status !== 'RESOLVED';
    return a.severity === filterSeverity;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'ACKNOWLEDGED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'INVESTIGATING':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              OPERATIONAL FLIGHT ANNUNCIATOR
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              AUDITED LOGS
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Mission Alert & Fault Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time critical flight notifications with operator acknowledgment workflows.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-700/80 p-1 rounded-lg text-xs">
          {['ALL', 'ACTIVE', 'HIGH', 'WARNING', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterSeverity(tab)}
              className={`px-3 py-1 rounded transition-colors ${
                filterSeverity === tab ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.status === 'RESOLVED'
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                  : 'bg-[#070a12] border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${getStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {alert.timestamp} · ID: {alert.id}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">
                      {alert.title}
                    </h3>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => onInvestigateAlert(alert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Investigate</span>
                  </button>

                  {alert.status !== 'ACKNOWLEDGED' && alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Alert details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">PARAMETER READOUT</span>
                  <div className="font-mono text-slate-200">
                    Observed: <strong className="text-rose-400">{alert.currentValue}</strong> (Corridor: {alert.expectedRange})
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                    {alert.explanation}
                  </p>
                </div>

                <div className="space-y-1 p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">OPERATIONAL DIRECTIVE</span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {alert.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 rounded-xl border border-slate-800 bg-[#070a12] text-center text-slate-400 text-xs font-mono">
            No alerts matching current filter.
          </div>
        )}
      </div>
    </div>
  );
};
