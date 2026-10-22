import { supabase } from './supabase-config.js';

// গুগল দিয়ে লগইন
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });
  if (error) alert("লগইন সমস্যা: " + error.message);
  return data;
}

// লগইন করা ইউজারের প্রোফাইল ও স্ট্যাটাস যাচাই
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'ডাক্তার',
        role: 'doctor',
        status: 'pending'
      }])
      .select()
      .single();
    profile = newProfile;
  }
  return profile;
}

// এডমিনের জন্য ডাক্তারদের তালিকা
export async function getDoctorsList() {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

// এডমিন কর্তৃক অনুমোদন বা রিজেক্ট
export async function updateDoctorStatus(userId, status) {
  return await supabase.from('profiles').update({ status }).eq('id', userId);
}

// লগআউট
export async function logoutUser() {
  await supabase.auth.signOut();
  window.location.reload();
}