import {
  TelemetryFrame,
  SubsystemDetail,
  AnomalyRecord,
  FailurePrediction,
  ExplainableEvidence,
  MissionAlert,
  MissionTimelineEvent,
  ScenarioPreset,
  WhatIfParams,
  WhatIfImpact,
  SubsystemId,
  HealthStatus,
  RiskLevel,
} from '../types/mission';

// Initial Spacecraft Baseline State
interface EngineState {
  scenario: ScenarioPreset;
  scenarioTimeElapsed: number; // in seconds since scenario started
  orbitAngleDeg: number; // 0-360 degrees
  mitigationActive: boolean;
  userAcknowledgedAlerts: Set<string>;
  resolvedAlerts: Set<string>;
}

class TelemetryEngine {
  private state: EngineState = {
    scenario: 'BATTERY_DEGRADATION', // default active scenario for impactful hackathon demo
    scenarioTimeElapsed: 28,
    orbitAngleDeg: 142,
    mitigationActive: false,
    userAcknowledgedAlerts: new Set<string>(['ALT-103']),
    resolvedAlerts: new Set<string>(),
  };

  private history: TelemetryFrame[] = [];
  private maxHistoryFrames = 120; // 2-3 minutes of real-time 1.5s resolution
  private listeners: (() => void)[] = [];
  private intervalId: any = null;

  constructor() {
    this.seedInitialHistory();
    this.startEngine();
  }

  private seedInitialHistory() {
    const now = Date.now();
    for (let i = 60; i >= 0; i--) {
      const pastTime = now - i * 1500;
      const angle = (this.state.orbitAngleDeg - i * 0.5 + 360) % 360;
      const frame = this.computeFrame(pastTime, angle, Math.max(0, this.state.scenarioTimeElapsed - i * 1.5));
      this.history.push(frame);
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('Error in telemetry listener:', err);
      }
    }
  }

  public startEngine() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1500);
  }

  public stopEngine() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tickCount = 0;

  private tick() {
    this.state.scenarioTimeElapsed += 1.5;
    this.state.orbitAngleDeg = (this.state.orbitAngleDeg + 0.6) % 360;
    this.tickCount++;

    const frame = this.computeFrame(Date.now(), this.state.orbitAngleDeg, this.state.scenarioTimeElapsed);
    this.history.push(frame);
    if (this.history.length > this.maxHistoryFrames) {
      this.history.shift();
    }

    // Stream frame to Express Backend & Supabase every 2 ticks (every ~3 seconds)
    if (this.tickCount % 2 === 0) {
      this.streamFrameToBackend(frame);
    }

    this.notify();
  }

  private async streamFrameToBackend(frame: TelemetryFrame) {
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frame),
      });
    } catch (_err) {
      // Backend/offline fallback silently caught
    }
  }

  public isEngineRunning(): boolean {
    return this.intervalId !== null;
  }

  public setScenario(scenario: ScenarioPreset) {
    this.state.scenario = scenario;
    this.state.scenarioTimeElapsed = 0;
    this.state.mitigationActive = false;
    this.notify();
  }

  public applyMitigation() {
    this.state.mitigationActive = true;
    this.notify();
  }

  public resetMission() {
    this.state.scenario = 'NORMAL_MISSION';
    this.state.scenarioTimeElapsed = 0;
    this.state.mitigationActive = false;
    this.state.userAcknowledgedAlerts.clear();
    this.state.resolvedAlerts.clear();
    this.notify();
  }

  public acknowledgeAlert(id: string) {
    this.state.userAcknowledgedAlerts.add(id);
    this.notify();
  }

  public resolveAlert(id: string) {
    this.state.resolvedAlerts.add(id);
    this.notify();
  }

  public getScenario(): ScenarioPreset {
    return this.state.scenario;
  }

  public isMitigationActive(): boolean {
    return this.state.mitigationActive;
  }

  public getLatestFrame(): TelemetryFrame {
    return this.history[this.history.length - 1] || this.computeFrame(Date.now(), this.state.orbitAngleDeg, 0);
  }

  public getHistory(): TelemetryFrame[] {
    return [...this.history];
  }

  // Realistic Physics and Failure Progression
  private computeFrame(timestamp: number, orbitAngleDeg: number, elapsed: number): TelemetryFrame {
    const isSunlit = orbitAngleDeg >= 30 && orbitAngleDeg <= 210;
    const baseSolar = isSunlit ? 5.2 + Math.sin((orbitAngleDeg - 30) * (Math.PI / 180)) * 0.6 : 0.05;

    // Default nominal baseline
    let temp = 72.8 + Math.sin(timestamp / 10000) * 0.6;
    let voltage = 28.4 + Math.sin(timestamp / 7000) * 0.15;
    let current = 14.2 + Math.cos(timestamp / 8000) * 0.4;
    let battery = 86.4 - (elapsed * 0.005);
    let fuel = 72.3 - (elapsed * 0.001);
    let pressure = 101.3 + Math.sin(timestamp / 12000) * 0.2;
    let signalStrength = -78.4 + Math.sin(timestamp / 9000) * 1.2;
    let commLatency = 142 + Math.floor(Math.sin(timestamp / 5000) * 8);
    let power = 4.8 + Math.sin(timestamp / 6000) * 0.2;
    let solarOutput = baseSolar;
    let radiation = 0.042 + Math.random() * 0.004;
    let cpu = 34 + Math.floor(Math.random() * 5);
    let memory = 46 + Math.floor(Math.random() * 3);
    let thrusterPressure = 22.4 + Math.sin(timestamp / 15000) * 0.3;
    let attitudeError = 0.024 + Math.random() * 0.008;
    let gyroRate = 0.003 + Math.random() * 0.002;

    // Apply Scenario Failure Profiles
    const scenario = this.state.scenario;
    const mitigated = this.state.mitigationActive;
    const prog = Math.min(1.0, elapsed / 45); // failure reaches peak in 45s

    if (scenario === 'BATTERY_DEGRADATION') {
      if (mitigated) {
        // Recovery trajectory
        voltage = 27.6 + Math.sin(timestamp / 5000) * 0.2;
        battery = Math.max(68, 76.5 + Math.sin(timestamp / 8000) * 0.5);
        temp = 74.2 + Math.sin(timestamp / 6000) * 0.4;
        power = 3.6; // reduced load
      } else {
        // Progression: 28.4V -> 25.6V, Temp surges, Battery drains faster
        voltage = 28.4 - prog * 2.85 + Math.sin(timestamp / 2000) * 0.35; // drops to ~25.55V with jitter
        temp = 72.8 + prog * 11.4 + Math.sin(timestamp / 4000) * 0.5; // surges to ~84.2°C
        battery = 86.4 - prog * 16.2 - (elapsed * 0.02); // drops to ~69-70%
        power = 4.8 + prog * 0.7; // higher internal impedance dissipation
      }
    } else if (scenario === 'THERMAL_FAILURE') {
      if (mitigated) {
        temp = 75.8 + Math.sin(timestamp / 4000) * 0.5;
        power = 4.0;
      } else {
        temp = 72.8 + prog * 22.5 + Math.sin(timestamp / 3000) * 0.8; // reaches ~95°C!
        battery = 86.4 - prog * 8.0;
        voltage = 28.4 - prog * 1.4;
      }
    } else if (scenario === 'COMMUNICATION_LOSS') {
      if (mitigated) {
        signalStrength = -84.0;
        commLatency = 180;
      } else {
        signalStrength = -78.4 - prog * 36.0 + Math.sin(timestamp / 1500) * 4.0; // drops to -114 dBm
        commLatency = 142 + Math.floor(prog * 1250); // latency spikes to 1400ms
      }
    } else if (scenario === 'FUEL_LEAK') {
      if (mitigated) {
        fuel = Math.max(52, 64.0 - elapsed * 0.001);
        thrusterPressure = 19.8;
      } else {
        fuel = 72.3 - prog * 24.0 - elapsed * 0.08; // drops rapidly to ~48%
        thrusterPressure = 22.4 - prog * 11.2; // pressure loss
        pressure = 101.3 - prog * 12.0;
      }
    } else if (scenario === 'SENSOR_DRIFT') {
      voltage = 28.4 + Math.sin(elapsed * 0.8) * (prog * 3.5);
      temp = 72.8 + Math.cos(elapsed * 0.6) * (prog * 14.0);
      attitudeError = 0.024 + prog * 0.42;
    } else if (scenario === 'SOLAR_PANEL_DEGRADATION') {
      if (mitigated) {
        solarOutput = baseSolar * 0.85;
      } else {
        solarOutput = baseSolar * (1.0 - prog * 0.55); // generation loss by 55%
        battery = 86.4 - prog * 22.0;
      }
    } else if (scenario === 'MULTI_SUBSYSTEM_FAILURE') {
      voltage = 28.4 - prog * 2.6;
      temp = 72.8 + prog * 16.0;
      battery = 86.4 - prog * 18.0;
      signalStrength = -78.4 - prog * 24.0;
      commLatency = 142 + Math.floor(prog * 600);
      fuel = 72.3 - prog * 14.0;
    }

    // Dynamic Spacecraft Health Calculation (0 to 100)
    let health = 94.0;
    if (scenario === 'BATTERY_DEGRADATION') {
      health = mitigated ? 86.0 : Math.max(62, 94.0 - prog * 23.0);
    } else if (scenario === 'THERMAL_FAILURE') {
      health = mitigated ? 88.0 : Math.max(54, 94.0 - prog * 36.0);
    } else if (scenario === 'COMMUNICATION_LOSS') {
      health = mitigated ? 90.0 : Math.max(68, 94.0 - prog * 22.0);
    } else if (scenario === 'FUEL_LEAK') {
      health = mitigated ? 87.0 : Math.max(59, 94.0 - prog * 29.0);
    } else if (scenario === 'SENSOR_DRIFT') {
      health = Math.max(71, 94.0 - prog * 19.0);
    } else if (scenario === 'SOLAR_PANEL_DEGRADATION') {
      health = mitigated ? 89.0 : Math.max(65, 94.0 - prog * 25.0);
    } else if (scenario === 'MULTI_SUBSYSTEM_FAILURE') {
      health = Math.max(48, 94.0 - prog * 44.0);
    }

    const date = new Date(timestamp);
    const timeFormatted = date.toTimeString().split(' ')[0] + '.' + String(Math.floor(date.getMilliseconds() / 100));

    return {
      timestamp,
      timeFormatted,
      temperature: Number(temp.toFixed(1)),
      voltage: Number(voltage.toFixed(2)),
      current: Number(current.toFixed(1)),
      batteryPercent: Number(Math.max(5, Math.min(100, battery)).toFixed(1)),
      fuelPercent: Number(Math.max(2, Math.min(100, fuel)).toFixed(1)),
      pressure: Number(pressure.toFixed(1)),
      signalStrengthDb: Number(signalStrength.toFixed(1)),
      commLatencyMs: commLatency,
      powerKw: Number(power.toFixed(2)),
      solarOutputKw: Number(solarOutput.toFixed(2)),
      radiationRad: Number(radiation.toFixed(4)),
      cpuPercent: cpu,
      memoryPercent: memory,
      thrusterPressureBar: Number(thrusterPressure.toFixed(1)),
      attitudeErrorDeg: Number(attitudeError.toFixed(4)),
      gyroRateDps: Number(gyroRate.toFixed(4)),
      healthScore: Math.round(health),
    };
  }

  // Return all Subsystems with real-time health and telemetry
  public getSubsystems(): SubsystemDetail[] {
    const frame = this.getLatestFrame();
    const scenario = this.state.scenario;
    const mitigated = this.state.mitigationActive;

    const isBatteryDefect = scenario === 'BATTERY_DEGRADATION' && !mitigated;
    const isThermalDefect = scenario === 'THERMAL_FAILURE' && !mitigated;
    const isCommDefect = scenario === 'COMMUNICATION_LOSS' && !mitigated;
    const isFuelDefect = scenario === 'FUEL_LEAK' && !mitigated;
    const isSolarDefect = scenario === 'SOLAR_PANEL_DEGRADATION' && !mitigated;
    const isMultiDefect = scenario === 'MULTI_SUBSYSTEM_FAILURE' && !mitigated;

    return [
      {
        id: 'battery',
        name: 'Battery Storage System',
        category: 'Electrical Power Subsystem (EPS)',
        health: isBatteryDefect ? 72 : isMultiDefect ? 68 : mitigated ? 86 : 94,
        status: isBatteryDefect ? 'CRITICAL' : isMultiDefect ? 'CRITICAL' : mitigated ? 'WARNING' : 'NOMINAL',
        riskScore: isBatteryDefect ? 73 : isMultiDefect ? 76 : mitigated ? 34 : 12,
        riskLevel: isBatteryDefect ? 'HIGH' : isMultiDefect ? 'CRITICAL' : mitigated ? 'MODERATE' : 'LOW',
        primaryMetric: 'Cell Voltage',
        primaryValue: `${frame.voltage} V`,
        secondaryMetric: 'State of Charge (SoC)',
        secondaryValue: `${frame.batteryPercent} %`,
        operatingTemp: isBatteryDefect ? 84.0 : 24.2,
        powerDrawKw: 1.45,
        redundancyMode: 'WARM-STANDBY',
        description: 'Dual Lithium-Nickel-Cobalt-Aluminum (NCA) 48V battery blocks with integrated autonomous charge balancer.',
        activeAnomaliesCount: isBatteryDefect || isMultiDefect ? 1 : 0,
        failureProbability: isBatteryDefect ? 73 : isMultiDefect ? 78 : 8,
        predictedTimeToFailureHours: isBatteryDefect ? { min: 18, max: 26 } : undefined,
        contributingFactors: [
          { name: 'Voltage Instability', weightPercent: 38 },
          { name: 'Increased Temperature', weightPercent: 25 },
          { name: 'High Discharge Rate', weightPercent: 21 },
          { name: 'Reduced Charging Efficiency', weightPercent: 16 },
        ],
        recommendedAction: 'Reduce non-critical payload loads and switch to secondary trickle-charge bus.',
      },
      {
        id: 'power',
        name: 'Power Distribution Unit (PDU)',
        category: 'Electrical Power Subsystem (EPS)',
        health: isBatteryDefect ? 82 : isSolarDefect ? 74 : 96,
        status: isBatteryDefect ? 'WARNING' : isSolarDefect ? 'DEGRADED' : 'NOMINAL',
        riskScore: isBatteryDefect ? 48 : isSolarDefect ? 62 : 14,
        riskLevel: isBatteryDefect ? 'MODERATE' : isSolarDefect ? 'HIGH' : 'LOW',
        primaryMetric: 'Total Bus Power',
        primaryValue: `${frame.powerKw} kW`,
        secondaryMetric: 'Bus Current',
        secondaryValue: `${frame.current} A`,
        operatingTemp: frame.temperature - 12.0,
        powerDrawKw: 0.22,
        redundancyMode: 'ACTIVE-HOT',
        description: 'Main 28V regulated DC distribution bus with solid-state circuit breakers and overload fast-trip isolation.',
        activeAnomaliesCount: isSolarDefect ? 1 : 0,
        failureProbability: isSolarDefect ? 56 : 10,
        contributingFactors: [
          { name: 'Bus Ripple Noise', weightPercent: 42 },
          { name: 'Shunt Regulator Thermal Load', weightPercent: 34 },
          { name: 'Transient Spikes', weightPercent: 24 },
        ],
        recommendedAction: 'Verify solid-state power switches and balance secondary load banks.',
      },
      {
        id: 'solar',
        name: 'Solar Array Wings',
        category: 'Power Generation',
        health: isSolarDefect ? 68 : isMultiDefect ? 79 : 98,
        status: isSolarDefect ? 'DEGRADED' : 'NOMINAL',
        riskScore: isSolarDefect ? 64 : 8,
        riskLevel: isSolarDefect ? 'HIGH' : 'LOW',
        primaryMetric: 'Photovoltaic Yield',
        primaryValue: `${frame.solarOutputKw} kW`,
        secondaryMetric: 'Sun Tracking Error',
        secondaryValue: '0.42°',
        operatingTemp: frame.temperature + 18.0,
        powerDrawKw: 0.05,
        redundancyMode: 'ACTIVE-HOT',
        description: 'Twin deployable Gallium Arsenide (GaAs) triple-junction solar wings with optical sun-tracking gimbals.',
        activeAnomaliesCount: isSolarDefect ? 1 : 0,
        failureProbability: isSolarDefect ? 62 : 5,
        contributingFactors: [
          { name: 'Solar Cell Micro-pitting', weightPercent: 50 },
          { name: 'Drive Motor Jitter', weightPercent: 30 },
          { name: 'Thermal Creep', weightPercent: 20 },
        ],
        recommendedAction: 'Trim solar beta angle to maximize incident angle and recalibrate drive motor.',
      },
      {
        id: 'thermal',
        name: 'Thermal Control Subsystem (TCS)',
        category: 'Environmental & Life Support',
        health: isThermalDefect ? 64 : isBatteryDefect ? 81 : 95,
        status: isThermalDefect ? 'CRITICAL' : isBatteryDefect ? 'WARNING' : 'NOMINAL',
        riskScore: isThermalDefect ? 78 : isBatteryDefect ? 51 : 15,
        riskLevel: isThermalDefect ? 'CRITICAL' : isBatteryDefect ? 'HIGH' : 'LOW',
        primaryMetric: 'Core Temperature',
        primaryValue: `${frame.temperature} °C`,
        secondaryMetric: 'Radiator Flux',
        secondaryValue: '340 W/m²',
        operatingTemp: frame.temperature,
        powerDrawKw: 0.65,
        redundancyMode: 'ACTIVE-HOT',
        description: 'Loop heat pipes (LHPs), multi-layer insulation (MLI) blankets, and dual deployable zenith louvers.',
        activeAnomaliesCount: isThermalDefect ? 1 : isBatteryDefect ? 1 : 0,
        failureProbability: isThermalDefect ? 78 : isBatteryDefect ? 51 : 12,
        predictedTimeToFailureHours: isThermalDefect ? { min: 12, max: 20 } : undefined,
        contributingFactors: [
          { name: 'Radiator Louver Stagnation', weightPercent: 44 },
          { name: 'High Internal Heat Load', weightPercent: 32 },
          { name: 'MLI Seam Delamination', weightPercent: 24 },
        ],
        recommendedAction: 'Open secondary radiator louvers and pitch spacecraft away from direct solar specular reflection.',
      },
      {
        id: 'propulsion',
        name: 'Monopropellant Hydrazine Thrusters',
        category: 'Orbit Maintenance & Reaction Control',
        health: isFuelDefect ? 66 : 96,
        status: isFuelDefect ? 'DEGRADED' : 'NOMINAL',
        riskScore: isFuelDefect ? 68 : 14,
        riskLevel: isFuelDefect ? 'HIGH' : 'LOW',
        primaryMetric: 'Propellant Tank',
        primaryValue: `${frame.fuelPercent} %`,
        secondaryMetric: 'Manifold Pressure',
        secondaryValue: `${frame.thrusterPressureBar} bar`,
        operatingTemp: 18.5,
        powerDrawKw: 0.18,
        redundancyMode: 'WARM-STANDBY',
        description: '4x 5N reaction control thrusters + 1x 22N orbit-raising apogee motor fueled by high-purity hydrazine.',
        activeAnomaliesCount: isFuelDefect ? 1 : 0,
        failureProbability: isFuelDefect ? 64 : 14,
        contributingFactors: [
          { name: 'Latch Valve Leakage', weightPercent: 55 },
          { name: 'Pressure Delta Gradient', weightPercent: 30 },
          { name: 'Catalyst Bed Wear', weightPercent: 15 },
        ],
        recommendedAction: 'Isolate primary propellant latch valve and switch to redundant thruster branch B.',
      },
      {
        id: 'communication',
        name: 'X-Band / S-Band Telecommunications',
        category: 'RF Transceiver & High Gain Antenna',
        health: isCommDefect ? 62 : 88,
        status: isCommDefect ? 'CRITICAL' : 'NOMINAL',
        riskScore: isCommDefect ? 74 : 28,
        riskLevel: isCommDefect ? 'HIGH' : 'LOW',
        primaryMetric: 'Signal Margin',
        primaryValue: `${frame.signalStrengthDb} dBm`,
        secondaryMetric: 'Uplink/Downlink Latency',
        secondaryValue: `${frame.commLatencyMs} ms`,
        operatingTemp: 32.4,
        powerDrawKw: 0.85,
        redundancyMode: 'ACTIVE-HOT',
        description: 'High-gain steerable parabolic dish for scientific imagery downlink + omnidirectional S-band for TT&C.',
        activeAnomaliesCount: isCommDefect ? 1 : 0,
        failureProbability: isCommDefect ? 72 : 28,
        contributingFactors: [
          { name: 'Atmospheric Scintillation', weightPercent: 41 },
          { name: 'RF Power Amplifier Thermal Drift', weightPercent: 36 },
          { name: 'Gimbal Pointing Bias', weightPercent: 23 },
        ],
        recommendedAction: 'Re-acquire ground station beacon and elevate RF solid-state amplifier bias current.',
      },
      {
        id: 'avionics',
        name: 'Flight Computer & Data Handling (OBC)',
        category: 'Avionics & Autonomous Guidance',
        health: 92,
        status: 'NOMINAL',
        riskScore: 12,
        riskLevel: 'LOW',
        primaryMetric: 'CPU Utilization',
        primaryValue: `${frame.cpuPercent} %`,
        secondaryMetric: 'ECC Memory Faults',
        secondaryValue: '0 faults',
        operatingTemp: 28.1,
        powerDrawKw: 0.35,
        redundancyMode: 'ACTIVE-HOT',
        description: 'Radiation-hardened Dual-core LEON4 processor running real-time fault-tolerant flight executive OS.',
        activeAnomaliesCount: 0,
        failureProbability: 12,
        contributingFactors: [
          { name: 'SEU Single Event Upsets', weightPercent: 50 },
          { name: 'Memory Bus Contention', weightPercent: 30 },
          { name: 'Watchdog Timer Drift', weightPercent: 20 },
        ],
        recommendedAction: 'Periodic memory wash cycle nominal; continue watchdog polling.',
      },
      {
        id: 'attitude',
        name: 'Attitude Determination & Control (ADCS)',
        category: 'Guidance, Navigation & Control (GNC)',
        health: 97,
        status: 'NOMINAL',
        riskScore: 10,
        riskLevel: 'LOW',
        primaryMetric: 'Pointing Error',
        primaryValue: `${frame.attitudeErrorDeg}°`,
        secondaryMetric: 'Reaction Wheels Speed',
        secondaryValue: '3,420 RPM',
        operatingTemp: 21.0,
        powerDrawKw: 0.42,
        redundancyMode: 'WARM-STANDBY',
        description: 'Tri-axial optical star trackers, fine sun sensors, and 4x magnetically suspended reaction wheels.',
        activeAnomaliesCount: 0,
        failureProbability: 9,
        contributingFactors: [
          { name: 'Reaction Wheel Bearing Drag', weightPercent: 45 },
          { name: 'Star Tracker Stray Light', weightPercent: 35 },
          { name: 'Magnetic Torquer Saturation', weightPercent: 20 },
        ],
        recommendedAction: 'Desaturate reaction wheels using magnetic torquer coils during equatorial pass.',
      },
    ];
  }

  // Active Anomalies
  public getAnomalies(): AnomalyRecord[] {
    const frame = this.getLatestFrame();
    const scenario = this.state.scenario;
    const mitigated = this.state.mitigationActive;

    const list: AnomalyRecord[] = [];

    if (scenario === 'BATTERY_DEGRADATION' && !mitigated) {
      list.push({
        id: 'ANOM-01',
        timestamp: '14:32:05 UTC',
        subsystemId: 'battery',
        subsystemName: 'Battery Storage System',
        parameter: 'Battery Voltage',
        currentValue: `${frame.voltage} V`,
        nominalRange: '27.5 – 29.0 V',
        baselineMin: 27.5,
        baselineMax: 29.0,
        deviationPercent: 11.7,
        anomalyScore: 0.91,
        zScore: -3.84,
        severity: 'HIGH',
        status: 'ACTIVE',
        detectorType: 'HYBRID',
        explanation: {
          whatHappened: `Battery voltage dropped to ${frame.voltage} V, which is 11.7% below the nominal 30-minute flight baseline.`,
          whyAbnormal: 'Current voltage is outside the statistically expected operating corridor [27.5V - 29.0V] for this mission orbital phase.',
          possibleCause: 'Internal electrochemical impedance elevation, defective cell group bypass diode, or excessive power draw.',
          impact: 'Continued degradation may trigger autonomous payload load-shedding and jeopardize upcoming night-side eclipse pass.',
          recommendedAction: 'Reduce non-critical payload power consumption and inspect battery subsystem thermal telemetry.',
        },
      });

      list.push({
        id: 'ANOM-02',
        timestamp: '14:28:19 UTC',
        subsystemId: 'thermal',
        subsystemName: 'Thermal System',
        parameter: 'Core Temperature Deviation',
        currentValue: `${frame.temperature} °C`,
        nominalRange: '68.0 – 76.0 °C',
        baselineMin: 68.0,
        baselineMax: 76.0,
        deviationPercent: 10.5,
        anomalyScore: 0.84,
        zScore: 3.12,
        severity: 'WARNING',
        status: 'ACTIVE',
        detectorType: 'STATISTICAL_Z',
        explanation: {
          whatHappened: `Core internal temperature reached ${frame.temperature} °C, exhibiting abnormal thermal accumulation.`,
          whyAbnormal: 'Exceeds the 2-sigma moving average envelope for current solar aspect angle.',
          possibleCause: 'Battery cell resistive Joule heating coupled with reduced heat pipe thermal conductance.',
          impact: 'Elevated thermal stress degrades electronics reliability and accelerates battery electrolyte breakdown.',
          recommendedAction: 'Engage active cooling louvers and reorient satellite beta angle by +8° to improve radiative cooling.',
        },
      });
    } else if (scenario === 'THERMAL_FAILURE' && !mitigated) {
      list.push({
        id: 'ANOM-03',
        timestamp: '14:31:10 UTC',
        subsystemId: 'thermal',
        subsystemName: 'Thermal Control System',
        parameter: 'Core Temperature',
        currentValue: `${frame.temperature} °C`,
        nominalRange: '68.0 – 76.0 °C',
        baselineMin: 68.0,
        baselineMax: 76.0,
        deviationPercent: 24.2,
        anomalyScore: 0.97,
        zScore: 4.85,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        detectorType: 'NEURAL_AUTOENCODER',
        explanation: {
          whatHappened: `Thermal subsystem experiencing severe temperature runaway, currently reading ${frame.temperature} °C.`,
          whyAbnormal: 'Thermal flux dissipation rate is 38% below baseline thermodynamic equilibrium.',
          possibleCause: 'Loop heat pipe vapor lock or primary zenith radiator louver actuator failure.',
          impact: 'Immediate risk of thermal shutdown on primary avionics and camera sensors.',
          recommendedAction: 'Execute emergency thermal maneuver, open secondary louvers, and shed non-essential loads.',
        },
      });
    } else if (scenario === 'COMMUNICATION_LOSS' && !mitigated) {
      list.push({
        id: 'ANOM-04',
        timestamp: '14:29:45 UTC',
        subsystemId: 'communication',
        subsystemName: 'Telecommunications',
        parameter: 'RF Signal Strength & Latency',
        currentValue: `${frame.signalStrengthDb} dBm / ${frame.commLatencyMs} ms`,
        nominalRange: '-72 to -82 dBm / 130–160 ms',
        baselineMin: -82,
        baselineMax: -72,
        deviationPercent: 38.6,
        anomalyScore: 0.89,
        zScore: -3.42,
        severity: 'HIGH',
        status: 'ACTIVE',
        detectorType: 'RULE_BASED',
        explanation: {
          whatHappened: `Signal strength attenuated to ${frame.signalStrengthDb} dBm with frame latency surging to ${frame.commLatencyMs} ms.`,
          whyAbnormal: 'Carrier-to-noise ratio (C/N0) dropped below minimum margin for 50 Mbps science downlink.',
          possibleCause: 'Antenna gimbal pointing deviation or solid-state RF amplifier phase distortion.',
          impact: 'Telemetry packet drops and delay in receiving real-time health confirmations.',
          recommendedAction: 'Switch to omnidirectional S-band low-rate carrier and recalibrate antenna pointing offset.',
        },
      });
    } else if (scenario === 'FUEL_LEAK' && !mitigated) {
      list.push({
        id: 'ANOM-05',
        timestamp: '14:30:12 UTC',
        subsystemId: 'propulsion',
        subsystemName: 'Propulsion Subsystem',
        parameter: 'Hydrazine Tank Pressure Delta',
        currentValue: `${frame.thrusterPressureBar} bar`,
        nominalRange: '21.0 – 24.0 bar',
        baselineMin: 21.0,
        baselineMax: 24.0,
        deviationPercent: 28.5,
        anomalyScore: 0.93,
        zScore: -4.1,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        detectorType: 'HYBRID',
        explanation: {
          whatHappened: `Fuel tank pressure dropped rapidly to ${frame.thrusterPressureBar} bar.`,
          whyAbnormal: 'Negative pressure gradient without commanded thruster burns.',
          possibleCause: 'Micro-meteorite penetration or micro-crack on isolation latch valve seal.',
          impact: 'Risk of mission life reduction and uncontrolled attitude perturbation if propellant vents.',
          recommendedAction: 'Close pyro-valve branch A immediately and isolate remaining fuel mass.',
        },
      });
    } else {
      // Nominal or mitigated
      list.push({
        id: 'ANOM-NORM',
        timestamp: '14:10:02 UTC',
        subsystemId: 'communication',
        subsystemName: 'Communication Subsystem',
        parameter: 'Signal Carrier Fluctuation',
        currentValue: '-79.2 dBm',
        nominalRange: '-75 to -85 dBm',
        baselineMin: -85,
        baselineMax: -75,
        deviationPercent: 2.1,
        anomalyScore: 0.18,
        zScore: 0.42,
        severity: 'INFO',
        status: 'RESOLVED',
        detectorType: 'RULE_BASED',
        explanation: {
          whatHappened: 'Minor signal fluctuation during atmospheric line-of-sight pass.',
          whyAbnormal: 'Transient atmospheric absorption layer.',
          possibleCause: 'Ground station antenna elevation angle change.',
          impact: 'Negligible. Nominal telemetry maintained.',
          recommendedAction: 'No action required.',
        },
      });
    }

    return list;
  }

  // Subsystem Risk and Failure Predictions
  public getFailurePredictions(): FailurePrediction[] {
    const scenario = this.state.scenario;
    const mitigated = this.state.mitigationActive;

    if (scenario === 'BATTERY_DEGRADATION' && !mitigated) {
      return [
        {
          id: 'PRED-01',
          subsystemId: 'battery',
          subsystemName: 'Battery Storage System',
          title: 'Battery Cell Group Degradation & Under-Voltage Lockout',
          riskLevel: 'HIGH',
          failureProbability: 73,
          confidence: 84,
          estimatedTimeToFailure: '18–26 hours',
          modelType: 'HYBRID_DIGITAL_TWIN',
          contributingFactors: [
            { factor: 'Voltage Instability', weightPercent: 38, trend: 'RISING' },
            { factor: 'Increased Internal Temperature', weightPercent: 25, trend: 'RISING' },
            { factor: 'High Discharge Rate in Eclipse', weightPercent: 21, trend: 'OSCILLATING' },
            { factor: 'Reduced Charging Efficiency', weightPercent: 16, trend: 'FALLING' },
          ],
          consequenceSummary:
            'If unmitigated, battery depth-of-discharge will exceed 75%, inducing thermal runaway in Cell Block 2 and triggering autonomous spacecraft safe-mode.',
          mitigationProtocol:
            'Reduce non-critical payload power by 1.2 kW, adjust EPS charge regulator profile, and bias solar panel gimbal for maximum illumination.',
        },
        {
          id: 'PRED-02',
          subsystemId: 'thermal',
          subsystemName: 'Thermal System',
          title: 'Thermal Margin Saturation',
          riskLevel: 'HIGH',
          failureProbability: 51,
          confidence: 79,
          estimatedTimeToFailure: '32–48 hours',
          modelType: 'TEMPORAL_TRANSFORMER',
          contributingFactors: [
            { factor: 'Joule Dissipation Heat from Battery', weightPercent: 44, trend: 'RISING' },
            { factor: 'Solar Flux Variation', weightPercent: 32, trend: 'OSCILLATING' },
            { factor: 'Radiator Louver Degraded Conductance', weightPercent: 24, trend: 'FALLING' },
          ],
          consequenceSummary:
            'Internal core temperature will surpass 85°C, impacting optical sensor calibration and degrading solid-state mass memory retention.',
          mitigationProtocol: 'Orient satellite yaw to cast shadows across sensitive battery payload bay.',
        },
        {
          id: 'PRED-03',
          subsystemId: 'communication',
          subsystemName: 'Communication System',
          title: 'RF Link Degradation during High Load',
          riskLevel: 'LOW',
          failureProbability: 28,
          confidence: 72,
          estimatedTimeToFailure: '> 72 hours',
          modelType: 'MARKOV_RELIABILITY',
          contributingFactors: [
            { factor: 'Ground Station Elevation Angle', weightPercent: 52, trend: 'OSCILLATING' },
            { factor: 'Power Bus Ripple', weightPercent: 48, trend: 'RISING' },
          ],
          consequenceSummary: 'Downlink throughput throttled from 50 Mbps to 10 Mbps.',
          mitigationProtocol: 'Buffer high-resolution imagery until next high-elevation ground pass.',
        },
        {
          id: 'PRED-04',
          subsystemId: 'propulsion',
          subsystemName: 'Propulsion Subsystem',
          title: 'Manifold Pressure Thermal Drift',
          riskLevel: 'LOW',
          failureProbability: 14,
          confidence: 91,
          estimatedTimeToFailure: '> 120 hours',
          modelType: 'RANDOM_FOREST',
          contributingFactors: [
            { factor: 'Tank Thermal Cycling', weightPercent: 65, trend: 'OSCILLATING' },
            { factor: 'Propellant Residual Mass', weightPercent: 35, trend: 'FALLING' },
          ],
          consequenceSummary: 'Slight impulse variation during orbit correction maneuvers.',
          mitigationProtocol: 'Calibrate burn pulse duration using real-time accelerometer feedback.',
        },
      ];
    } else if (scenario === 'THERMAL_FAILURE' && !mitigated) {
      return [
        {
          id: 'PRED-T1',
          subsystemId: 'thermal',
          subsystemName: 'Thermal System',
          title: 'Critical Loop Heat Pipe Vapor Lock & Core Overheating',
          riskLevel: 'CRITICAL',
          failureProbability: 86,
          confidence: 92,
          estimatedTimeToFailure: '8–14 hours',
          modelType: 'HYBRID_DIGITAL_TWIN',
          contributingFactors: [
            { factor: 'LHP Evaporator Dryout', weightPercent: 54, trend: 'RISING' },
            { factor: 'Direct Solar Incident Flux', weightPercent: 28, trend: 'RISING' },
            { factor: 'Radiator Radiative Degradation', weightPercent: 18, trend: 'RISING' },
          ],
          consequenceSummary: 'Irreversible failure of secondary optical imaging arrays.',
          mitigationProtocol: 'Execute emergency 180° roll maneuver away from the Sun.',
        },
      ];
    } else {
      // Nominal
      return [
        {
          id: 'PRED-NOM-1',
          subsystemId: 'battery',
          subsystemName: 'Battery Storage System',
          title: 'Standard Cell Cycling Fatigue',
          riskLevel: 'LOW',
          failureProbability: 12,
          confidence: 94,
          estimatedTimeToFailure: '> 1,200 hours',
          modelType: 'MARKOV_RELIABILITY',
          contributingFactors: [
            { factor: 'Nominal Charge/Discharge Cycles', weightPercent: 60, trend: 'OSCILLATING' },
            { factor: 'Standard Aging Coefficient', weightPercent: 40, trend: 'FALLING' },
          ],
          consequenceSummary: 'Expected lifecycle degradation within 5-year mission lifespan margin.',
          mitigationProtocol: 'Continue nominal flight operations.',
        },
      ];
    }
  }

  // Explainable AI Evidence for the Primary Alert
  public getExplainableEvidence(): ExplainableEvidence {
    const frame = this.getLatestFrame();
    const scenario = this.state.scenario;

    if (scenario === 'BATTERY_DEGRADATION') {
      return {
        anomalyId: 'ANOM-01',
        subsystem: 'Battery Storage System',
        predictionTitle: 'Battery Degradation Risk = HIGH',
        confidenceScore: 84,
        attributionType: 'SHAP_VALUE_DECOMPOSITION',
        reasoningSteps: [
          {
            stage: 'OBSERVATION',
            title: 'Voltage Degradation Rate Exceeds Model',
            detail: 'Telemetry indicates bus voltage is dropping 2.8x faster than the calibrated 30-day baseline model.',
            metricDetail: `Current Voltage: ${frame.voltage} V (Baseline: 28.4 V)`,
          },
          {
            stage: 'EVIDENCE',
            title: 'Multi-Sensor Boundary Deviation',
            detail: '11.7% deviation from expected voltage range accompanied by +11.4°C thermal elevation and abnormal discharge slope.',
            metricDetail: `Deviation: 11.7% | Z-Score: -3.84σ | Temp: ${frame.temperature}°C`,
          },
          {
            stage: 'ANALYSIS',
            title: 'Electrochemical State Prediction',
            detail: 'Digital twin internal resistance estimator detected a +34 mΩ increase across Cell Bank 2, indicating localized electrolyte resistance.',
            metricDetail: 'Estimated Resistance: 142 mΩ vs 108 mΩ nominal',
          },
          {
            stage: 'RISK',
            title: 'Critical Mission Vulnerability',
            detail: 'High risk of cell group collapse during upcoming 36-minute eclipse pass where solar power will drop to zero.',
            metricDetail: 'Calculated Failure Risk: 73% within 18–26 hours',
          },
          {
            stage: 'RECOMMENDATION',
            title: 'Autonomous Mitigation Sequence',
            detail: 'Reduce non-critical payload power by 1.2 kW, adjust EPS charge regulator profile, and bias solar panel gimbal for maximum illumination.',
            metricDetail: 'Expected Recovery: Health restoration from 72% to 88% within 2 orbits',
          },
        ],
        evidenceWeights: [
          { factor: 'Voltage Instability & Negative Slope', percentage: 38, benchmark: 'Baseline: <0.02 V/hr drift' },
          { factor: 'Cell Temperature Gradient Increase', percentage: 25, benchmark: 'Baseline: <74.0 °C' },
          { factor: 'Excessive Depth of Discharge in Shadow', percentage: 21, benchmark: 'Baseline: <18% SoC drop' },
          { factor: 'Coulombic Charging Efficiency Loss', percentage: 16, benchmark: 'Baseline: 98.4% efficiency' },
        ],
      };
    } else {
      return {
        anomalyId: 'ANOM-T1',
        subsystem: 'Thermal System',
        predictionTitle: 'Thermal Stress Risk = CRITICAL',
        confidenceScore: 92,
        attributionType: 'PHYSICS_BOUND_VIOLATION',
        reasoningSteps: [
          {
            stage: 'OBSERVATION',
            title: 'Radiative Heat Transfer Gradient Deficit',
            detail: 'Core thermal sensors report heat accumulation not dissipating via primary radiators.',
            metricDetail: `Temp: ${frame.temperature} °C`,
          },
          {
            stage: 'EVIDENCE',
            title: 'Thermal Boundary Violation',
            detail: 'Exceeds maximum allowable flight qualification limit by 8.4°C.',
            metricDetail: 'Limit: 76.0 °C',
          },
          {
            stage: 'ANALYSIS',
            title: 'Loop Heat Pipe Vapor Lock Hypothesis',
            detail: 'Capillary wick dry-out detected on primary LHP circuit.',
          },
          {
            stage: 'RISK',
            title: 'Payload Component Damage',
            detail: 'Risk of sensor debonding and optical distortion.',
          },
          {
            stage: 'RECOMMENDATION',
            title: 'Emergency Thermal Maneuver',
            detail: 'Reorient spacecraft to point radiators directly towards deep space.',
          },
        ],
        evidenceWeights: [
          { factor: 'Temperature Runaway Rate', percentage: 48, benchmark: '> +0.4 °C/min' },
          { factor: 'Radiator Surface Efficiency', percentage: 32, benchmark: '< 240 W/m²' },
          { factor: 'Internal Load Dissipation', percentage: 20, benchmark: '> 4.2 kW' },
        ],
      };
    }
  }

  // Active Alerts
  public getAlerts(): MissionAlert[] {
    const frame = this.getLatestFrame();
    const scenario = this.state.scenario;
    const mitigated = this.state.mitigationActive;
    const acks = this.state.userAcknowledgedAlerts;
    const res = this.state.resolvedAlerts;

    const alerts: MissionAlert[] = [];

    if (scenario === 'BATTERY_DEGRADATION' && !mitigated) {
      alerts.push({
        id: 'ALT-101',
        timestamp: '14:32 UTC',
        subsystem: 'Battery System',
        subsystemId: 'battery',
        title: 'Battery voltage anomaly detected',
        parameter: 'Voltage',
        currentValue: `${frame.voltage} V`,
        expectedRange: '27.5 – 29.0 V',
        severity: 'HIGH',
        status: res.has('ALT-101') ? 'RESOLVED' : acks.has('ALT-101') ? 'ACKNOWLEDGED' : 'NEW',
        explanation: 'Voltage dropping 11.7% below baseline indicates potential cell group degradation or high internal resistance.',
        recommendedAction: 'Reduce non-critical power loads by 1.2 kW and configure conservative battery charge curve.',
      });

      alerts.push({
        id: 'ALT-102',
        timestamp: '14:28 UTC',
        subsystem: 'Thermal System',
        subsystemId: 'thermal',
        title: 'Thermal deviation warning',
        parameter: 'Temperature',
        currentValue: `${frame.temperature} °C`,
        expectedRange: '68.0 – 76.0 °C',
        severity: 'WARNING',
        status: res.has('ALT-102') ? 'RESOLVED' : acks.has('ALT-102') ? 'ACKNOWLEDGED' : 'INVESTIGATING',
        explanation: 'Core internal temperature is approaching the upper flight operating threshold due to battery thermal dissipation.',
        recommendedAction: 'Deploy auxiliary radiator louvers and bias sun angle.',
      });
    } else if (scenario === 'THERMAL_FAILURE' && !mitigated) {
      alerts.push({
        id: 'ALT-104',
        timestamp: '14:31 UTC',
        subsystem: 'Thermal System',
        subsystemId: 'thermal',
        title: 'CRITICAL: Severe Thermal Runaway',
        parameter: 'Core Temperature',
        currentValue: `${frame.temperature} °C`,
        expectedRange: '68.0 – 76.0 °C',
        severity: 'CRITICAL',
        status: res.has('ALT-104') ? 'RESOLVED' : acks.has('ALT-104') ? 'ACKNOWLEDGED' : 'NEW',
        explanation: 'Exceeds maximum allowable spacecraft thermal threshold. Imminent sensor damage.',
        recommendedAction: 'Execute emergency 180° spacecraft yaw maneuver and shed all non-vital systems.',
      });
    } else if (scenario === 'COMMUNICATION_LOSS' && !mitigated) {
      alerts.push({
        id: 'ALT-105',
        timestamp: '14:29 UTC',
        subsystem: 'Communication System',
        subsystemId: 'communication',
        title: 'Communication link degradation',
        parameter: 'Signal Margin / Latency',
        currentValue: `${frame.signalStrengthDb} dBm / ${frame.commLatencyMs} ms`,
        expectedRange: '>-80 dBm / <160 ms',
        severity: 'HIGH',
        status: res.has('ALT-105') ? 'RESOLVED' : acks.has('ALT-105') ? 'ACKNOWLEDGED' : 'NEW',
        explanation: 'RF link margin below safe demodulation threshold.',
        recommendedAction: 'Engage S-band high-power amplifier and switch ground station beacon.',
      });
    }

    // Nominal baseline alert
    alerts.push({
      id: 'ALT-103',
      timestamp: '14:10 UTC',
      subsystem: 'Communication System',
      subsystemId: 'communication',
      title: 'Communication nominal - Pass confirmed',
      parameter: 'Tracking Signal',
      currentValue: 'Carrier Lock OK',
      expectedRange: 'Locked',
      severity: 'INFO',
      status: 'RESOLVED',
      explanation: 'Ground station pass established via Svalbard Ground Station with nominal bit-error rate.',
      recommendedAction: 'Continue scheduled 50 Mbps science imagery dump.',
    });

    return alerts;
  }

  // Mission Timeline Events
  public getTimelineEvents(): MissionTimelineEvent[] {
    const scenario = this.state.scenario;
    const mitigated = this.state.mitigationActive;

    const baseEvents: MissionTimelineEvent[] = [
      {
        id: 'EVT-01',
        timeFormatted: '14:20:00 UTC',
        timestamp: Date.now() - 750000,
        title: 'Mission nominal telemetry baseline established',
        subsystem: 'avionics',
        severity: 'INFO',
        source: 'FLIGHT_COMPUTER',
        details: 'Orbit #1,429 entered. All 8 subsystems operating within verified qualification corridors.',
      },
    ];

    if (scenario === 'BATTERY_DEGRADATION') {
      baseEvents.push(
        {
          id: 'EVT-02',
          timeFormatted: '14:25:12 UTC',
          timestamp: Date.now() - 440000,
          title: 'Thermal gradient deviation detected on Battery Block 2',
          subsystem: 'thermal',
          severity: 'WARNING',
          source: 'AI_ENGINE',
          details: 'Digital twin model detected +2.4°C divergence between Cell Bank 1 and Bank 2.',
        },
        {
          id: 'EVT-03',
          timeFormatted: '14:28:44 UTC',
          timestamp: Date.now() - 240000,
          title: 'Anomaly ANOM-01 Flagged: Battery Voltage Negative Drift',
          subsystem: 'battery',
          severity: 'HIGH',
          source: 'AI_ENGINE',
          details: 'Voltage dropped below 27.5V baseline. Anomaly Score: 0.91 (Z-Score: -3.84).',
        },
        {
          id: 'EVT-04',
          timeFormatted: '14:31:02 UTC',
          timestamp: Date.now() - 100000,
          title: 'Predictive Failure Engine: Battery Failure Risk = 73% (HIGH)',
          subsystem: 'battery',
          severity: 'HIGH',
          source: 'AI_ENGINE',
          details: 'Failure window estimated at 18–26 flight hours. Root cause attributed to internal cell impedance.',
        },
        {
          id: 'EVT-05',
          timeFormatted: '14:32:15 UTC',
          timestamp: Date.now() - 40000,
          title: 'AI Recommendation Generated: Shed Non-Critical Power Loads',
          subsystem: 'power',
          severity: 'INFO',
          source: 'AI_ENGINE',
          details: 'Action protocol: Reduce payload power consumption by 1.2 kW to preserve eclipse energy margin.',
        }
      );

      if (mitigated) {
        baseEvents.push(
          {
            id: 'EVT-06',
            timeFormatted: '14:34:02 UTC',
            timestamp: Date.now() - 15000,
            title: 'Flight Engineer executed AI Recommendation',
            subsystem: 'power',
            severity: 'INFO',
            source: 'OPERATOR',
            details: 'Instruments A & C deactivated. Power draw reduced from 4.8 kW to 3.6 kW.',
            actionTaken: 'Autonomous load shed command uplinked.',
          },
          {
            id: 'EVT-07',
            timeFormatted: '14:36:20 UTC',
            timestamp: Date.now(),
            title: 'Subsystem Stabilized: Voltage Recovering to Nominal Corridor',
            subsystem: 'battery',
            severity: 'INFO',
            source: 'FLIGHT_COMPUTER',
            details: 'Battery voltage stabilized at 27.6V. Cell thermal gradient stopped rising. Health recovered to 86%.',
          }
        );
      }
    }

    return baseEvents;
  }

  // What-If Analysis Simulator Formula
  public computeWhatIf(params: WhatIfParams): WhatIfImpact {
    const frame = this.getLatestFrame();
    const currentBatt = frame.batteryPercent;
    const currentTemp = frame.temperature;
    const currentHealth = frame.healthScore;

    // Simulation Physics:
    // Temp increases with tempDelta, powerConsumptionDelta, and slightly with fuel consumption
    const simulatedTemp = Number(
      (currentTemp * (1 + params.tempDeltaPercent / 100) + (params.powerConsumptionDeltaPercent / 100) * 8.5).toFixed(1)
    );

    // Battery decreases with power consumption increase and solar generation decrease
    const powerDeficit = Number(
      ((params.powerConsumptionDeltaPercent / 100) * 4.8 - (params.solarGenerationDeltaPercent / 100) * 5.2).toFixed(2)
    );

    const battDrainFactor = (params.powerConsumptionDeltaPercent * 0.45) - (params.solarGenerationDeltaPercent * 0.4);
    const simulatedBattery = Math.max(
      8,
      Math.min(100, Number((currentBatt - battDrainFactor).toFixed(1)))
    );

    // Simulated health score calculation
    let healthPenalty = 0;
    if (simulatedTemp > 80) healthPenalty += (simulatedTemp - 80) * 1.8;
    if (simulatedBattery < 75) healthPenalty += (75 - simulatedBattery) * 1.2;
    if (params.fuelConsumptionDeltaPercent > 20) healthPenalty += params.fuelConsumptionDeltaPercent * 0.3;
    if (params.commLoadDeltaPercent > 30) healthPenalty += 6;

    const simulatedHealth = Math.max(25, Math.min(100, Math.round(currentHealth - healthPenalty)));

    let simulatedRisk: RiskLevel = 'LOW';
    if (simulatedHealth < 60 || simulatedTemp > 86 || simulatedBattery < 40) {
      simulatedRisk = 'CRITICAL';
    } else if (simulatedHealth < 75 || simulatedTemp > 80 || simulatedBattery < 65) {
      simulatedRisk = 'HIGH';
    } else if (simulatedHealth < 88) {
      simulatedRisk = 'MODERATE';
    }

    const baselineRisk: RiskLevel = currentHealth < 75 ? 'HIGH' : currentHealth < 88 ? 'MODERATE' : 'LOW';

    let primaryRiskSummary = 'Operating parameters remain within nominal mission margins.';
    if (simulatedRisk === 'CRITICAL') {
      primaryRiskSummary = 'CRITICAL: Severe risk of thermal runaway and eclipse power failure.';
    } else if (simulatedRisk === 'HIGH') {
      primaryRiskSummary = 'HIGH RISK: Subsystem thermal stress exceeds recommended 30-day endurance boundary.';
    } else if (simulatedRisk === 'MODERATE') {
      primaryRiskSummary = 'MODERATE: Accelerated battery degradation expected over 48 hours.';
    }

    return {
      baselineBatteryPercent: currentBatt,
      simulatedBatteryPercent: simulatedBattery,
      baselineTemp: currentTemp,
      simulatedTemp: simulatedTemp,
      baselineHealth: currentHealth,
      simulatedHealth: simulatedHealth,
      baselineRisk,
      simulatedRisk,
      primaryRiskSummary,
      marginViolationRisk: simulatedTemp > 82 || simulatedBattery < 50,
      powerDeficitKw: powerDeficit,
    };
  }
}

export const telemetryEngine = new TelemetryEngine();
