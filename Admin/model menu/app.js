const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const rowsElement = document.querySelector('#modelRows');
const emptyState = document.querySelector('#emptyState');
const recordCount = document.querySelector('#recordCount');
const toast = document.querySelector('#toast');
const MODEL_RECORDS_KEY = 'rustEnduranceMicModelRecords';
let toastTimer;
const sectionCatalog = {
  work_start_up_inspection: 'Work Start up Inspection',
  first_phase_observation_sheet: '1st phase observation sheet',
  operation_durability_cycles: 'Operation Durability Cycles',
  corrosion_coupon_measurement: 'Corrosion Coupon data measurement',
  scribe_line_measurement: 'Scribe line measurement',
  crs_check_sheet: 'CRS check sheet',
  dismantling_inspection: 'Dismantling inspection sheet filled',
  photo_annexure: 'Photo Annexure'
};

const seedRecords = [
  { id: 1, modelCode: 'YED', trial: 'T1', chassis: 'MA3EJKD1S00128', temp: '80°C', testType: 'Cyclic corrosion', phase: '1 Phase', location: 'Lab A', source: 'MIC', status: 'Pending', raisedAt: '2026-07-14T09:30:00.000Z', savedChecksheets: ['work_start_up_inspection'] },
  { id: 2, modelCode: 'YHB', trial: 'T2', chassis: 'MA3NYFJ1S00457', temp: '60°C', testType: 'Salt spray', phase: '2 Phase', location: 'Chamber 2', source: 'MIC', status: 'Submitted', raisedAt: '2026-07-15T10:15:00.000Z', savedChecksheets: ['first_phase_observation_sheet'] },
  { id: 3, modelCode: 'YSD', trial: 'P1', chassis: 'MA3ERLF1S00803', temp: '40°C', testType: 'Humidity', phase: '1 Phase', location: 'Lab B', source: 'MIC', status: 'Submitted', raisedAt: '2026-07-16T11:45:00.000Z', savedChecksheets: ['operation_durability_cycles'] },
  { id: 4, modelCode: 'YWD', trial: 'T1', chassis: 'MA3FJEB1S00591', temp: '80°C', testType: 'Cyclic corrosion', phase: '3 Phase', location: 'Chamber 1', source: 'Admin', status: 'Draft', raisedAt: '2026-07-17T08:20:00.000Z', savedChecksheets: ['corrosion_coupon_measurement'] }
];

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(MODEL_RECORDS_KEY));
    if (Array.isArray(saved) && saved.length) {
      return saved.map((record, index) => ({
        ...record,
        source: record.source || 'MIC',
        status: record.status || 'Pending',
        raisedAt: record.raisedAt || new Date(Date.now() - index * 86400000).toISOString()
      }));
    }
  } catch {
    // Seed records are used if saved data is not readable.
  }
  localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(seedRecords));
  return [...seedRecords];
}

let records = loadRecords();

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function actionIcon(type) {
  if (type === 'view') {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3.2"/></svg>';
  }
  if (type === 'edit') {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h-8v14h12v-8M13 11l6-6 2 2-6 6-3 1z"/></svg>';
  }
  if (type === 'approve-all') {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 4 4L18 6M13 16l2 2 5-5"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13"/></svg>';
}

function recordSectionIds(record) {
  if (Array.isArray(record.savedChecksheets) && record.savedChecksheets.length) {
    return record.savedChecksheets.filter((sectionId) => sectionId in sectionCatalog);
  }
  if (Array.isArray(record.checksheets) && record.checksheets.length) {
    return Object.entries(sectionCatalog)
      .filter(([, title]) => record.checksheets.includes(title))
      .map(([sectionId]) => sectionId);
  }
  return Object.keys(sectionCatalog);
}

function statusClass(status) {
  return String(status).toLowerCase().replaceAll(' ', '-');
}

function renderRows(list = records) {
  rowsElement.innerHTML = list.map((record) => `
    <tr>
      <td class="model-code">${escapeHtml(record.modelCode || '—')}</td>
      <td>${escapeHtml(record.trial || '—')}</td>
      <td>${escapeHtml(record.chassis || '—')}</td>
      <td>${escapeHtml(record.temp || '—')}</td>
      <td>${escapeHtml(record.testType || '—')}</td>
      <td><span class="status-pill">${escapeHtml(record.phase || '—')}</span></td>
      <td>${escapeHtml(record.location || '—')}</td>
      <td><span class="source-pill source-pill--${String(record.source).toLowerCase()}">${escapeHtml(record.source)}</span></td>
      <td><span class="record-status record-status--${statusClass(record.status)}">${escapeHtml(record.status)}</span></td>
      <td>
        <div class="actions">
          <button class="action-button" data-action="view" data-id="${escapeHtml(record.id)}" aria-label="View ${escapeHtml(record.modelCode)}">${actionIcon('view')}</button>
          <button class="action-button approve-all" data-action="approve-all" data-id="${escapeHtml(record.id)}" aria-label="Approve all checksheets for ${escapeHtml(record.modelCode)}">${actionIcon('approve-all')}<span>All</span></button>
          <button class="action-button" data-action="edit" data-id="${escapeHtml(record.id)}" aria-label="Edit ${escapeHtml(record.modelCode)}">${actionIcon('edit')}</button>
          <button class="action-button delete" data-action="delete" data-id="${escapeHtml(record.id)}" aria-label="Delete ${escapeHtml(record.modelCode)}">${actionIcon('delete')}</button>
        </div>
      </td>
    </tr>
  `).join('');
  emptyState.hidden = list.length !== 0;
  recordCount.textContent = `${list.length} ${list.length === 1 ? 'record' : 'records'}`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function applyFilters() {
  const model = document.querySelector('#modelFilter').value.trim().toLowerCase();
  const chassis = document.querySelector('#chassisFilter').value.trim().toLowerCase();
  renderRows(records.filter((record) =>
    String(record.modelCode).toLowerCase().includes(model)
    && String(record.chassis).toLowerCase().includes(chassis)
  ));
}

profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = profileMenu.hidden;
  profileMenu.hidden = !open;
  profileButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (event) => {
  if (!profileMenu.contains(event.target)) {
    profileMenu.hidden = true;
    profileButton.setAttribute('aria-expanded', 'false');
  }
});
document.querySelectorAll('[data-signout]').forEach((button) => {
  button.addEventListener('click', () => { window.location.href = homeHref; });
});

document.querySelector('#searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  applyFilters();
});
document.querySelectorAll('#modelFilter, #chassisFilter').forEach((input) => {
  input.addEventListener('input', applyFilters);
});
document.querySelector('#clearFilters').addEventListener('click', () => {
  document.querySelector('#searchForm').reset();
  renderRows();
});

rowsElement.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const record = records.find((item) => String(item.id) === button.dataset.id);
  if (!record) return;
  if (button.dataset.action === 'view') {
    const sectionIds = recordSectionIds(record);
    const query = new URLSearchParams({
      record: record.id,
      section: sectionIds[0] || 'work_start_up_inspection',
      approval: '1',
      return: 'model'
    });
    window.location.href = `../logbook%201%20check%20sheet/view%20checksheet/?${query}`;
    return;
  }
  if (button.dataset.action === 'approve-all') {
    const sectionIds = recordSectionIds(record);
    record.sheetApprovals = Object.fromEntries(sectionIds.map((sectionId) => [sectionId, 'Approved']));
    record.approvedChecksheets = [...sectionIds];
    record.status = 'Approved';
    record.updatedAt = new Date().toISOString();
    localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(records));
    renderRows();
    showToast(`${record.modelCode}: all ${sectionIds.length} checksheets approved`);
    return;
  }
  if (button.dataset.action === 'edit') {
    showToast(`${record.modelCode} is available from the checksheet record`);
  }
  if (button.dataset.action === 'delete' && window.confirm(`Delete model ${record.modelCode}?`)) {
    records = records.filter((item) => String(item.id) !== String(record.id));
    localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(records));
    renderRows();
    showToast(`${record.modelCode} deleted`);
  }
});

document.querySelector('#addModel').addEventListener('click', () => {
  localStorage.removeItem('rustEnduranceAdminModelAdditionStateV2');
});

renderRows();
