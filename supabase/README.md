# ASTRA-TWIN Supabase Database Architecture & Setup

This directory contains the database schema, security rules, and setup instructions for **ASTRA-TWIN Spacecraft Digital Twin**.

## Connected Project

- **Supabase Project URL**: `https://lugmtagstkfbnblpfjsl.supabase.co`
- **Supabase Project ID**: `lugmtagstkfbnblpfjsl`
- **Client Library**: `@supabase/supabase-js`

---

## Complete Pipeline Data Flow

```
SPACECRAFT SIMULATION (telemetryEngine.ts)
        ↓
TELEMETRY GENERATION (Voltage, Temp, Battery, Pressure, Subsystems)
        ↓
SUPABASE DATABASE (public.telemetry)
        ↓
ANOMALY DETECTION (Thresholds, Rate-of-Change, Moving Averages)
        ↓
SUPABASE ANOMALIES (public.anomalies)
        ↓
SUBSYSTEM HEALTH ANALYSIS (Power, Thermal, Propulsion, Comm, Nav)
        ↓
FAILURE RISK PREDICTION (Deterministic failure probability & evidence)
        ↓
SUPABASE PREDICTIONS (public.predictions)
        ↓
GEMINI 1.5/2.5 EXPLANATION (Grounded in telemetry numbers, no hallucinations)
        ↓
RECOMMENDATIONS (public.recommendations)
        ↓
MISSION ALERTS (public.alerts)
        ↓
ENGINEER DASHBOARD (MissionDashboard, Digital Twin Viewer, Telemetry Charts)
```

---

## Setup Instructions

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/lugmtagstkfbnblpfjsl](https://supabase.com/dashboard/project/lugmtagstkfbnblpfjsl)
2. Go to **SQL Editor** in the left navigation.
3. Click **New Query** and copy-paste the entire contents of `supabase/schema.sql`.
4. Click **Run** to provision the tables, indexes, and Row Level Security (RLS) policies.

---

## Tables Overview

| Table | Purpose | RLS Status |
|---|---|---|
| `public.spacecraft` | Spacecraft registry (ASTRA-01, mission name, status) | Enabled, Public Select |
| `public.telemetry` | Time-series telemetry frames (voltage, temp, battery, etc.) | Enabled, Select/Insert |
| `public.anomalies` | Detected parameter excursions, z-scores, and severities | Enabled, Select/Insert |
| `public.predictions` | Failure risk predictions with contributing weights & confidence | Enabled, Select/Insert |
| `public.recommendations` | Operational mitigations & recovery procedures | Enabled, Select/Insert |
| `public.alerts` | Mission annunciator queue for flight engineers | Enabled, Select/Insert/Update |
| `public.appointments` | Flight audits and mission consultations | Enabled, Select/Insert |

---

## Environment Variables

Defined in `.env.example`:

```env
# Gemini API Key for Explainable AI
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# Supabase Server-Side
SUPABASE_URL="https://lugmtagstkfbnblpfjsl.supabase.co"
SUPABASE_KEY="sb_publishable__9mmHDwu1keswWVCULYXuw_VX9z4xOi"

# Supabase Frontend (Vite)
VITE_SUPABASE_URL="https://lugmtagstkfbnblpfjsl.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable__9mmHDwu1keswWVCULYXuw_VX9z4xOi"
```
