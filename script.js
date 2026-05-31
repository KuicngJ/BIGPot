/* ═══════════════════════════════════════
   LostPotential — script.js
   Logic for Navigation, Auth, & Event Filtering
═══════════════════════════════════════ */

// ── DATA ──
const EVS = [
  { tag: 'Teknologi', title: 'National Olympiad Informatika 2025', loc: 'Online', prize: 'Rp 50jt', dl: '30 Jun 2025', badge: 'Populer', bc: 'ch-b', ic: 'ti-cpu' },
  { tag: 'Seni', title: 'Lomba Desain Poster Kemerdekaan', loc: 'Nasional', prize: 'Piala', dl: '1 Jul 2025', badge: 'Baru', bc: 'ch-o', ic: 'ti-layout' }
];

// ── NAVIGASI & UI ──
function go(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  const target = document.getElementById('pg-' + pageId);
  if (target) target.classList.add('on');
  window.scrollTo(0, 0);
}

function setNav(id) {
  document.querySelectorAll('.bi').forEach(b => b.classList.remove('on'));
  document.getElementById('nav-' + id)?.classList.add('on');
}

// ── AUTH LOGIC ──
function googleLogin() {
  // Simulasi proses verifikasi login Google
  const btn = event.target;
  btn.innerText = "Memverifikasi...";
  setTimeout(() => {
    toast("Berhasil masuk dengan Google", "ti-brand-google");
    go('home');
  }, 1500);
}

function toast(msg, icon) {
  const t = document.createElement('div');
  t.className = 'toast show';
  t.innerHTML = `<i class="ti ${icon}"></i> <span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── FITUR LOMBA ──
function renderLomba() {
  const container = document.getElementById('ev-list');
  if(!container) return;
  container.innerHTML = EVS.map(e => `
    <div class="ecard">
      <div class="ecard-top"><i class="ti ${e.ic}"></i><span class="ecard-chip ${e.bc}">${e.tag}</span></div>
      <div class="ecard-body">
        <div class="ecard-title">${e.title}</div>
        <div class="ecard-meta"><i class="ti ti-map-pin"></i> ${e.loc}</div>
        <div class="ecard-foot">
          <span class="prize">${e.prize}</span>
          <button class="btn-primary" onclick="daftarLomba('${e.title}')">Daftar</button>
        </div>
      </div>
    </div>
  `).join('');
}

function daftarLomba(title) {
  toast(`Berhasil mendaftar: ${title}`, "ti-trophy");
}

// ── INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  renderLomba();
  
  // Splash Screen Hiding
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
  }, 1200);
});

// Dark Mode Toggle
function toggleDark() {
  document.body.toggleAttribute('data-dark');
}