import { supabase } from './supabase-config.js';

export function updatePadPreview(formData) {
  if (formData.patientName) document.getElementById('p-name').innerText = formData.patientName;
  if (formData.patientAge) document.getElementById('p-age').innerText = formData.patientAge + ' Years';
  if (formData.patientSex) document.getElementById('p-sex').innerText = formData.patientSex;
  if (formData.patientDate) document.getElementById('p-date').innerText = formData.patientDate;

  if (formData.cc) document.getElementById('p-cc').innerText = formData.cc;
  if (formData.oe) document.getElementById('p-oe').innerText = formData.oe;
  if (formData.advice) document.getElementById('p-advice').innerText = formData.advice;
  if (formData.nextVisit) document.getElementById('p-next-visit').innerText = formData.nextVisit;
}

export async function savePrescriptionToSupabase(doctorId, rxData) {
  const { data, error } = await supabase.from('prescriptions').insert([{
    doctor_id: doctorId,
    patient_name: rxData.patientName,
    patient_age: rxData.patientAge,
    patient_sex: rxData.patientSex,
    patient_date: rxData.patientDate,
    cc: rxData.cc,
    oe: rxData.oe,
    advice: rxData.advice,
    next_visit: rxData.nextVisit,
    medicines: rxData.medicines
  }]);
  return { data, error };
}

export function printPrescription() {
  window.print();
}