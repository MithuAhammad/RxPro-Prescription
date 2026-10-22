import { loginWithGoogle, getCurrentUserProfile, getDoctorsList, updateDoctorStatus, logoutUser } from './auth.js';

let deferredPrompt;
let currentProfile = null;

// PWA ইনস্টলেশন ইভেন্ট
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install-btn')?.classList.remove('hidden');
});

window.triggerInstall = function() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  } else {
    alert("ব্রাউজার মেনু থেকে 'Install App' বেছে নিন।");
  }
};

window.loginUser = async function() {
  await loginWithGoogle();
};

window.previewDemo = function() {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('app-dashboard').classList.remove('hidden');
};

window.goToHome = function() {
  if (!currentProfile) {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('app-dashboard').classList.add('hidden');
  }
};

window.switchTab = function(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('border-sky-600', 'text-sky-600'));
  
  document.getElementById(`${tab}-content`)?.classList.remove('hidden');
  document.getElementById(`${tab}-btn`)?.classList.add('border-sky-600', 'text-sky-600');
};

// অ্যাপ লোড হওয়ার পর ইউজারের লগইন অবস্থা যাচাই
window.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }

  currentProfile = await getCurrentUserProfile();

  const landingPage = document.getElementById('landing-page');
  const dashboard = document.getElementById('app-dashboard');
  const userMeta = document.getElementById('user-meta');

  if (currentProfile) {
    // ১. ইউজার লগইন থাকলে ল্যান্ডিং পেজ লুকাবে এবং ড্যাশবোর্ড দেখাবে
    landingPage.classList.add('hidden');
    dashboard.classList.remove('hidden');

    userMeta.innerHTML = `
      <span class="text-xs font-bold text-slate-700">${currentProfile.full_name} (${currentProfile.role})</span>
      <button id="logout-btn" class="text-xs text-rose-600 hover:underline">লগআউট</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', logoutUser);

    // ২. লগইনের পরপরই অ্যাপ ইনস্টল করার জন্য রিকোয়েস্ট করবে
    if (deferredPrompt) {
      window.triggerInstall();
    }

    if (currentProfile.role === 'admin') {
      loadAdminDoctors();
    } else if (currentProfile.status === 'pending') {
      document.getElementById('pending-notice').classList.remove('hidden');
    }
  } else {
    // ইউজার লগইন না থাকলে শুধু ল্যান্ডিং পেজ দেখাবে
    landingPage.classList.remove('hidden');
    dashboard.classList.add('hidden');

    userMeta.innerHTML = `
      <button onclick="loginUser()" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
        গুগল দিয়ে লগইন
      </button>
    `;
  }

  setupPadLiveListeners();
});

function setupPadLiveListeners() {
  document.getElementById('in-name')?.addEventListener('input', e => document.getElementById('pad-name').innerText = e.target.value || '_______________');
  document.getElementById('in-age')?.addEventListener('input', e => document.getElementById('pad-age').innerText = (e.target.value || '___') + ' Years');
  document.getElementById('in-sex')?.addEventListener('change', e => document.getElementById('pad-sex').innerText = e.target.value);
  document.getElementById('in-date')?.addEventListener('input', e => document.getElementById('pad-date').innerText = e.target.value);

  document.getElementById('in-cc')?.addEventListener('input', e => document.getElementById('pad-cc').innerText = e.target.value);
  document.getElementById('in-oe')?.addEventListener('input', e => document.getElementById('pad-oe').innerText = e.target.value);
  document.getElementById('in-advice')?.addEventListener('input', e => document.getElementById('pad-advice').innerText = e.target.value);
  document.getElementById('in-next-days')?.addEventListener('input', e => document.getElementById('pad-next-days').innerText = e.target.value);

  document.getElementById('set-dr-eng')?.addEventListener('input', e => document.getElementById('pad-dr-eng').innerText = e.target.value);
  document.getElementById('set-dr-bng')?.addEventListener('input', e => document.getElementById('pad-dr-bng').innerText = e.target.value);
  document.getElementById('set-reg')?.addEventListener('input', e => document.getElementById('pad-reg').innerText = e.target.value);
  document.getElementById('set-chamber')?.addEventListener('input', e => document.getElementById('pad-chamber').innerText = e.target.value);
  document.getElementById('set-address')?.addEventListener('input', e => document.getElementById('pad-address').innerText = e.target.value);
  document.getElementById('set-phone')?.addEventListener('input', e => document.getElementById('pad-phone').innerText = e.target.value);
}

async function loadAdminDoctors() {
  const doctors = await getDoctorsList();
  const list = document.getElementById('admin-doc-list');
  if (!list) return;
  list.innerHTML = '';
  doctors.forEach(doc => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-3 bg-slate-50 border rounded-lg text-xs';
    row.innerHTML = `
      <div>
        <div class="font-bold text-slate-800">${doc.full_name}</div>
        <div class="text-slate-500">${doc.email}</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded font-bold ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${doc.status}</span>
        ${doc.status === 'pending' ? `<button onclick="approveDoctor('${doc.id}')" class="bg-sky-600 text-white px-2.5 py-1 rounded font-bold hover:bg-sky-700">অনুমোদন দিন</button>` : ''}
      </div>
    `;
    list.appendChild(row);
  });
}

window.approveDoctor = async function(id) {
  await updateDoctorStatus(id, 'approved');
  loadAdminDoctors();
};

window.printPad = function() {
  window.print();
};