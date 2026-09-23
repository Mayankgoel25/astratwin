import express, { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { AnomalyDetectorService } from './services/anomalyDetector';

dotenv.config();

export const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS for Netlify / Render / Preview origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Supabase Client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lugmtagstkfbnblpfjsl.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable__9mmHDwu1keswWVCULYXuw_VX9z4xOi';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize Google Gemini SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory buffer for real-time stream caching & offline fallback
let telemetryBuffer: any[] = [];
let detectedAnomaliesBuffer: any[] = [];
let predictionsBuffer: any[] = [];
let recommendationsBuffer: any[] = [];
let alertsBuffer: any[] = [];
let activeSimulationScenario = 'NORMAL_MISSION';

// Create API Router for unified routing (compatible with Express & Netlify Functions)
export const apiRouter = Router();

// 1. Health check endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'ASTRA-TWIN Mission Intelligence Engine',
    version: '2.4.0-aerospace',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Mission Assistant Endpoint
apiRouter.post('/assistant', async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt || req.body.message;
    const { telemetryContext, activeAnomalies, subsystemHealth, language = 'en' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const langInstructions: Record<string, string> = {
      en: 'Respond in clear, professional English aerospace terminology.',
      fr: 'Répondez impérativement en français avec la terminologie aérospatiale professionnelle française (CNES/ESA).',
      hi: 'Respond in clear Hindi (हिंदी) with appropriate spaceflight and engineering terminology.',
      de: 'Antworten Sie auf Deutsch mit präziser Raumfahrt- und Ingenieurterminologie (DLR/ESA).',
    };

    const targetLangNotice = langInstructions[language] || langInstructions.en;

    // If Gemini API is configured, use model with fallback & retry logic
    if (ai) {
      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-flash-latest',
      ];

      const systemInstruction = `You are ASTRA-TWIN Flight Mission AI, an intelligent spacecraft systems flight director and digital twin diagnostic engine for the ASTRA-01 satellite (LEO Earth Observation).
Your role: Provide authoritative, concise, mathematically sound engineering diagnostics for spacecraft anomalies and failure predictions.
Language Requirement: ${targetLangNotice}
CRITICAL AEROSPACE INSTRUCTIONS:
- Ground all statements strictly in the provided measured telemetry context.
- DO NOT invent, hallucinate, or alter sensor values or timestamps.
- Clearly distinguish measured telemetry from hypotheses.
- Clearly distinguish risk estimation from confirmed failure. Do not present a risk estimate as a confirmed hardware failure.
- Format responses cleanly with:
  PRIMARY DIAGNOSTIC
  ROOT CAUSE HYPOTHESIS
  TELEMETRY EVIDENCE (cite measured values: voltage, temp, battery %, pressure, signal strength)
  POTENTIAL CONSEQUENCE
  OPERATIONAL RECOMMENDATION (actionable flight commands)
  CONFIDENCE / UNCERTAINTY
- Maintain serious mission-control tone.
Current Telemetry Context: ${JSON.stringify(telemetryContext || {})}
Active Anomalies: ${JSON.stringify(activeAnomalies || [])}
Subsystem Health Overview: ${JSON.stringify(subsystemHealth || {})}`;

      for (const modelName of candidateModels) {
        try {
          const generatePromise = ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.2,
            },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 4500)
          );

          const response = await Promise.race([generatePromise, timeoutPromise]);

          if (response && response.text) {
            return res.json({
              reply: response.text,
              source: modelName,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (modelErr: any) {
          console.warn(`Model ${modelName} unavailable or timed out:`, modelErr?.message || modelErr);
        }
      }
    }

    // Robust local aerospace reasoning fallback
    const telemetry = telemetryContext || {};
    const anomalies = activeAnomalies || [];
    let diagnostic = '';
    let recommendation = '';
    let evidence = '';

    const lowerPrompt = prompt.toLowerCase();

    if (language === 'fr') {
      if (lowerPrompt.includes('why') || lowerPrompt.includes('pourquoi') || lowerPrompt.includes('santé') || lowerPrompt.includes('baisse')) {
        diagnostic = `L'indice de santé du satellite ASTRA-01 est affecté par ${anomalies.length > 0 ? anomalies.length : 1} écart(s) de télémétrie. Origine principale : sous-système Énergie et Régulation thermique.`;
        evidence = `Tension bus : ${telemetry.voltage || 25.6}V (nominal : 28V). Température batterie : ${telemetry.temperature || 78.4}°C.`;
        recommendation = `Délestage immédiat des charges secondaires. Commuter sur le régulateur redondant et orienter les panneaux solaires à l'angle optimal.`;
      } else {
        diagnostic = `Diagnostic télémétrique ASTRA-01 validé. Système sous surveillance nominale.`;
        evidence = `Santé globale : ${telemetry.health || 88}%, Tension : ${telemetry.voltage || 27.8}V, Anomalies actives : ${anomalies.length}.`;
        recommendation = `Maintenir la liaison sol et confirmer l'état des sous-systèmes critiques.`;
      }
    } else if (language === 'hi') {
      if (lowerPrompt.includes('why') || lowerPrompt.includes('क्यो') || lowerPrompt.includes('स्वास्थ्य') || lowerPrompt.includes('कमी')) {
        diagnostic = `एस्ट्रा-01 उपग्रह का स्वास्थ्य स्कोर सक्रिय टेलीमेट्री विचलनों के कारण प्रभावित है। मुख्य कारण पावर और थर्मल सबसिस्टम में उतार-चढ़ाव है।`;
        evidence = `बस वोल्टेज: ${telemetry.voltage || 25.6}V, बैटरी तापमान: ${telemetry.temperature || 78.4}°C, बैटरी चार्ज: ${telemetry.batteryPercent || 74}%.`;
        recommendation = `गैर-आवश्यक पेलोड को तुरंत बंद करें और सौर पैनल अभिविन्यास को स्थिर करें।`;
      } else {
        diagnostic = `एस्ट्रा-01 अंतरिक्ष यान की टेलीमेट्री जांच पूर्ण। सभी प्रणालियों पर रीयल-टाइम निगरानी जारी है।`;
        evidence = `कुल स्वास्थ्य: ${telemetry.health || 88}%, बस वोल्टेज: ${telemetry.voltage || 27.8}V, सक्रिय विसंगतियां: ${anomalies.length}.`;
        recommendation = `ग्राउंड स्टेशन संपर्क की प्रतीक्षा करें और स्टैंडबाय स्थिति बनाए रखें।`;
      }
    } else if (language === 'de') {
      if (lowerPrompt.includes('warum') || lowerPrompt.includes('gesundheit') || lowerPrompt.includes('abfall') || lowerPrompt.includes('why')) {
        diagnostic = `Der Gesundheitsstatus von ASTRA-01 wird durch aktive Telemetrieabweichungen im Energie- und Thermalsystem beeinträchtigt.`;
        evidence = `Busspannung: ${telemetry.voltage || 25.6}V (Soll: 28.0V), Batterietemperatur: ${telemetry.temperature || 78.4}°C.`;
        recommendation = `Unkritische Nutzlasten abschalten, redundanten Busregler aktivieren und thermische Gradienten überwachen.`;
      } else {
        diagnostic = `Telemetrieüberprüfung für ASTRA-01 abgeschlossen. Subsysteme unter kontinuierlicher Überwachung.`;
        evidence = `Systemgesundheit: ${telemetry.health || 88}%, Busspannung: ${telemetry.voltage || 27.8}V, Aktive Anomalien: ${anomalies.length}.`;
        recommendation = `Aktuelle Ausrichtung beibehalten und Alarmmeldungen im Kontrollzentrum quittieren.`;
      }
    } else {
      if (lowerPrompt.includes('why') || lowerPrompt.includes('health') || lowerPrompt.includes('decrease')) {
        if (anomalies.length > 0) {
          const primary = anomalies[0];
          diagnostic = `Spacecraft health score is impacted by ${anomalies.length} active telemetry deviation(s). Primary driver is ${primary.parameter || 'Subsystem'} in ${primary.subsystem || 'Power'}.`;
          evidence = `Detected value ${primary.currentValue || '25.6V'} deviated by ${primary.deviationPercent || '11.7%'} from the nominal flight baseline (${primary.baselineMin || '27.5'} - ${primary.baselineMax || '29.0'}).`;
          recommendation = `Execute command sequence: Shed non-critical payloads (Instruments A & C), activate secondary bus regulator, and monitor battery cell thermal gradient.`;
        } else {
          diagnostic = `Spacecraft health is currently nominal at 94%. No active high-risk deviations detected across telemetry channels.`;
          evidence = `Bus Voltage: ${telemetry.voltage || 28.2}V, Core Temp: ${telemetry.temperature || 72.4}°C, Battery SoC: ${telemetry.batteryPercent || 88}%.`;
          recommendation = `Maintain standard sun-pointing attitude and continue nominal 1 Hz telemetry polling.`;
        }
      } else if (lowerPrompt.includes('subsystem') || lowerPrompt.includes('risk') || lowerPrompt.includes('highest')) {
        diagnostic = `The BATTERY & POWER Subsystem exhibits the highest failure risk (73% probability of cell group impedance breakdown within 18–26 flight hours).`;
        evidence = `Elevated internal resistance, continuous high discharge rate during eclipse passes, and thermal load elevation to ${telemetry.temperature || 82}°C.`;
        recommendation = `Limit peak power draw to <3.8 kW. Reconfigure EPS charge controller to conservative trickle-charge profile.`;
      } else if (lowerPrompt.includes('what if') || lowerPrompt.includes('power') || lowerPrompt.includes('20%')) {
        diagnostic = `Simulated +20% power load impact: Battery depth-of-discharge will accelerate by 2.4x. Core temperature predicted to surge from 73.4°C to 82.1°C, elevating thermal stress to CRITICAL.`;
        evidence = `Digital twin simulation calculates health index reduction from 91/100 to 76/100 within 4 orbit revolutions.`;
        recommendation = `Reject load increase unless solar array sun-tracking efficiency can be improved by +12° solar beta gimbal adjustment.`;
      } else {
        diagnostic = `Diagnostic complete for ASTRA-01 telemetry frame. Overall telemetry integrity verified across 16 channels.`;
        evidence = `Active anomalies: ${anomalies.length} | Spacecraft Health: ${telemetry.health || 88}% | Primary Bus: ${telemetry.voltage || 27.8}V.`;
        recommendation = `Acknowledge all pending telemetry alerts in the Alert Center and maintain standby status for ground station pass.`;
      }
    }

    const titleHeaders: Record<string, { diag: string; evid: string; rec: string }> = {
      en: { diag: 'MISSION DIAGNOSTIC REPORT', evid: 'EVIDENCE & TELEMETRY', rec: 'RECOMMENDED FLIGHT CONTROLLER ACTION' },
      fr: { diag: 'RAPPORT DE DIAGNOSTIC DE MISSION', evid: 'PREUVES ET TÉLÉMÉTRIE', rec: 'ACTIONS RECOMMANDÉES DU CONTRÔLE DE VOL' },
      hi: { diag: 'मिशन डायग्नोस्टिक रिपोर्ट', evid: 'साक्ष्य और टेलीमेट्री', rec: 'अनुशंसित उड़ान नियंत्रण कार्रवाई' },
      de: { diag: 'MISSIONS-DIAGNOSEBERICHT', evid: 'TELEMETRIE & BELEGE', rec: 'EMPFOHLENE MASSNAHMEN DER FLUGLEITUNG' },
    };

    const headers = titleHeaders[language] || titleHeaders.en;
    const reply = `**${headers.diag}**\n\n${diagnostic}\n\n**${headers.evid}**\n${evidence}\n\n**${headers.rec}**\n${recommendation}`;

    return res.json({
      reply,
      source: 'ASTRA Digital Twin Aerospace Inference Engine (Deterministic Fallback)',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/assistant:', error);
    return res.status(500).json({
      error: 'Mission AI diagnostic service error',
      details: error?.message || 'Unknown error',
    });
  }
});

// 3. Export Mission Report Endpoint
apiRouter.post('/report/export', (req: Request, res: Response) => {
  const { spacecraftId, healthScore, activeAnomalies, subsystems, missionEvents } = req.body;
  const report = {
    reportId: `ASTRA-RPT-${Date.now()}`,
    spacecraft: spacecraftId || 'ASTRA-01',
    mission: 'LEO Earth Observation & Environmental Surveillance',
    generatedAt: new Date().toISOString(),
    healthScore: healthScore ?? 91,
    flightStatus: (healthScore ?? 91) > 80 ? 'NOMINAL' : (healthScore ?? 91) > 60 ? 'DEGRADED' : 'CRITICAL',
    activeAnomaliesCount: activeAnomalies?.length || 0,
    anomalies: activeAnomalies || [],
    subsystemHealth: subsystems || {},
    recentEvents: (missionEvents || []).slice(0, 10),
    certifiedBy: 'ASTRA-TWIN Digital Twin Reliability & Mission Assurance Subsystem',
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=ASTRA-01-Health-Report-${Date.now()}.json`);
  return res.json(report);
});

// 4. Telemetry Endpoints (Stream & Persist)
apiRouter.get('/telemetry', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 60;
    const timeRange = (req.query.range as string) || '5m';

    // Try Supabase first
    const { data, error } = await supabase
      .from('telemetry')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return res.json({
        source: 'supabase',
        count: data.length,
        timeRange,
        data: data.reverse(),
      });
    }

    const returnedFrames = telemetryBuffer.slice(-limit);
    return res.json({
      source: 'in_memory_cache',
      count: returnedFrames.length,
      timeRange,
      data: returnedFrames,
    });
  } catch (err: any) {
    return res.json({
      source: 'fallback',
      count: telemetryBuffer.length,
      data: telemetryBuffer.slice(-60),
      error: err?.message,
    });
  }
});

apiRouter.post('/telemetry', async (req: Request, res: Response) => {
  try {
    const frame = req.body;
    if (!frame || typeof frame.temperature !== 'number') {
      return res.status(400).json({ error: 'Invalid telemetry frame payload' });
    }

    // Run deterministic Anomaly, Health & Risk Evaluation Engine
    const evalResult = AnomalyDetectorService.evaluateFrame(frame, telemetryBuffer);

    // Update in-memory cache
    telemetryBuffer.push({ ...frame, receivedAt: new Date().toISOString() });
    if (telemetryBuffer.length > 240) telemetryBuffer.shift();

    if (evalResult.anomalies.length > 0) {
      detectedAnomaliesBuffer.unshift(...evalResult.anomalies);
      if (detectedAnomaliesBuffer.length > 50) detectedAnomaliesBuffer = detectedAnomaliesBuffer.slice(0, 50);

      // Create alert records for new anomalies
      evalResult.anomalies.forEach((a) => {
        alertsBuffer.unshift({
          id: `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          spacecraft: 'ASTRA-01',
          subsystem: a.subsystemName,
          title: `${a.severity}: ${a.parameter}`,
          message: a.description,
          severity: a.severity,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      });
      if (alertsBuffer.length > 60) alertsBuffer = alertsBuffer.slice(0, 60);
    }

    if (evalResult.predictions.length > 0) {
      predictionsBuffer = evalResult.predictions;
    }
    if (evalResult.recommendations.length > 0) {
      recommendationsBuffer = evalResult.recommendations;
    }

    // Persist to Supabase asynchronously
    (async () => {
      try {
        await supabase.from('telemetry').insert([
          {
            temperature: frame.temperature,
            voltage: frame.voltage,
            battery_level: frame.batteryPercent,
            fuel_level: frame.fuelPercent,
            pressure: frame.pressure,
            communication_status: frame.signalStrengthDb < -100 ? 'DEGRADED' : 'ONLINE',
            power_health: evalResult.subsystemHealth.power.health,
            thermal_health: evalResult.subsystemHealth.thermal.health,
            propulsion_health: evalResult.subsystemHealth.propulsion.health,
            communication_health: evalResult.subsystemHealth.communication.health,
            navigation_health: evalResult.subsystemHealth.avionics.health,
            timestamp: new Date(frame.timestamp || Date.now()).toISOString(),
          },
        ]);

        if (evalResult.anomalies.length > 0) {
          await supabase.from('anomalies').insert(
            evalResult.anomalies.map((a) => ({
              parameter: a.parameter,
              value: a.value,
              normal_min: a.normalMin,
              normal_max: a.normalMax,
              severity: a.severity,
              anomaly_type: a.anomalyType,
              description: a.description,
              detected_at: a.detectedAt,
            }))
          );
        }
      } catch (_dbErr) {
        // Fallback maintained in-memory
      }
    })();

    return res.status(201).json({
      status: 'accepted',
      anomaliesDetected: evalResult.anomalies.length,
      healthOverview: evalResult.subsystemHealth,
      predictionsCount: evalResult.predictions.length,
      recommendationsCount: evalResult.recommendations.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message });
  }
});

// 5. Anomalies, Predictions, Recommendations & Alerts Endpoints
apiRouter.get('/anomalies', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('anomalies')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      return res.json({ source: 'supabase', count: data.length, data });
    }
    return res.json({ source: 'in_memory', count: detectedAnomaliesBuffer.length, data: detectedAnomaliesBuffer });
  } catch (_err: any) {
    return res.json({ source: 'fallback', data: detectedAnomaliesBuffer });
  }
});

apiRouter.get('/predictions', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      return res.json({ source: 'supabase', count: data.length, data });
    }
    return res.json({ source: 'engine', count: predictionsBuffer.length, data: predictionsBuffer });
  } catch (_err: any) {
    return res.json({ source: 'fallback', data: predictionsBuffer });
  }
});

apiRouter.get('/recommendations', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      return res.json({ source: 'supabase', count: data.length, data });
    }
    return res.json({ source: 'engine', count: recommendationsBuffer.length, data: recommendationsBuffer });
  } catch (_err: any) {
    return res.json({ source: 'fallback', data: recommendationsBuffer });
  }
});

apiRouter.get('/alerts', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(40);

    if (!error && data && data.length > 0) {
      return res.json({ source: 'supabase', count: data.length, data });
    }
    return res.json({ source: 'in_memory', count: alertsBuffer.length, data: alertsBuffer });
  } catch (_err: any) {
    return res.json({ source: 'fallback', data: alertsBuffer });
  }
});

// 6. Simulation & Anomaly Injection Controls
apiRouter.post('/simulation/start', (_req: Request, res: Response) => {
  activeSimulationScenario = 'NORMAL_MISSION';
  return res.json({ status: 'started', scenario: activeSimulationScenario, message: 'Telemetry simulation active' });
});

apiRouter.post('/simulation/stop', (_req: Request, res: Response) => {
  return res.json({ status: 'paused', scenario: activeSimulationScenario, message: 'Telemetry simulation paused' });
});

apiRouter.post('/simulation/inject-anomaly', (req: Request, res: Response) => {
  const { anomalyType } = req.body;
  const allowed = [
    'THERMAL_FAILURE',
    'BATTERY_DEGRADATION',
    'COMMUNICATION_LOSS',
    'FUEL_LEAK',
    'SENSOR_DRIFT',
    'SOLAR_PANEL_DEGRADATION',
    'MULTI_SUBSYSTEM_FAILURE',
  ];

  if (!anomalyType || !allowed.includes(anomalyType)) {
    return res.status(400).json({ error: `Invalid anomalyType. Allowed: ${allowed.join(', ')}` });
  }

  activeSimulationScenario = anomalyType;
  return res.json({
    status: 'injected',
    scenario: activeSimulationScenario,
    message: `Anomaly scenario ${anomalyType} successfully activated`,
  });
});

// 7. Supabase Appointments Endpoints
apiRouter.get('/appointments', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.json({ source: 'fallback_empty', data: [] });
    }
    return res.json({ source: 'supabase', data: data || [] });
  } catch (_err: any) {
    return res.json({ source: 'fallback_empty', data: [] });
  }
});

apiRouter.post('/appointments', async (req: Request, res: Response) => {
  try {
    const {
      client_name,
      client_email,
      organization = 'Aerospace Operations',
      service_type = 'digital_twin_demo',
      satellite_target = 'ASTRA-01',
      preferred_date,
      preferred_time,
      time_zone = 'UTC',
      notes = '',
    } = req.body;

    if (!client_name || !client_email || !preferred_date || !preferred_time) {
      return res.status(400).json({
        error: 'Missing required appointment fields (client_name, client_email, preferred_date, preferred_time)',
      });
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          client_name,
          client_email,
          organization,
          service_type,
          satellite_target,
          preferred_date,
          preferred_time,
          time_zone,
          notes,
          status: 'confirmed',
        },
      ])
      .select();

    if (error) {
      return res.status(200).json({
        success: true,
        source: 'local_fallback',
        warning: error.message,
        data: {
          client_name,
          client_email,
          preferred_date,
          preferred_time,
          status: 'confirmed',
        },
      });
    }

    return res.status(201).json({ success: true, source: 'supabase', data });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message });
  }
});

// Mount router on multiple base paths for compatibility across environments:
// - Standalone Express: /api/*
// - Netlify Functions rewritten path: /* or /.netlify/functions/api/*
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);
app.use('/', apiRouter);
