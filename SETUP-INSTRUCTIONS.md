# Setup Panitia Dashboard

## Files yang sudah di-push:

✅ `js/firestore-data.js` - Firestore data management  
✅ `js/panitia-dashboard.js` - Panitia dashboard logic  
✅ `js/quiz-firestore-integration.js` - Quiz results saved to Firestore  

## Kamu perlu add ke index.html:

### 1. **CSS** (sebelum `</style>`)
Tambahkan isi dari `index-panitia-css.css` ke section `<style>` kamu

### 2. **HTML Pages** (sebelum `</body>`)
Tambahkan isi dari `panitia-dashboard-snippet.html` ke body kamu

### 3. **Add ke bottom nav** (cari `.bnav` section)
```html
<div class="bi" id="bnav-panitia" onclick="showPage('panitia-dashboard')">
  <div class="bi-ic"><i class="ti ti-settings"></i></div>
  <div class="bi-lbl">Panitia</div>
</div>
```

### 4. **Helper functions** (add sebelum `</body>`)
```javascript
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = 'toast show';
  
  const icons = {
    success: 'ti ti-check',
    error: 'ti ti-alert-circle',
    warning: 'ti ti-alert-triangle',
    info: 'ti ti-info-circle'
  };
  
  const icon = document.createElement('i');
  icon.className = icons[type] || icons.info;
  toast.prepend(icon);
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  const page = document.getElementById(`pg-${pageId}`);
  if (page) {
    page.classList.add('on');
    
    if (pageId === 'panitia-dashboard') {
      initPanitiaDashboard();
    }
  }
}

function closePanitiaModal() {
  document.getElementById('panitia-modal-overlay').classList.remove('open');
}
```

## Fitur yang sekarang aktif:

✅ **Quiz Progress Saved** - Hasil quiz otomatis tersimpan ke Firestore  
✅ **Panitia Dashboard** - Kelola events tanpa coding  
✅ **Create/Edit/Delete Events** - UI modal yang cantik  
✅ **Real-time Firestore** - Events auto-update  
✅ **Role-based Access** - Hanya panitia yang bisa akses dashboard  

## Firebase Config

Firebase config kamu tetap 100% sama, gak ada yang diganti!

---

**Selamat! Sekarang kamu punya panitia admin dashboard yang fully functional!** 🚀
