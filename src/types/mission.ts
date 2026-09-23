export type SubsystemId =
  | 'power'
  | 'battery'
  | 'solar'
  | 'thermal'
  | 'propulsion'
  | 'communication'
  | 'avionics'
  | 'attitude'
  | 'payload'
  | 'fuel';

export type HealthStatus = 'NOMINAL' | 'WARNING' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE';
export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'NEW' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface TelemetryFrame {
  timestamp: number;
  timeFormatted: string;
  // Core metrics
  temperature: number; // °C
  voltage: number; // V
  current: number; // A
  batteryPercent: number; // %
  fuelPercent: number; // %
  pressure: number; // kPa
  signalStrengthDb: number; // dBm
  commLatencyMs: number; // ms
  powerKw: number; // kW
  solarOutputKw: number; // kW
  radiationRad: number; // rad/h
  cpuPercent: number; // %
  memoryPercent: number; // %
  thrusterPressureBar: number; // bar
  attitudeErrorDeg: number; // deg
  gyroRateDps: number; // deg/s
  // Composite score calculated dynamically
  healthScore: number;
}

export interface SubsystemDetail {
  id: SubsystemId;
  name: string;
  category: string;
  health: number; // 0-100
  status: HealthStatus;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  primaryMetric: string;
  primaryValue: string;
  secondaryMetric: string;
  secondaryValue: string;
  operatingTemp: number; // °C
  powerDrawKw: number;
  redundancyMode: 'ACTIVE-HOT' | 'WARM-STANDBY' | 'SIMPLEX';
  description: string;
  activeAnomaliesCount: number;
  failureProbability: number; // 0-100
  predictedTimeToFailureHours?: { min: number; max: number };
  contributingFactors: { name: string; weightPercent: number }[];
  recommendedAction: string;
}

export interface AnomalyRecord {
  id: string;
  timestamp: string;
  subsystemId: SubsystemId;
  subsystemName: string;
  parameter: string;
  currentValue: string;
  nominalRange: string;
  baselineMin: number;
  baselineMax: number;
  deviationPercent: number;
  anomalyScore: number; // 0.0 - 1.0
  zScore: number;
  severity: AlertSeverity;
  status: 'ACTIVE' | 'RESOLVED';
  detectorType: 'RULE_BASED' | 'STATISTICAL_Z' | 'NEURAL_AUTOENCODER' | 'HYBRID';
  explanation: {
    whatHappened: string;
    whyAbnormal: string;
    possibleCause: string;
    impact: string;
    recommendedAction: string;
  };
}

export interface FailurePrediction {
  id: string;
  subsystemId: SubsystemId;
  subsystemName: string;
  title: string;
  riskLevel: RiskLevel;
  failureProbability: number; // %
  confidence: number; // %
  estimatedTimeToFailure: string; // e.g. "18–26 hours"
  modelType: 'RANDOM_FOREST' | 'TEMPORAL_TRANSFORMER' | 'MARKOV_RELIABILITY' | 'HYBRID_DIGITAL_TWIN';
  contributingFactors: {
    factor: string;
    weightPercent: number;
    trend: 'RISING' | 'FALLING' | 'OSCILLATING';
  }[];
  consequenceSummary: string;
  mitigationProtocol: string;
}

export interface ExplainableEvidence {
  anomalyId: string;
  subsystem: string;
  predictionTitle: string;
  confidenceScore: number;
  reasoningSteps: {
    stage: 'OBSERVATION' | 'EVIDENCE' | 'ANALYSIS' | 'RISK' | 'RECOMMENDATION';
    title: string;
    detail: string;
    metricDetail?: string;
  }[];
  evidenceWeights: {
    factor: string;
    percentage: number;
    benchmark: string;
  }[];
  attributionType: 'SHAP_VALUE_DECOMPOSITION' | 'PHYSICS_BOUND_VIOLATION' | 'STATISTICAL_CONFIDENCE';
}

export interface MissionAlert {
  id: string;
  timestamp: string;
  subsystem: string;
  subsystemId: SubsystemId;
  title: string;
  parameter: string;
  currentValue: string;
  expectedRange: string;
  severity: AlertSeverity;
  status: AlertStatus;
  explanation: string;
  recommendedAction: string;
}

export interface MissionTimelineEvent {
  id: string;
  timeFormatted: string;
  timestamp: number;
  title: string;
  subsystem: SubsystemId;
  severity: AlertSeverity;
  source: 'FLIGHT_COMPUTER' | 'AI_ENGINE' | 'OPERATOR' | 'GROUND_TELECOMM';
  details: string;
  actionTaken?: string;
}

export interface WhatIfParams {
  tempDeltaPercent: number; // e.g. -20% to +50%
  powerConsumptionDeltaPercent: number;
  solarGenerationDeltaPercent: number;
  fuelConsumptionDeltaPercent: number;
  commLoadDeltaPercent: number;
}

export interface WhatIfImpact {
  baselineBatteryPercent: number;
  simulatedBatteryPercent: number;
  baselineTemp: number;
  simulatedTemp: number;
  baselineHealth: number;
  simulatedHealth: number;
  baselineRisk: RiskLevel;
  simulatedRisk: RiskLevel;
  primaryRiskSummary: string;
  marginViolationRisk: boolean;
  powerDeficitKw: number;
}

export type ScenarioPreset =
  | 'NORMAL_MISSION'
  | 'THERMAL_FAILURE'
  | 'BATTERY_DEGRADATION'
  | 'COMMUNICATION_LOSS'
  | 'FUEL_LEAK'
  | 'SENSOR_DRIFT'
  | 'SOLAR_PANEL_DEGRADATION'
  | 'MULTI_SUBSYSTEM_FAILURE';

export interface DemoStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  durationSeconds: number;
  narrative: string;
  targetPage: string;
  systemActionDescription: string;
  highlightedElementSelector?: string;
}
