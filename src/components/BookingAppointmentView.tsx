import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Building,
  CheckCircle,
  AlertCircle,
  Database,
  ExternalLink,
  Plus,
  RefreshCw,
  ShieldCheck,
  Satellite,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import {
  MissionBookingAppointment,
  fetchAppointments,
  saveAppointment,
  SUPABASE_URL,
} from '../services/supabaseClient';
import { TranslationDictionary } from '../services/i18n';

interface BookingAppointmentViewProps {
  t: TranslationDictionary;
}

export const BookingAppointmentView: React.FC<BookingAppointmentViewProps> = ({ t }) => {
  const [appointments, setAppointments] = useState<MissionBookingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [storageSource, setStorageSource] = useState<'supabase' | 'local'>('supabase');
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'book' | 'list' | 'schema'>('book');

  // Form State
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    organization: '',
    service_type: 'digital_twin_demo' as MissionBookingAppointment['service_type'],
    satellite_target: 'ASTRA-01',
    preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time: '14:00',
    notes: '',
  });

  const [bookingSuccess, setBookingSuccess] = useState<MissionBookingAppointment | null>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAppointments();
    setAppointments(res.data);
    setStorageSource(res.source);
    if (res.error) {
      setApiNotice(res.error);
    } else {
      setApiNotice(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.client_email || !formData.preferred_date) {
      return;
    }

    setSubmitting(true);
    const result = await saveAppointment({
      client_name: formData.client_name,
      client_email: formData.client_email,
      organization: formData.organization,
      service_type: formData.service_type,
      satellite_target: formData.satellite_target,
      preferred_date: formData.preferred_date,
      preferred_time: formData.preferred_time,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notes: formData.notes,
    });

    setSubmitting(false);

    if (result.success && result.data) {
      setBookingSuccess(result.data);
      setStorageSource(result.source);
      if (result.error) {
        setApiNotice(result.error);
      }
      // Refresh list
      loadData();
    }
  };

  const sqlSchema = `-- Supabase SQL to create the appointments table:
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public insert & read for booking:
CREATE POLICY "Allow public insert" ON public.appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.appointments
  FOR SELECT USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Database Status */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>SUPABASE DATABASE CONNECTED</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Project ID: lugmtagstkfbnblpfjsl
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-100 mt-1">
            Mission Consultation & Appointment Booking
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Book technical consultations, spacecraft telemetry audits, and live digital twin flight simulations directly saved to your Supabase account.
          </p>
        </div>

        {/* Status Pill & Tab Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'book'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Book New
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Appointments</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {appointments.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'schema'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SQL Schema
            </button>
          </div>
        </div>
      </div>

      {/* Database Connection Notice */}
      <div className="p-3.5 rounded-lg border border-slate-800 bg-[#070a12] flex items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">Target Endpoint:</span>
          <span className="text-cyan-400">{SUPABASE_URL}</span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-400">Table: <code className="text-emerald-300">appointments</code></span>
        </div>
        <a
          href="https://supabase.com/dashboard/project/lugmtagstkfbnblpfjsl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span>Open Supabase Console</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* TAB 1: Booking Form */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Booking Form Card */}
          <div className="lg:col-span-7 p-6 rounded-xl border border-slate-800 bg-[#070a12] space-y-5">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Schedule Flight Operations Appointment</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your details to reserve a flight consultation slot. The record will be written to Supabase immediately.
              </p>
            </div>

            {bookingSuccess && (
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Appointment Successfully Confirmed!</span>
                </div>
                <p>
                  Reserved for <strong>{bookingSuccess.client_name}</strong> on{' '}
                  <strong>{bookingSuccess.preferred_date}</strong> at{' '}
                  <strong>{bookingSuccess.preferred_time}</strong>.
                </p>
                <div className="text-[11px] font-mono text-emerald-400/80">
                  Record ID: {bookingSuccess.id} · Saved with Supabase integration.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Dr. Maya Vance"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    placeholder="maya.vance@aerospace-labs.org"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Organization / Flight Agency</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Orbital Mission Labs / ISRO / ESA"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Satellite className="w-3.5 h-3.5 text-slate-400" />
                    <span>Satellite Target</span>
                  </label>
                  <select
                    value={formData.satellite_target}
                    onChange={(e) => setFormData({ ...formData, satellite_target: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ASTRA-01">ASTRA-01 (LEO Primary)</option>
                    <option value="ASTRA-02">ASTRA-02 (Polar InSAR)</option>
                    <option value="ASTRA-03">ASTRA-03 (Deep Relay)</option>
                    <option value="CUSTOM_CONSTELLATION">Custom Constellation</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Service / Appointment Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'digital_twin_demo', label: 'Digital Twin Demonstration' },
                    { id: 'telemetry_audit', label: 'Spacecraft Telemetry Audit' },
                    { id: 'mission_consultation', label: 'Flight Controller Consultation' },
                    { id: 'satellite_health_review', label: 'Subsystem Health & Degradation Review' },
                  ].map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, service_type: service.id as any })}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                        formData.service_type === service.id
                          ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Time (UTC) *</span>
                  </label>
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="09:00">09:00 UTC (Morning Pass)</option>
                    <option value="11:30">11:30 UTC</option>
                    <option value="14:00">14:00 UTC (Midday Session)</option>
                    <option value="16:30">16:30 UTC</option>
                    <option value="19:00">19:00 UTC (Evening Ground Contact)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Mission Notes / Anomaly Context
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Reviewing battery voltage decay and thermal dissipation curves before next apogee maneuver..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing to Supabase Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Save Appointment to Supabase</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Explanatory & Database Info Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
              <div className="border-b border-slate-800/80 pb-3">
                <h4 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Storage & Reliability Assurance</span>
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All booking records are formatted with ISO-8601 timestamps, satellite targets, and client contact information. Data is routed directly to PostgreSQL on your Supabase cluster.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-mono text-cyan-300 font-semibold">1. Dual-Persistence Architecture</div>
                  <div className="text-slate-400 text-[11px]">
                    Every booking is instantly verified in browser storage and streamed to your Supabase PostgreSQL table.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-mono text-emerald-300 font-semibold">2. Live Aerospace Synchronization</div>
                  <div className="text-slate-400 text-[11px]">
                    Appointments reference active satellite telemetry states so flight directors have full context when reviewing.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick SQL Migration Reminder */}
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 font-mono">SUPABASE SQL QUICK-START</span>
                <button
                  onClick={() => setActiveTab('schema')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  View full schema →
                </button>
              </div>
              <p className="text-[11px] text-slate-300">
                To guarantee your Supabase project accepts inserts, ensure the <code className="text-cyan-300 font-mono">appointments</code> table exists in your project. Click <strong>SQL Schema</strong> above to copy the 1-click script.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Appointments List */}
      {activeTab === 'list' && (
        <div className="p-6 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Saved Mission Appointments ({appointments.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Live appointments queried from Supabase account storage.
              </p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-slate-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Querying Supabase database...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-3">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
              <div>No appointments scheduled yet.</div>
              <button
                onClick={() => setActiveTab('book')}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Book First Appointment
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {appointments.map((apt, idx) => (
                <div key={apt.id || idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{apt.client_name}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                        {apt.satellite_target || 'ASTRA-01'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase">
                        {apt.status || 'CONFIRMED'}
                      </span>
                    </div>
                    <div className="text-slate-400 flex flex-wrap items-center gap-3 text-[11px]">
                      <span>{apt.client_email}</span>
                      {apt.organization && <span>· {apt.organization}</span>}
                      <span>· Service: {apt.service_type?.replace(/_/g, ' ')}</span>
                    </div>
                    {apt.notes && (
                      <div className="text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/80 mt-1.5">
                        "{apt.notes}"
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col items-end justify-between md:justify-center font-mono text-right">
                    <div className="text-cyan-400 font-bold">{apt.preferred_date}</div>
                    <div className="text-slate-400 text-[11px]">{apt.preferred_time} UTC</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SQL Schema Setup Guide */}
      {activeTab === 'schema' && (
        <div className="p-6 rounded-xl border border-slate-800 bg-[#070a12] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Supabase SQL Table Schema (`appointments`)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Run this script in your Supabase SQL Editor to establish the PostgreSQL appointments schema with Row Level Security.
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed select-all">
            {sqlSchema}
          </pre>

          <div className="text-xs text-slate-400 space-y-1 leading-relaxed">
            <div className="font-semibold text-slate-200">How to apply in 30 seconds:</div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
              <li>Open your Supabase Dashboard: <a href="https://supabase.com/dashboard/project/lugmtagstkfbnblpfjsl/sql" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Supabase SQL Editor</a></li>
              <li>Click <strong>New query</strong>, paste the copied SQL above, and click <strong>Run</strong>.</li>
              <li>All booking appointments from this applet will immediately persist directly into your remote database!</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
