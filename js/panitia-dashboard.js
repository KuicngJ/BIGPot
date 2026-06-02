// ============================================================
// PANITIA/ADMIN DASHBOARD
// Management interface untuk mengelola events
// ============================================================

let currentEditingEvent = null;
let allEvents = [];

/**
 * Initialize panitia dashboard
 */
async function initPanitiaDashboard() {
  const isPanitia = await isUserPanitia();
  
  if (!isPanitia) {
    showToast('Akses terbatas untuk panitia/admin', 'warning');
    return;
  }

  await loadPanitiaEvents();
  setupPanitiaEventListeners();
}

/**
 * Load panitia's events
 */
async function loadPanitiaEvents() {
  allEvents = await fetchAllEvents();
  renderPanitiaEventList();
}

/**
 * Render event list in dashboard
 */
function renderPanitiaEventList() {
  const container = document.getElementById('panitia-event-list');
  if (!container) return;

  if (allEvents.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--ink3);">
        <i class="ti ti-inbox" style="font-size: 40px; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
        <p>Belum ada event. Buat yang pertama!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = allEvents.map(event => `
    <div class="panitia-event-item" data-event-id="${event.id}">
      <div class="pei-top">
        <div class="pei-icon" style="background: ${event.color || '#1847ED'}20;">
          <i class="${event.icon || 'ti ti-star'}"></i>
        </div>
        <div class="pei-info">
          <h3>${event.title}</h3>
          <p>${event.category || 'Event'}</p>
        </div>
        <div class="pei-actions">
          <button class="pei-btn pei-edit" onclick="editPanitiaEvent('${event.id}')">Edit</button>
          <button class="pei-btn pei-delete" onclick="confirmDeleteEvent('${event.id}')">Hapus</button>
        </div>
      </div>
      <div class="pei-details">
        <span><strong>Prize:</strong> ${event.prize || 'N/A'}</span>
        <span><strong>Deadline:</strong> ${event.deadline || 'N/A'}</span>
        <span><strong>Status:</strong> <span class="badge badge-${event.status || 'active'}">${event.status || 'Active'}</span></span>
      </div>
    </div>
  `).join('');
}

/**
 * Open event creation modal
 */
function openPanitiaCreateModal() {
  currentEditingEvent = null;
  const form = document.getElementById('panitia-event-form');
  form.reset();
  document.getElementById('panitia-modal-title').textContent = 'Buat Event Baru';
  document.getElementById('panitia-modal').classList.add('open');
}

/**
 * Edit event
 */
async function editPanitiaEvent(eventId) {
  currentEditingEvent = allEvents.find(e => e.id === eventId);
  if (!currentEditingEvent) return;

  const form = document.getElementById('panitia-event-form');
  form.elements['title'].value = currentEditingEvent.title;
  form.elements['description'].value = currentEditingEvent.description || '';
  form.elements['category'].value = currentEditingEvent.category || '';
  form.elements['icon'].value = currentEditingEvent.icon || 'ti ti-star';
  form.elements['color'].value = currentEditingEvent.color || '#1847ED';
  form.elements['prize'].value = currentEditingEvent.prize || '';
  form.elements['deadline'].value = currentEditingEvent.deadline || '';
  form.elements['link'].value = currentEditingEvent.link || '';
  form.elements['waContact'].value = currentEditingEvent.waContact || '';
  form.elements['status'].value = currentEditingEvent.status || 'active';

  document.getElementById('panitia-modal-title').textContent = 'Edit Event';
  document.getElementById('panitia-modal').classList.add('open');
}

/**
 * Save event (create or update)
 */
async function savePanitiaEvent(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const eventData = Object.fromEntries(formData);

  if (currentEditingEvent) {
    // Update existing
    await updateEvent(currentEditingEvent.id, eventData);
  } else {
    // Create new
    await createEvent(eventData);
  }

  closePanitiaModal();
  await loadPanitiaEvents();
}

/**
 * Confirm delete event
 */
function confirmDeleteEvent(eventId) {
  if (confirm('Yakin ingin menghapus event ini?')) {
    deleteEvent(eventId);
    loadPanitiaEvents();
  }
}

/**
 * Close modal
 */
function closePanitiaModal() {
  document.getElementById('panitia-modal').classList.remove('open');
}

/**
 * Setup event listeners
 */
function setupPanitiaEventListeners() {
  const createBtn = document.getElementById('panitia-create-btn');
  const form = document.getElementById('panitia-event-form');
  const closeBtn = document.getElementById('panitia-modal-close');
  const overlay = document.getElementById('panitia-modal-overlay');

  if (createBtn) createBtn.addEventListener('click', openPanitiaCreateModal);
  if (form) form.addEventListener('submit', savePanitiaEvent);
  if (closeBtn) closeBtn.addEventListener('click', closePanitiaModal);
  if (overlay) overlay.addEventListener('click', closePanitiaModal);
}
