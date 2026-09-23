-- =====================================================================
-- ASTRA-TWIN SPACECRAFT DIGITAL TWIN: DATABASE SCHEMA MIGRATION
-- Project Target: Supabase PostgreSQL (Project ID: lugmtagstkfbnblpfjsl)
-- Pipeline: Spacecraft -> Telemetry -> Anomalies -> Predictions -> Recommendations -> Alerts
-- =====================================================================

-- 1. SPACECRAFT TABLE
CREATE TABLE IF NOT EXISTS public.spacecraft (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  mission_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DEGRADED, SAFE_MODE, DECOMMISSIONED
  launch_date TIMESTAMPTZ DEFAULT '2025-11-14T08:30:00Z',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Seed default primary spacecraft
INSERT INTO public.spacecraft (name, mission_name, status, launch_date)
VALUES ('ASTRA-01', 'LEO Earth Observation & Environmental Surveillance', 'ACTIVE', '2025-11-14T08:30:00Z')
ON CONFLICT (name) DO NOTHING;

-- 2. TELEMETRY TABLE (Historical Stream & Real-time Persistence)
CREATE TABLE IF NOT EXISTS public.telemetry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spacecraft_id UUID REFERENCES public.spacecraft(id) ON DELETE CASCADE,
  temperature NUMERIC(6,2) NOT NULL, -- Core temp in °C
  voltage NUMERIC(6,2) NOT NULL,     -- Bus voltage in V
  battery_level NUMERIC(5,2) NOT NULL, -- State of Charge in %
  fuel_level NUMERIC(5,2) NOT NULL,    -- Propellant in %
  pressure NUMERIC(6,2) NOT NULL,      -- Internal/thruster pressure in kPa
  communication_status TEXT NOT NULL DEFAULT 'ONLINE', -- ONLINE, DEGRADED, OFFLINE
  power_health NUMERIC(5,2) DEFAULT 95.00,
  thermal_health NUMERIC(5,2) DEFAULT 95.00,
  propulsion_health NUMERIC(5,2) DEFAULT 98.00,
  communication_health NUMERIC(5,2) DEFAULT 96.00,
  navigation_health NUMERIC(5,2) DEFAULT 99.00,
  timestamp TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_telemetry_spacecraft_id ON public.telemetry(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON public.telemetry(timestamp DESC);

-- 3. ANOMALIES TABLE
CREATE TABLE IF NOT EXISTS public.anomalies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spacecraft_id UUID REFERENCES public.spacecraft(id) ON DELETE CASCADE,
  telemetry_id UUID REFERENCES public.telemetry(id) ON DELETE SET NULL,
  parameter TEXT NOT NULL,
  value NUMERIC(10,2) NOT NULL,
  normal_min NUMERIC(10,2) NOT NULL,
  normal_max NUMERIC(10,2) NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  anomaly_type TEXT NOT NULL, -- THRESHOLD_VIOLATION, RATE_OF_CHANGE, STATISTICAL_Z, RUNAWAY
  description TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  resolved BOOLEAN DEFAULT false NOT NULL,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_anomalies_spacecraft ON public.anomalies(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_detected ON public.anomalies(detected_at DESC);

-- 4. PREDICTIONS TABLE (Transparent Failure Risk Engine)
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spacecraft_id UUID REFERENCES public.spacecraft(id) ON DELETE CASCADE,
  subsystem TEXT NOT NULL, -- Power, Thermal, Propulsion, Communication, Navigation, Battery
  failure_type TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  risk_score NUMERIC(5,2) NOT NULL, -- 0 to 100
  confidence NUMERIC(5,2) NOT NULL, -- Deterministic calculation confidence 0 to 100
  predicted_time TEXT NOT NULL,     -- e.g. "18–26 hours" or ISO duration
  evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'ACTIVE',      -- ACTIVE, MITIGATED, RESOLVED
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_predictions_spacecraft ON public.predictions(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created ON public.predictions(created_at DESC);

-- 5. RECOMMENDATIONS TABLE (Operational Mitigation Protocols)
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_id UUID REFERENCES public.predictions(id) ON DELETE CASCADE,
  spacecraft_id UUID REFERENCES public.spacecraft(id) ON DELETE CASCADE,
  priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  recommendation TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'PENDING' -- PENDING, APPLIED, DISMISSED
);

CREATE INDEX IF NOT EXISTS idx_recommendations_created ON public.recommendations(created_at DESC);

-- 6. ALERTS TABLE (Mission Annunciator Queue)
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spacecraft_id UUID REFERENCES public.spacecraft(id) ON DELETE CASCADE,
  anomaly_id UUID REFERENCES public.anomalies(id) ON DELETE SET NULL,
  prediction_id UUID REFERENCES public.predictions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_alerts_spacecraft ON public.alerts(spacecraft_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON public.alerts(created_at DESC);

-- 7. APPOINTMENTS TABLE (Consultation & Flight Audits)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  organization TEXT,
  service_type TEXT NOT NULL,
  satellite_target TEXT DEFAULT 'ASTRA-01',
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  time_zone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed'
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.spacecraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for demonstrator/flight engineer client
DO $$ 
BEGIN
  -- Spacecraft policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'spacecraft' AND policyname = 'Public select spacecraft') THEN
    CREATE POLICY "Public select spacecraft" ON public.spacecraft FOR SELECT USING (true);
  END IF;

  -- Telemetry policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'telemetry' AND policyname = 'Public select telemetry') THEN
    CREATE POLICY "Public select telemetry" ON public.telemetry FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'telemetry' AND policyname = 'Public insert telemetry') THEN
    CREATE POLICY "Public insert telemetry" ON public.telemetry FOR INSERT WITH CHECK (true);
  END IF;

  -- Anomalies policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'anomalies' AND policyname = 'Public select anomalies') THEN
    CREATE POLICY "Public select anomalies" ON public.anomalies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'anomalies' AND policyname = 'Public insert anomalies') THEN
    CREATE POLICY "Public insert anomalies" ON public.anomalies FOR INSERT WITH CHECK (true);
  END IF;

  -- Predictions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'predictions' AND policyname = 'Public select predictions') THEN
    CREATE POLICY "Public select predictions" ON public.predictions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'predictions' AND policyname = 'Public insert predictions') THEN
    CREATE POLICY "Public insert predictions" ON public.predictions FOR INSERT WITH CHECK (true);
  END IF;

  -- Recommendations policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recommendations' AND policyname = 'Public select recommendations') THEN
    CREATE POLICY "Public select recommendations" ON public.recommendations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recommendations' AND policyname = 'Public insert recommendations') THEN
    CREATE POLICY "Public insert recommendations" ON public.recommendations FOR INSERT WITH CHECK (true);
  END IF;

  -- Alerts policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'alerts' AND policyname = 'Public select alerts') THEN
    CREATE POLICY "Public select alerts" ON public.alerts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'alerts' AND policyname = 'Public insert alerts') THEN
    CREATE POLICY "Public insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'alerts' AND policyname = 'Public update alerts') THEN
    CREATE POLICY "Public update alerts" ON public.alerts FOR UPDATE USING (true);
  END IF;

  -- Appointments policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Allow public select') THEN
    CREATE POLICY "Allow public select" ON public.appointments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Allow public insert') THEN
    CREATE POLICY "Allow public insert" ON public.appointments FOR INSERT WITH CHECK (true);
  END IF;
END $$;
