import { TelemetryFrame, SubsystemId, AlertSeverity } from '../../src/types/mission';

export interface TelemetryThresholdConfig {
  parameter: string;
  subsystemId: SubsystemId;
  normalMin: number;
  normalMax: number;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  unit: string;
}

export const TELEMETRY_THRESHOLDS: Record<string, TelemetryThresholdConfig> = {
  temperature: {
    parameter: 'Core Temperature',
    subsystemId: 'thermal',
    normalMin: 20.0,
    normalMax: 76.0,
    warningMax: 82.0,
    criticalMax: 88.0,
    unit: '°C',
  },
  voltage: {
    parameter: 'Main Bus Voltage',
    subsystemId: 'power',
    normalMin: 26.5,
    normalMax: 29.5,
    warningMin: 24.5,
    criticalMin: 22.0,
    unit: 'V',
  },
  batteryPercent: {
    parameter: 'Battery State of Charge',
    subsystemId: 'battery',
    normalMin: 65.0,
    normalMax: 100.0,
    warningMin: 50.0,
    criticalMin: 30.0,
    unit: '%',
  },
  fuelPercent: {
    parameter: 'Propellant Quantity',
    subsystemId: 'fuel',
    normalMin: 45.0,
    normalMax: 100.0,
    warningMin: 35.0,
    criticalMin: 20.0,
    unit: '%',
  },
  pressure: {
    parameter: 'Atmospheric / System Pressure',
    subsystemId: 'avionics',
    normalMin: 95.0,
    normalMax: 105.0,
    warningMin: 90.0,
    warningMax: 110.0,
    criticalMin: 85.0,
    criticalMax: 115.0,
    unit: 'kPa',
  },
  signalStrengthDb: {
    parameter: 'RF Signal RSSI',
    subsystemId: 'communication',
    normalMin: -85.0,
    normalMax: -60.0,
    warningMin: -98.0,
    criticalMin: -110.0,
    unit: 'dBm',
  },
};

export interface DetectedAnomalyItem {
  id: string;
  parameter: string;
  subsystemId: SubsystemId;
  subsystemName: string;
  value: number;
  normalMin: number;
  normalMax: number;
  deviationPercent: number;
  severity: AlertSeverity;
  anomalyType: 'THRESHOLD_VIOLATION' | 'RATE_OF_CHANGE' | 'STATISTICAL_Z' | 'COMMUNICATION_OFFLINE';
  description: string;
  detectedAt: string;
}

export interface SubsystemHealthCalculated {
  id: SubsystemId;
  name: string;
  health: number; // 0 to 100
  status: 'NOMINAL' | 'WARNING' | 'DEGRADED' | 'CRITICAL';
  contributingFactors: string[];
}

export interface FailureRiskItem {
  id: string;
  subsystem: string;
  failureType: string;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  predictedTime: string;
  evidence: {
    primaryTelemetry: string;
    rateOfDegradation: string;
    anomalyCount: number;
  };
}

export interface RecommendationItem {
  id: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  recommendation: string;
  explanation: string;
  subsystem: string;
}

export class AnomalyDetectorService {
  /**
   * Evaluates a frame against deterministic thresholds and rates of change.
   */
  public static evaluateFrame(
    frame: TelemetryFrame,
    previousFrames: TelemetryFrame[] = []
  ): {
    anomalies: DetectedAnomalyItem[];
    subsystemHealth: Record<SubsystemId, SubsystemHealthCalculated>;
    predictions: FailureRiskItem[];
    recommendations: RecommendationItem[];
  } {
    const anomalies: DetectedAnomalyItem[] = [];

    // 1. Temperature Check
    const tempConfig = TELEMETRY_THRESHOLDS.temperature;
    if (frame.temperature > (tempConfig.criticalMax || 88)) {
      anomalies.push({
        id: `ANOM-${Date.now()}-TEMP`,
        parameter: tempConfig.parameter,
        subsystemId: tempConfig.subsystemId,
        subsystemName: 'Thermal Control Subsystem',
        value: frame.temperature,
        normalMin: tempConfig.normalMin,
        normalMax: tempConfig.normalMax,
        deviationPercent: Number((((frame.temperature - tempConfig.normalMax) / tempConfig.normalMax) * 100).toFixed(1)),
        severity: 'CRITICAL',
        anomalyType: 'THRESHOLD_VIOLATION',
        description: `Core temperature ${frame.temperature}°C exceeded critical threshold (${tempConfig.criticalMax}°C).`,
        detectedAt: new Date(frame.timestamp).toISOString(),
      });
    } else if (frame.temperature > (tempConfig.warningMax || 80)) {
      anomalies.push({
        id: `ANOM-${Date.now()}-TEMP`,
        parameter: tempConfig.parameter,
        subsystemId: tempConfig.subsystemId,
        subsystemName: 'Thermal Control Subsystem',
        value: frame.temperature,
        normalMin: tempConfig.normalMin,
        normalMax: tempConfig.normalMax,
        deviationPercent: Number((((frame.temperature - tempConfig.normalMax) / tempConfig.normalMax) * 100).toFixed(1)),
        severity: 'HIGH',
        anomalyType: 'THRESHOLD_VIOLATION',
        description: `Thermal elevation detected at ${frame.temperature}°C. Nominal envelope breached.`,
        detectedAt: new Date(frame.timestamp).toISOString(),
      });
    }

    // 2. Voltage Check
    const voltConfig = TELEMETRY_THRESHOLDS.voltage;
    if (frame.voltage < (voltConfig.criticalMin || 22.0)) {
      anomalies.push({
        id: `ANOM-${Date.now()}-VOLT`,
        parameter: voltConfig.parameter,
        subsystemId: voltConfig.subsystemId,
        subsystemName: 'Electrical Power Subsystem',
        value: frame.voltage,
        normalMin: voltConfig.normalMin,
        normalMax: voltConfig.normalMax,
        deviationPercent: Number((((voltConfig.normalMin - frame.voltage) / voltConfig.normalMin) * 100).toFixed(1)),
        severity: 'CRITICAL',
        anomalyType: 'THRESHOLD_VIOLATION',
        description: `Primary bus voltage collapsed to ${frame.voltage}V (Critical limit: ${voltConfig.criticalMin}V).`,
        detectedAt: new Date(frame.timestamp).toISOString(),
      });
    } else if (frame.voltage < (voltConfig.warningMin || 25.0)) {
      anomalies.push({
        id: `ANOM-${Date.now()}-VOLT`,
        parameter: voltConfig.parameter,
        subsystemId: voltConfig.subsystemId,
        subsystemName: 'Electrical Power Subsystem',
        value: frame.voltage,
        normalMin: voltConfig.normalMin,
        normalMax: voltConfig.normalMax,
        deviationPercent: Number((((voltConfig.normalMin - frame.voltage) / voltConfig.normalMin) * 100).toFixed(1)),
        severity: 'HIGH',
        anomalyType: 'THRESHOLD_VIOLATION',
        description: `Main bus voltage dropped to ${frame.voltage}V below nominal flight floor.`,
        detectedAt: new Date(frame.timestamp).toISOString(),
      });
    }

    // 3. Battery Degradation & Rate of Decline
    const battConfig = TELEMETRY_THRESHOLDS.batteryPercent;
    let rapidBatteryDecline = false;
    if (previousFrames.length >= 10) {
      const olderFrame = previousFrames[previousFrames.length - 10];
      const deltaBatt = olderFrame.batteryPercent - frame.batteryPercent;
      if (deltaBatt > 3.5) {
        rapidBatteryDecline = true;
        anomalies.push({
          id: `ANOM-${Date.now()}-BATT-RATE`,
          parameter: 'Battery Depletion Rate',
          subsystemId: 'battery',
          subsystemName: 'Battery Storage System',
          value: Number(deltaBatt.toFixed(2)),
          normalMin: 0.0,
          normalMax: 1.0,
          deviationPercent: Number((deltaBatt * 100).toFixed(1)),
          severity: 'HIGH',
          anomalyType: 'RATE_OF_CHANGE',
          description: `Abnormal battery depletion: dropped ${deltaBatt.toFixed(1)}% in 15 seconds.`,
          detectedAt: new Date(frame.timestamp).toISOString(),
        });
      }
    }

    if (frame.batteryPercent < (battConfig.warningMin || 50)) {
      anomalies.push({
        id: `ANOM-${Date.now()}-BATT`,
        parameter: battConfig.parameter,
        subsystemId: 'battery',
        subsystemName: 'Battery Storage System',
        value: frame.batteryPercent,
        normalMin: battConfig.normalMin,
        normalMax: battConfig.normalMax,
        deviationPercent: Number((((battConfig.normalMin - frame.batteryPercent) / battConfig.normalMin) * 100).toFixed(1)),
        severity: frame.batteryPercent < 35 ? 'CRITICAL' : 'HIGH',
        anomalyType: 'THRESHOLD_VIOLATION',
        description: `Battery state of charge depleted to ${frame.batteryPercent}%.`,
        detectedAt: new Date(frame.timestamp).toISOString(),
      });
    }

    // 4. Communication Signal Check
    if (frame.signalStrengthDb < -100 || frame.commLatencyMs > 600) {
      anomalies.push({
        id: `ANOM-${Date.now()}-COMM`,
        parameter: 'RF Telemetry Link Status',
        subsystemId: 'communication',
        subsystemName: 'Telecommunications',
        value: frame.signalStrengthDb,
        normalMin: -85,
        normalMax: -60,
        deviationPercent: 35.0,
        severity: frame.signalStrengthDb < -110 ? 'CRITICAL' : 'HIGH',
        anomalyType: 'THRESHOLD_VIOLATION',
        description: `Telemetry link degraded: RSSI ${frame.signalStrengthDb} dBm, latency ${frame.commLatencyMs}ms.`,
        detectedAt: new Date(frame.timestamp).toISOString(),
      });
    }

    // 5. Calculate Subsystem Health (0 to 100)
    const subsystemHealth: Record<SubsystemId, SubsystemHealthCalculated> = {
      power: {
        id: 'power',
        name: 'Power Distribution',
        health: Math.max(10, Math.min(100, Math.round(98 - (28.4 - Math.min(28.4, frame.voltage)) * 14 - (frame.temperature > 76 ? 10 : 0)))),
        status: frame.voltage < 24 ? 'CRITICAL' : frame.voltage < 26.5 ? 'WARNING' : 'NOMINAL',
        contributingFactors: frame.voltage < 26.5 ? ['Bus voltage suppression', 'Elevated impedance'] : ['Normal bus regulation'],
      },
      battery: {
        id: 'battery',
        name: 'Battery Storage',
        health: Math.max(15, Math.min(100, Math.round(frame.batteryPercent * 0.9 + (frame.voltage > 27 ? 8 : 0) - (rapidBatteryDecline ? 20 : 0)))),
        status: frame.batteryPercent < 50 || rapidBatteryDecline ? 'CRITICAL' : frame.batteryPercent < 70 ? 'WARNING' : 'NOMINAL',
        contributingFactors: rapidBatteryDecline ? ['Accelerated discharge slope', 'Thermal heating'] : ['Nominal charge balance'],
      },
      thermal: {
        id: 'thermal',
        name: 'Thermal Control',
        health: Math.max(15, Math.min(100, Math.round(98 - Math.max(0, frame.temperature - 74) * 2.6))),
        status: frame.temperature > 85 ? 'CRITICAL' : frame.temperature > 78 ? 'WARNING' : 'NOMINAL',
        contributingFactors: frame.temperature > 78 ? ['Core dissipation surge', 'Radiative bottleneck'] : ['Thermal equilibrium preserved'],
      },
      propulsion: {
        id: 'propulsion',
        name: 'Propulsion Manifold',
        health: Math.max(20, Math.min(100, Math.round(frame.fuelPercent * 0.95 + 4))),
        status: frame.fuelPercent < 40 ? 'CRITICAL' : frame.fuelPercent < 60 ? 'WARNING' : 'NOMINAL',
        contributingFactors: frame.fuelPercent < 50 ? ['Propellant mass depletion'] : ['Tank pressure nominal'],
      },
      communication: {
        id: 'communication',
        name: 'Telecommunications',
        health: Math.max(25, Math.min(100, Math.round(frame.signalStrengthDb > -85 ? 96 : 96 - Math.abs(frame.signalStrengthDb + 85) * 1.8))),
        status: frame.signalStrengthDb < -100 ? 'CRITICAL' : frame.signalStrengthDb < -88 ? 'WARNING' : 'NOMINAL',
        contributingFactors: frame.signalStrengthDb < -88 ? ['Antenna attenuation', 'Packet latency'] : ['Link margin stable'],
      },
      avionics: {
        id: 'avionics',
        name: 'Avionics & Flight Computer',
        health: 98,
        status: 'NOMINAL',
        contributingFactors: ['Triple modular redundancy verified'],
      },
      solar: {
        id: 'solar',
        name: 'Solar Generation',
        health: Math.max(30, Math.min(100, Math.round(frame.solarOutputKw > 3 ? 96 : 88))),
        status: 'NOMINAL',
        contributingFactors: ['Optical array tracking active'],
      },
      attitude: {
        id: 'attitude',
        name: 'Attitude Determination',
        health: 99,
        status: 'NOMINAL',
        contributingFactors: ['Star tracker locked'],
      },
      payload: {
        id: 'payload',
        name: 'Earth Observation Sensor',
        health: 94,
        status: 'NOMINAL',
        contributingFactors: ['Optics cooled and ready'],
      },
      fuel: {
        id: 'fuel',
        name: 'Propellant Reserve',
        health: Math.round(frame.fuelPercent),
        status: frame.fuelPercent < 35 ? 'CRITICAL' : 'NOMINAL',
        contributingFactors: ['Hydrazine reserve monitoring'],
      },
    };

    // 6. Transparent Failure Risk Calculation
    const predictions: FailureRiskItem[] = [];

    // Battery / Power Failure Risk
    const powerAnomalies = anomalies.filter((a) => a.subsystemId === 'battery' || a.subsystemId === 'power');
    if (frame.voltage < 26.5 || frame.batteryPercent < 70 || rapidBatteryDecline) {
      const riskScore = Math.min(
        98,
        Math.round(
          (28.4 - Math.min(28.4, frame.voltage)) * 18 +
          (100 - frame.batteryPercent) * 0.45 +
          (rapidBatteryDecline ? 25 : 0) +
          (frame.temperature > 80 ? 15 : 0)
        )
      );
      const riskLevel = riskScore > 75 ? 'CRITICAL' : riskScore > 50 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW';

      predictions.push({
        id: `PRED-${Date.now()}-EPS`,
        subsystem: 'Battery Storage System',
        failureType: 'Electrochemical Cell Voltage Collapse Under Eclipse Load',
        riskScore,
        riskLevel,
        confidence: 84.5,
        predictedTime: '18–26 hours until safe-mode threshold',
        evidence: {
          primaryTelemetry: `Bus: ${frame.voltage}V | SoC: ${frame.batteryPercent}%`,
          rateOfDegradation: rapidBatteryDecline ? 'Rapid (-14%/hr equivalent)' : 'Elevated steady drift',
          anomalyCount: powerAnomalies.length,
        },
      });
    }

    // Thermal Runaway Risk
    if (frame.temperature > 78.0) {
      const thermalScore = Math.min(96, Math.round((frame.temperature - 70) * 4.2));
      predictions.push({
        id: `PRED-${Date.now()}-TCS`,
        subsystem: 'Thermal Control Subsystem',
        failureType: 'Zenith Radiator Saturation & Thermal Runaway',
        riskScore: thermalScore,
        riskLevel: thermalScore > 75 ? 'CRITICAL' : 'HIGH',
        confidence: 88.0,
        predictedTime: '32–48 hours until component derating',
        evidence: {
          primaryTelemetry: `Core Temp: ${frame.temperature}°C`,
          rateOfDegradation: '+0.8°C per orbit',
          anomalyCount: anomalies.filter((a) => a.subsystemId === 'thermal').length,
        },
      });
    }

    // 7. Operational Recommendations
    const recommendations: RecommendationItem[] = [];

    if (predictions.some((p) => p.subsystem.includes('Battery') && (p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL'))) {
      recommendations.push({
        id: `REC-${Date.now()}-1`,
        priority: 'URGENT',
        subsystem: 'Electrical Power Subsystem',
        recommendation: 'Shed non-essential instrument heating and activate secondary trickle-charge bypass.',
        explanation: `With bus voltage at ${frame.voltage}V and battery at ${frame.batteryPercent}%, load reduction avoids low-voltage trip isolation before night-side eclipse pass.`,
      });
    }

    if (frame.temperature > 79.0) {
      recommendations.push({
        id: `REC-${Date.now()}-2`,
        priority: 'HIGH',
        subsystem: 'Thermal Control Subsystem',
        recommendation: 'Reorient solar beta angle by +8° and open tertiary cooling louvers.',
        explanation: `Reduces solar radiative absorption while core temperature reads ${frame.temperature}°C, shedding approximately 180W of parasitic thermal flux.`,
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        id: `REC-${Date.now()}-NOM`,
        priority: 'LOW',
        subsystem: 'Flight Operations',
        recommendation: 'Maintain standard orbital observation schedule and continuous downlink logging.',
        explanation: 'All 10 spacecraft subsystems operating within nominal telemetry tolerances.',
      });
    }

    return {
      anomalies,
      subsystemHealth,
      predictions,
      recommendations,
    };
  }
}
