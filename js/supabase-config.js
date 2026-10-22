// আপনার Supabase প্রজেক্ট থেকে URL ও Anon Key বসিয়ে দিন
export const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);