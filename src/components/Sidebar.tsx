import React from 'react';
import {
  LayoutDashboard,
  Orbit,
  Activity,
  AlertOctagon,
  TrendingDown,
  HelpCircle,
  Bell,
  Sliders,
  Flame,
  Cpu,
  Clock,
  MessageSquare,
  BarChart3,
  Network,
  Settings,
  Compass,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeAlertsCount: number;
  anomaliesCount: number;
  t: TranslationDictionary;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  activeAlertsCount,
  anomaliesCount,
  t,
}) => {
  const navSections = [
    {
      group: t.groupTelemetryTwin,
      items: [
        { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard, badge: null, star: true },
        { id: 'digital-twin', label: t.navDigitalTwin, icon: Orbit, badge: null, star: true },
        { id: 'telemetry', label: t.navTelemetry, icon: Activity, badge: null },
        { id: 'subsystems', label: t.navSubsystems, icon: Cpu, badge: null },
      ],
    },
    {
      group: t.groupIntelligence,
      items: [
        {
          id: 'anomalies',
          label: t.navAnomalies,
          icon: AlertOctagon,
          badge: anomaliesCount > 0 ? anomaliesCount : null,
          badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
        },
        { id: 'failure-prediction', label: t.navFailurePrediction, icon: TrendingDown, badge: null, star: true },
        { id: 'explainable-ai', label: t.navExplainableAI, icon: HelpCircle, badge: null, star: true },
        {
          id: 'alerts',
          label: t.navAlertCenter,
          icon: Bell,
          badge: activeAlertsCount > 0 ? activeAlertsCount : null,
          badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
        },
      ],
    },
    {
      group: t.groupSimulationOps,
      items: [
        { id: 'what-if', label: t.navWhatIf, icon: Sliders, badge: 'WOW', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40', star: true },
        { id: 'scenarios', label: t.navScenarios, icon: Flame, badge: null },
        { id: 'timeline', label: t.navTimeline, icon: Clock, badge: null },
        { id: 'appointments', label: t.navBookings, icon: Calendar, badge: 'SUPABASE', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40', star: true },
        { id: 'assistant', label: t.aiCopilot, icon: MessageSquare, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' },
      ],
    },
    {
      group: t.groupAssuranceSystem,
      items: [
        { id: 'slides', label: t.navPitchDeck, icon: FileText, badge: '16', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40', star: true },
        { id: 'analytics', label: t.navAnalytics, icon: BarChart3, badge: null },
        { id: 'architecture', label: t.navArchitecture, icon: Network, badge: null },
        { id: 'landing', label: t.navProjectBrief, icon: Compass, badge: null },
        { id: 'settings', label: t.navSettings, icon: Settings, badge: null },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800/80 bg-[#080b12] transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Top Collapse Toggle */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-800/60">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              FLIGHT CONSOLE
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors mx-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                {section.group}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">
                      {item.label}
                      {item.star && <span className="ml-1 text-cyan-400/80">★</span>}
                    </span>
                  )}
                  {!collapsed && item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Mission Elapsed Time Box */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-950/40">
        {!collapsed ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>MET:</span>
              <span className="text-slate-200 font-semibold">T+142:18:42</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>ORBIT:</span>
              <span className="text-cyan-400">#1,429 (LEO)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>DIGITAL TWIN SYNCED</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Telemetry Synchronized" />
          </div>
        )}
      </div>
    </aside>
  );
};
