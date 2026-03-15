import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if URL is a valid http/https URL
const isValidUrl = supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://');

let supabase: SupabaseClient;

if (isValidUrl && supabaseAnonKey.length > 10) {
  // Real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Dummy fallback so the app doesn't crash without credentials
  console.warn(
    '⚠️ Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
  supabase = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder');
}

export { supabase };
