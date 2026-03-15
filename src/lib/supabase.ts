import { createClient } from '@supabase/supabase-js';

// In production (Vercel), route through our serverless proxy so Indian ISPs
// never see a direct connection to supabase.co.
// In local dev, connect directly.
const supabaseUrl = import.meta.env.PROD
    ? `${window.location.origin}/api/supabase`
    : (import.meta.env.VITE_SUPABASE_URL as string) || 'https://elcrnjbftzncbrptqjgk.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseAnonKey) {
    console.warn('Missing VITE_SUPABASE_ANON_KEY environment variable.');
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey || 'placeholder-key'
);
