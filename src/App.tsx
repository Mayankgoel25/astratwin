import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MissionDashboard } from './components/MissionDashboard';
import { DigitalTwinViewer } from './components/DigitalTwinViewer';
import { TelemetryCharts } from './components/TelemetryCharts';
import { AnomalyDetectionView } from './components/AnomalyDetectionView';
import { FailurePredictionView } from './components/FailurePredictionView';
import { ExplainableAIPanel } from './components/ExplainableAIPanel';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AlertCenter } from './components/AlertCenter';
import { SubsystemsView } from './components/SubsystemsView';
import { EventTimelineView } from './components/EventTimelineView';
import { AnalyticsView } from './components/AnalyticsView';
import { ArchitectureView } from './components/ArchitectureView';
import { SettingsAdminView } from './components/SettingsAdminView';
import { PresentationSlidesView } from './components/PresentationSlidesView';
import { BookingAppointmentView } from './components/BookingAppointmentView';
import { LandingPage } from './components/LandingPage';
import { AIAssistantModal } from './components/AIAssistantModal';
import { DemoTourOverlay } from './components/DemoTourOverlay';
import { MissionReportModal } from './components/MissionReportModal';
import { telemetryEngine } from './services/telemetryEngine';
import { Language, translations } from './services/i18n';
import {
  TelemetryFrame,
  SubsystemDetail,
  AnomalyRecord,
  FailurePrediction,
  ExplainableEvidence,
  MissionAlert,
  MissionTimelineEvent,
  ScenarioPreset,
  SubsystemId,
} from './types/mission';
import { MessageSquare, Sparkles } from 'lucide-react';

export function App() {
  // Localization State (en, fr, hi, de)
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  // Navigation State
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Modals & Overlays
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [showDemoTour, setShowDemoTour] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [audioAnnounceEnabled, setAudioAnnounceEnabled] = useState<boolean>(false);

  // Live Telemetry Engine State
  const [currentFrame, setCurrentFrame] = useState<TelemetryFrame>(() => telemetryEngine.getLatestFrame());
  const [history, setHistory] = useState<TelemetryFrame[]>(() => telemetryEngine.getHistory());
  const [subsystems, setSubsystems] = useState<SubsystemDetail[]>(() => telemetryEngine.getSubsystems());
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(() => telemetryEngine.getAnomalies());
  const [predictions, setPredictions] = useState<FailurePrediction[]>(() => telemetryEngine.getFailurePredictions());
  const [evidence, setEvidence] = useState<ExplainableEvidence>(() => telemetryEngine.getExplainableEvidence());
  const [alerts, setAlerts] = useState<MissionAlert[]>(() => telemetryEngine.getAlerts());
  const [timelineEvents, setTimelineEvents] = useState<MissionTimelineEvent[]>(() => telemetryEngine.getTimelineEvents());
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset>(() => telemetryEngine.getScenario());
  const [isMitigated, setIsMitigated] = useState<boolean>(() => telemetryEngine.isMitigationActive());

  // Subscribe to real-time telemetry updates (every 1.5s)
  useEffect(() => {
    const unsubscribe = telemetryEngine.subscribe(() => {
      setCurrentFrame(telemetryEngine.getLatestFrame());
      setHistory(telemetryEngine.getHistory());
      setSubsystems(telemetryEngine.getSubsystems());
      setAnomalies(telemetryEngine.getAnomalies());
      setPredictions(telemetryEngine.getFailurePredictions());
      setEvidence(telemetryEngine.getExplainableEvidence());
      setAlerts(telemetryEngine.getAlerts());
      setTimelineEvents(telemetryEngine.getTimelineEvents());
      setActiveScenario(telemetryEngine.getScenario());
      setIsMitigated(telemetryEngine.isMitigationActive());
    });

    return () => unsubscribe();
  }, []);

  // Handlers
  const handleSelectScenario = (sc: ScenarioPreset) => {
    telemetryEngine.setScenario(sc);
    setActiveScenario(sc);
  };

  const handleApplyMitigation = () => {
    telemetryEngine.applyMitigation();
    setIsMitigated(true);
  };

  const handleResetMission = () => {
    telemetryEngine.resetMission();
    setActiveScenario('NORMAL_MISSION');
    setIsMitigated(false);
  };

  const handleAcknowledgeAlert = (id: string) => {
    telemetryEngine.acknowledgeAlert(id);
    setAlerts(telemetryEngine.getAlerts());
  };

  const handleResolveAlert = (id: string) => {
    telemetryEngine.resolveAlert(id);
    setAlerts(telemetryEngine.getAlerts());
  };

  const handleInvestigateAlert = (alert: MissionAlert) => {
    setActivePage('explainable-ai');
  };

  const activeAlertsCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top 3-Zone Header Contract */}
      <Header
        currentFrame={currentFrame}
        activeScenario={activeScenario}
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onOpenDemoTour={() => setShowDemoTour(true)}
        onResetMission={handleResetMission}
        onOpenReportModal={() => setShowReportModal(true)}
        audioAnnounceEnabled={audioAnnounceEnabled}
        onToggleAudioAnnounce={() => setAudioAnnounceEnabled(!audioAnnounceEnabled)}
        activeAlertsCount={activeAlertsCount}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
      />

      {/* Main Workspace: Responsive Aerospace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Flight Console Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeAlertsCount={activeAlertsCount}
          anomaliesCount={anomalies.length}
          t={t}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#05070c]">
          <div className="max-w-7xl mx-auto space-y-6">
            {activePage === 'landing' && (
              <LandingPage
                onLaunchMissionControl={() => setActivePage('dashboard')}
                onExploreDigitalTwin={() => setActivePage('digital-twin')}
                onStartJudgeDemo={() => setShowDemoTour(true)}
                onOpenSlides={() => setActivePage('slides')}
              />
            )}

            {activePage === 'dashboard' && (
              <MissionDashboard
                currentFrame={currentFrame}
                subsystems={subsystems}
                anomalies={anomalies}
                predictions={predictions}
                alerts={alerts}
                activeScenario={activeScenario}
                onNavigate={(page) => setActivePage(page)}
                onSelectScenario={handleSelectScenario}
              />
            )}

            {activePage === 'digital-twin' && (
              <DigitalTwinViewer
                subsystems={subsystems}
                currentFrame={currentFrame}
                onNavigateToAI={() => setActivePage('explainable-ai')}
                onApplyMitigation={handleApplyMitigation}
                isMitigated={isMitigated}
              />
            )}

            {activePage === 'telemetry' && (
              <TelemetryCharts
                history={history}
                currentFrame={currentFrame}
                anomalies={anomalies}
              />
            )}

            {activePage === 'anomalies' && (
              <AnomalyDetectionView
                anomalies={anomalies}
                onNavigateToExplainableAI={() => setActivePage('explainable-ai')}
                onNavigateToDigitalTwin={() => setActivePage('digital-twin')}
              />
            )}

            {activePage === 'failure-prediction' && (
              <FailurePredictionView
                predictions={predictions}
                subsystems={subsystems}
                onOpenExplainableAI={() => setActivePage('explainable-ai')}
                onOpenWhatIf={() => setActivePage('what-if')}
              />
            )}

            {activePage === 'explainable-ai' && (
              <ExplainableAIPanel
                evidence={evidence}
                onApplyMitigation={handleApplyMitigation}
                isMitigated={isMitigated}
                onOpenWhatIf={() => setActivePage('what-if')}
              />
            )}

            {activePage === 'what-if' && <WhatIfSimulator />}

            {activePage === 'scenarios' && (
              <ScenarioSimulator
                activeScenario={activeScenario}
                onSelectScenario={handleSelectScenario}
                onResetMission={handleResetMission}
              />
            )}

            {activePage === 'alerts' && (
              <AlertCenter
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onResolveAlert={handleResolveAlert}
                onInvestigateAlert={handleInvestigateAlert}
              />
            )}

            {activePage === 'subsystems' && (
              <SubsystemsView
                subsystems={subsystems}
                onSelectSubsystem={() => setActivePage('digital-twin')}
                onNavigateToDigitalTwin={() => setActivePage('digital-twin')}
              />
            )}

            {activePage === 'timeline' && (
              <EventTimelineView events={timelineEvents} />
            )}

            {activePage === 'analytics' && (
              <AnalyticsView
                currentFrame={currentFrame}
                subsystems={subsystems}
                history={history}
              />
            )}

            {activePage === 'architecture' && <ArchitectureView />}

            {activePage === 'appointments' && <BookingAppointmentView t={t} />}

            {activePage === 'slides' && (
              <PresentationSlidesView
                onNavigateToDemo={() => setShowDemoTour(true)}
                onLaunchMissionControl={() => setActivePage('dashboard')}
              />
            )}

            {activePage === 'settings' && (
              <SettingsAdminView
                currentFrame={currentFrame}
                subsystems={subsystems}
                activeScenario={activeScenario}
                onResetMission={handleResetMission}
                audioAnnounceEnabled={audioAnnounceEnabled}
                onToggleAudioAnnounce={() => setAudioAnnounceEnabled(!audioAnnounceEnabled)}
                language={language}
                onLanguageChange={setLanguage}
                t={t}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button: AI Copilot */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 font-semibold text-xs shadow-2xl shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-purple-400/40"
      >
        <MessageSquare className="w-4 h-4 text-purple-200" />
        <span>{t.askCopilot}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistantModal
          currentFrame={currentFrame}
          subsystems={subsystems}
          onClose={() => setShowAIAssistant(false)}
          audioAnnounceEnabled={audioAnnounceEnabled}
          onToggleAudioAnnounce={() => setAudioAnnounceEnabled(!audioAnnounceEnabled)}
          language={language}
          onLanguageChange={setLanguage}
          t={t}
        />
      )}

      {/* 10-Phase Hackathon Judge Walkthrough Overlay */}
      {showDemoTour && (
        <DemoTourOverlay
          onClose={() => setShowDemoTour(false)}
          onNavigate={(page) => setActivePage(page)}
          onSetScenario={handleSelectScenario}
          onApplyMitigation={handleApplyMitigation}
          onResetMission={handleResetMission}
        />
      )}

      {/* Printable Mission Health Report Modal */}
      {showReportModal && (
        <MissionReportModal
          currentFrame={currentFrame}
          subsystems={subsystems}
          predictions={predictions}
          anomalies={anomalies}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

export default App;
