import { createClient } from "@supabase/supabase-js";

// Use the publishable key provided by the user. 
// For security in production, this should ideally be in a `.env` file.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = "sb_publishable_QH0wIzwQtvmtNgksSBDwzg_rDGiNUxJ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
