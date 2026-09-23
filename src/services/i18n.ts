export type Language = 'en' | 'fr' | 'hi' | 'de';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export interface TranslationDictionary {
  // Common / Top Bar
  systemName: string;
  systemTagline: string;
  health: string;
  audioAnnounceOn: string;
  audioAnnounceOff: string;
  report: string;
  liveTour: string;
  resetTelemetry: string;
  aiCopilot: string;
  askCopilot: string;
  language: string;

  // Navigation Items
  navDashboard: string;
  navDigitalTwin: string;
  navTelemetry: string;
  navSubsystems: string;
  navAnomalies: string;
  navFailurePrediction: string;
  navExplainableAI: string;
  navAlertCenter: string;
  navWhatIf: string;
  navScenarios: string;
  navTimeline: string;
  navPitchDeck: string;
  navAnalytics: string;
  navArchitecture: string;
  navProjectBrief: string;
  navSettings: string;
  navBookings: string;

  // Sidebar Groups
  groupTelemetryTwin: string;
  groupIntelligence: string;
  groupSimulationOps: string;
  groupAssuranceSystem: string;

  // Quick Stats / Badges
  subsystemsNominal: string;
  predictedDegradation: string;
  anomaliesDetected: string;
  timeToFailure: string;
  mitigationStatus: string;
  activeScenario: string;
  normalBaseline: string;

  // Buttons & Actions
  simulateScenario: string;
  applyMitigation: string;
  exportData: string;
  close: string;
  refresh: string;
  learnMore: string;
  backToTop: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    systemName: 'ASTRA-TWIN',
    systemTagline: 'Spacecraft Digital Twin & Predictive Health',
    health: 'HEALTH',
    audioAnnounceOn: 'Voice Annunciator Active',
    audioAnnounceOff: 'Voice Annunciator Muted',
    report: 'Report',
    liveTour: 'Live Demo Tour',
    resetTelemetry: 'Reset Baseline',
    aiCopilot: 'AI Copilot',
    askCopilot: 'Ask AI Copilot',
    language: 'Language',

    navDashboard: 'Mission Control',
    navDigitalTwin: '3D Digital Twin',
    navTelemetry: 'Telemetry Charts',
    navSubsystems: 'Subsystems Matrix',
    navAnomalies: 'Anomaly Detection',
    navFailurePrediction: 'Failure Prediction',
    navExplainableAI: 'Explainable AI',
    navAlertCenter: 'Alert Center',
    navWhatIf: 'What-If Simulator',
    navScenarios: 'Failure Scenarios',
    navTimeline: 'Event Timeline',
    navPitchDeck: 'Pitch Deck (Slides)',
    navAnalytics: 'Analytics',
    navArchitecture: 'Architecture',
    navProjectBrief: 'Project Brief',
    navSettings: 'Settings & Admin',
    navBookings: 'Book Appointment',

    groupTelemetryTwin: 'TELEMETRY & TWIN',
    groupIntelligence: 'INTELLIGENCE & AI',
    groupSimulationOps: 'SIMULATION & FLIGHT OPS',
    groupAssuranceSystem: 'ASSURANCE & SYSTEM',

    subsystemsNominal: 'Subsystems Nominal',
    predictedDegradation: 'Predicted Degradation',
    anomaliesDetected: 'Active Anomalies',
    timeToFailure: 'Est. Time to Failure',
    mitigationStatus: 'Mitigation State',
    activeScenario: 'Current Scenario',
    normalBaseline: 'Nominal Orbit Baseline',

    simulateScenario: 'Simulate Scenario',
    applyMitigation: 'Execute Mitigation Plan',
    exportData: 'Export Telemetry',
    close: 'Close',
    refresh: 'Refresh',
    learnMore: 'Learn More',
    backToTop: 'Back to Top',
  },

  fr: {
    systemName: 'ASTRA-TWIN',
    systemTagline: 'Jumeau Numérique Spatial & Santé Prédictive',
    health: 'SANTÉ',
    audioAnnounceOn: 'Annonciateur Vocal Actif',
    audioAnnounceOff: 'Annonciateur Vocal Muet',
    report: 'Rapport',
    liveTour: 'Démonstration Guidée',
    resetTelemetry: 'Réinitialiser',
    aiCopilot: 'Copilote IA',
    askCopilot: 'Consulter l\'IA',
    language: 'Langue',

    navDashboard: 'Centre de Contrôle',
    navDigitalTwin: 'Jumeau Numérique 3D',
    navTelemetry: 'Graphiques Télémétrie',
    navSubsystems: 'Matrice des Sous-systèmes',
    navAnomalies: 'Détection d\'Anomalies',
    navFailurePrediction: 'Prédiction de Défaillance',
    navExplainableAI: 'IA Explicable (XAI)',
    navAlertCenter: 'Centre d\'Alertes',
    navWhatIf: 'Simulateur "Et Si"',
    navScenarios: 'Scénarios de Panne',
    navTimeline: 'Chronologie des Événements',
    navPitchDeck: 'Présentation (Diapositives)',
    navAnalytics: 'Analytique & Tendances',
    navArchitecture: 'Architecture Système',
    navProjectBrief: 'Présentation Projet',
    navSettings: 'Paramètres & Admin',
    navBookings: 'Prendre Rendez-vous',

    groupTelemetryTwin: 'TÉLÉMÉTRIE & JUMEAU',
    groupIntelligence: 'INTELLIGENCE & IA',
    groupSimulationOps: 'SIMULATION & OPÉRATIONS',
    groupAssuranceSystem: 'ASSURANCE & SYSTÈME',

    subsystemsNominal: 'Sous-systèmes Nominaux',
    predictedDegradation: 'Dégradation Prédite',
    anomaliesDetected: 'Anomalies Actives',
    timeToFailure: 'Délai Avant Panne Estimé',
    mitigationStatus: 'Statut d\'Atténuation',
    activeScenario: 'Scénario en Cours',
    normalBaseline: 'Orbite Nominale de Référence',

    simulateScenario: 'Simuler le Scénario',
    applyMitigation: 'Appliquer Plan d\'Atténuation',
    exportData: 'Exporter Télémétrie',
    close: 'Fermer',
    refresh: 'Actualiser',
    learnMore: 'En Savoir Plus',
    backToTop: 'Retour en Haut',
  },

  hi: {
    systemName: 'एस्ट्रा-ट्विन (ASTRA-TWIN)',
    systemTagline: 'अंतरिक्ष यान डिजिटल ट्विन और भविष्यसूचक स्वास्थ्य',
    health: 'स्वास्थ्य',
    audioAnnounceOn: 'वॉयस उद्घोषक सक्रिय',
    audioAnnounceOff: 'वॉयस उद्घोषक बंद',
    report: 'रिपोर्ट',
    liveTour: 'लाइव डेमो टूर',
    resetTelemetry: 'रीसेट करें',
    aiCopilot: 'एआई कोपायलट',
    askCopilot: 'एआई से पूछें',
    language: 'भाषा',

    navDashboard: 'मिशन नियंत्रण',
    navDigitalTwin: '3डी डिजिटल ट्विन',
    navTelemetry: 'टेलीमेट्री चार्ट',
    navSubsystems: 'उपप्रणाली मैट्रिक्स',
    navAnomalies: 'विसंगति पहचान',
    navFailurePrediction: 'विफलता भविष्यवाणी',
    navExplainableAI: 'व्याख्यात्मक एआई (XAI)',
    navAlertCenter: 'चेतावनी केंद्र',
    navWhatIf: 'व्हाट-इफ सिम्युलेटर',
    navScenarios: 'विफलता परिदृश्य',
    navTimeline: 'घटना समयरेखा',
    navPitchDeck: 'पिच डेक (स्लाइड्स)',
    navAnalytics: 'एनालिटिक्स',
    navArchitecture: 'आर्किटेक्चर',
    navProjectBrief: 'प्रोजेक्ट विवरण',
    navSettings: 'सेटिंग्स व एडमिन',
    navBookings: 'अपॉइंटमेंट बुक करें',

    groupTelemetryTwin: 'टेलीमेट्री और डिजिटल ट्विन',
    groupIntelligence: 'इंटेलिजेंस व एआई',
    groupSimulationOps: 'सिमुलेशन और उड़ान संचालन',
    groupAssuranceSystem: 'आश्वासन और सिस्टम',

    subsystemsNominal: 'सामान्य उपप्रणालियाँ',
    predictedDegradation: 'अनुमानित क्षरण',
    anomaliesDetected: 'सक्रिय विसंगतियां',
    timeToFailure: 'विफलता तक अनुमानित समय',
    mitigationStatus: 'निवारण स्थिति',
    activeScenario: 'वर्तमान परिदृश्य',
    normalBaseline: 'सामान्य कक्षीय बेसलाइन',

    simulateScenario: 'परिदृश्य चलाएं',
    applyMitigation: 'निवारक योजना लागू करें',
    exportData: 'डेटा निर्यात करें',
    close: 'बंद करें',
    refresh: 'ताज़ा करें',
    learnMore: 'अधिक जानें',
    backToTop: 'ऊपर जाएं',
  },

  de: {
    systemName: 'ASTRA-TWIN',
    systemTagline: 'Raumfahrzeug-Digital-Twin & Prädiktive Systemgesundheit',
    health: 'STATUS',
    audioAnnounceOn: 'Sprachausgabe Aktiv',
    audioAnnounceOff: 'Sprachausgabe Stumm',
    report: 'Missionsbericht',
    liveTour: 'Geführte Demo-Tour',
    resetTelemetry: 'Zurücksetzen',
    aiCopilot: 'KI-Copilot',
    askCopilot: 'KI-Copilot Befragen',
    language: 'Sprache',

    navDashboard: 'Missionskontrollzentrum',
    navDigitalTwin: '3D Digitaler Zwilling',
    navTelemetry: 'Telemetrie-Diagramme',
    navSubsystems: 'Subsystem-Matrix',
    navAnomalies: 'Anomalieerkennung',
    navFailurePrediction: 'Ausfallprognose',
    navExplainableAI: 'Erklärbare KI (XAI)',
    navAlertCenter: 'Alarmzentrale',
    navWhatIf: 'Was-Wäre-Wenn Simulator',
    navScenarios: 'Fehlerszenarien',
    navTimeline: 'Ereignis-Chronologie',
    navPitchDeck: 'Präsentation (Folien)',
    navAnalytics: 'Analytik & Trends',
    navArchitecture: 'Systemarchitektur',
    navProjectBrief: 'Projektübersicht',
    navSettings: 'Einstellungen & Admin',
    navBookings: 'Termin Buchen',

    groupTelemetryTwin: 'TELEMETRIE & ZWILLING',
    groupIntelligence: 'INTELLIGENZ & KI',
    groupSimulationOps: 'SIMULATION & FLUGOPERATIONEN',
    groupAssuranceSystem: 'ASSURANCE & SYSTEM',

    subsystemsNominal: 'Nominale Subsysteme',
    predictedDegradation: 'Prognostizierte Degradation',
    anomaliesDetected: 'Aktive Anomalien',
    timeToFailure: 'Geschätzte Zeit bis Ausfall',
    mitigationStatus: 'Gegenmaßnahmen-Status',
    activeScenario: 'Aktuelles Szenario',
    normalBaseline: 'Nominaler Orbit-Referenzzustand',

    simulateScenario: 'Szenario Simulieren',
    applyMitigation: 'Gegenmaßnahmen Ausführen',
    exportData: 'Telemetrie Exportieren',
    close: 'Schließen',
    refresh: 'Aktualisieren',
    learnMore: 'Mehr Erfahren',
    backToTop: 'Nach Oben',
  },
};
