// আপনার Supabase প্রজেক্ট থেকে URL ও Anon Key বসিয়ে দিন
export const SUPABASE_URL = "https://rggfpjibynhrnvgaefmx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZ2ZwamlieW5ocm52Z2FlZm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2Mzc1MTIsImV4cCI6MjEwODIxMzUxMn0.so4fJPtIVeNV0Q7lP3GZ7myTj6aT4N_nHmKVjgT0F88";

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);