import { createClient } from '@supabase/supabase-js';

// Supabase project credentials provided by user
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://lugmtagstkfbnblpfjsl.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable__9mmHDwu1keswWVCULYXuw_VX9z4xOi';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface MissionBookingAppointment {
  id?: string;
  created_at?: string;
  client_name: string;
  client_email: string;
  organization?: string;
  service_type: 'mission_consultation' | 'telemetry_audit' | 'digital_twin_demo' | 'satellite_health_review' | 'emergency_support';
  satellite_target?: string;
  preferred_date: string;
  preferred_time: string;
  time_zone?: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Local storage fallback key if table is not yet migrated in Supabase SQL editor
const LOCAL_STORAGE_KEY = 'astra_mission_booking_appointments';

export async function fetchAppointments(): Promise<{ data: MissionBookingAppointment[]; source: 'supabase' | 'local'; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch returned error (will load fallback cache):', error.message);
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      return {
        data: local ? JSON.parse(local) : [],
        source: 'local',
        error: error.message,
      };
    }

    // Save to local cache as backup
    if (data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return { data: data as MissionBookingAppointment[], source: 'supabase' };
    }
  } catch (err: any) {
    console.warn('Supabase fetch exception:', err?.message);
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    return {
      data: local ? JSON.parse(local) : [],
      source: 'local',
      error: err?.message,
    };
  }

  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  return { data: local ? JSON.parse(local) : [], source: 'local' };
}

export async function saveAppointment(
  appointment: Omit<MissionBookingAppointment, 'id' | 'created_at' | 'status'>
): Promise<{ success: boolean; data?: MissionBookingAppointment; source: 'supabase' | 'local'; error?: string }> {
  const newAppointment: MissionBookingAppointment = {
    ...appointment,
    id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    status: 'confirmed',
  };

  // Always update local storage first so user has immediate persistence
  try {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: MissionBookingAppointment[] = existing ? JSON.parse(existing) : [];
    const updated = [newAppointment, ...list];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Local storage save error:', e);
  }

  // Attempt write to Supabase table 'appointments'
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          client_name: appointment.client_name,
          client_email: appointment.client_email,
          organization: appointment.organization || 'Aerospace Ops',
          service_type: appointment.service_type,
          satellite_target: appointment.satellite_target || 'ASTRA-01',
          preferred_date: appointment.preferred_date,
          preferred_time: appointment.preferred_time,
          time_zone: appointment.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          notes: appointment.notes || '',
          status: 'confirmed',
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return {
        success: true,
        data: newAppointment,
        source: 'local',
        error: `Stored locally. Note for Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      data: (data && data[0]) ? data[0] : newAppointment,
      source: 'supabase',
    };
  } catch (err: any) {
    console.error('Error inserting into Supabase:', err);
    return {
      success: true,
      data: newAppointment,
      source: 'local',
      error: err?.message,
    };
  }
}
