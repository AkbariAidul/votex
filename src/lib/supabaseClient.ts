// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// Pastikan file .env.local kamu sudah ada di root folder (VOTEX-APP)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);