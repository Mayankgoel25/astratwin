import React, { useState } from 'react';
import {
  Satellite,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  AlertTriangle,
  Radio,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { TelemetryFrame, ScenarioPreset } from '../types/mission';
import { Language, SUPPORTED_LANGUAGES, TranslationDictionary } from '../services/i18n';

interface HeaderProps {
  currentFrame: TelemetryFrame;
  activeScenario: ScenarioPreset;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenDemoTour: () => void;
  onResetMission: () => void;
  onOpenReportModal: () => void;
  audioAnnounceEnabled: boolean;
  onToggleAudioAnnounce: () => void;
  activeAlertsCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationDictionary;
}

export const Header: React.FC<HeaderProps> = ({
  currentFrame,
  activeScenario,
  activePage,
  onNavigate,
  onOpenDemoTour,
  onResetMission,
  onOpenReportModal,
  audioAnnounceEnabled,
  onToggleAudioAnnounce,
  activeAlertsCount,
  language,
  onLanguageChange,
  t,
}) => {
  const [satelliteSelectorOpen, setSatelliteSelectorOpen] = useState(false);
  const [langSelectorOpen, setLangSelectorOpen] = useState(false);

  const getStatusColor = () => {
    if (currentFrame.healthScore >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (currentFrame.healthScore >= 75) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/95 backdrop-blur-md">
      {/* Top 3-Zone Contract Navigation Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Zone 1: Single text element wordmark with icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Satellite className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-display tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
                ASTRA-TWIN
              </span>
            </div>
          </button>

          {/* Spacecraft Target Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setSatelliteSelectorOpen(!satelliteSelectorOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-slate-100 hover:border-slate-600 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SAT: ASTRA-01 (LEO)</span>
            </button>

            {satelliteSelectorOpen && (
              <div className="absolute left-0 mt-1 w-56 rounded-lg bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs">
                <div className="text-[11px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Available Constellation
                </div>
                <button
                  onClick={() => setSatelliteSelectorOpen(false)}
                  className="w-full text-left px-2 py-1.5 rounded bg-cyan-950/40 text-cyan-300 font-medium flex items-center justify-between"
                >
                  <span>ASTRA-01 [Primary Target]</span>
                  <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
                </button>
                <div className="w-full text-left px-2 py-1.5 rounded text-slate-500 font-mono text-[11px] flex items-center justify-between cursor-not-allowed">
                  <span>ASTRA-02 [Polar InSAR]</span>
                  <span className="text-[10px]">STANDBY</span>
                </div>
                <div className="w-full text-left px-2 py-1.5 rounded text-slate-500 font-mono text-[11px] flex items-center justify-between cursor-not-allowed">
                  <span>ASTRA-03 [Deep Relay]</span>
                  <span className="text-[10px]">SCHEDULED</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap ${
              activePage === 'dashboard' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            {t.navDashboard}
          </button>
          <button
            onClick={() => onNavigate('digital-twin')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap ${
              activePage === 'digital-twin' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            {t.navDigitalTwin}
          </button>
          <button
            onClick={() => onNavigate('telemetry')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap ${
              activePage === 'telemetry' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            {t.navTelemetry}
          </button>
          <button
            onClick={() => onNavigate('anomalies')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap ${
              activePage === 'anomalies' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            {t.navAnomalies}
          </button>
          <button
            onClick={() => onNavigate('explainable-ai')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap ${
              activePage === 'explainable-ai' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            {t.navExplainableAI}
          </button>
          <button
            onClick={() => onNavigate('what-if')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap ${
              activePage === 'what-if' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            {t.navWhatIf}
          </button>
          <button
            onClick={() => onNavigate('appointments')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap flex items-center gap-1.5 ${
              activePage === 'appointments' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            <span>{t.navBookings}</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">DB</span>
          </button>
          <button
            onClick={() => onNavigate('slides')}
            className={`transition-colors hover:text-slate-100 whitespace-nowrap ${
              activePage === 'slides' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            {t.navPitchDeck}
          </button>
        </nav>

        {/* Zone 3: Primary actions, Multi-Language & Telemetry Status Ribbon */}
        <div className="flex items-center gap-2">
          {/* Multi-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangSelectorOpen(!langSelectorOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 transition-colors shadow-sm"
              title="Select Language / भाषा चुनें / Choisir la langue / Sprache wählen"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-semibold">{currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langSelectorOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-slate-900 border border-slate-700/80 shadow-2xl p-1 z-50 text-xs backdrop-blur-md">
                <div className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-800">
                  {t.language}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangSelectorOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-colors text-left ${
                      language === lang.code
                        ? 'bg-cyan-950/70 text-cyan-300 font-semibold border border-cyan-800/60'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Health Pill */}
          <div
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono font-medium ${getStatusColor()}`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{t.health}: {currentFrame.healthScore}%</span>
            {activeAlertsCount > 0 && (
              <span className="flex items-center gap-1 text-rose-400">
                <AlertTriangle className="w-3 h-3" />
                {activeAlertsCount}
              </span>
            )}
          </div>

          {/* Audio Annunciator Voice Toggle */}
          <button
            onClick={onToggleAudioAnnounce}
            title={audioAnnounceEnabled ? t.audioAnnounceOn : t.audioAnnounceOff}
            className={`p-1.5 rounded-md border transition-colors ${
              audioAnnounceEnabled
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {audioAnnounceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Export Report Action */}
          <button
            onClick={onOpenReportModal}
            title="Export Mission Health Report"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-md hover:bg-slate-800 hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.report}</span>
          </button>

          {/* Reset Mission State */}
          <button
            onClick={onResetMission}
            title={t.resetTelemetry}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-md hover:bg-slate-800 hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.resetTelemetry.split(' ')[0]}</span>
          </button>

          {/* 10-Step Interactive Judge Demo Mode Action */}
          <button
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-md shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-teal-300 transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.liveTour}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
