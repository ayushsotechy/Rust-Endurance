const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const rowsElement = document.querySelector('#logbookRows');
const emptyState = document.querySelector('#emptyState');
const recordCount = document.querySelector('#recordCount');
const toast = document.querySelector('#toast');
const MODEL_RECORDS_KEY = 'rustEnduranceMicModelRecords';
const supportedSections = [
  ['work_start_up_inspection', 'Work Start up Inspection'],
  ['first_phase_observation_sheet', '1st phase observation sheet'],
  ['operation_durability_cycles', 'Operation Durability Cycles'],
  ['corrosion_coupon_measurement', 'Corrosion Coupon data measurement'],
  ['scribe_line_measurement', 'Scribe line measurement'],
  ['crs_check_sheet', 'CRS check sheet'],
  ['dismantling_inspection', 'Dismantling inspection sheet filled'],
  ['photo_annexure', 'Photo Annexure']
];
let toastTimer;

const seedRecords = [
  { id: 1, modelCode: 'YED', trial: 'T1', chassis: 'MA3EJKD1S00128', temp: '80°C', testType: 'Cyclic corrosion', phase: '1 Phase', location: 'Lab A', source: 'MIC', status: 'Pending', raisedAt: '2026-07-14T09:30:00.000Z', savedChecksheets: ['work_start_up_inspection'] },
  { id: 2, modelCode: 'YHB', trial: 'T2', chassis: 'MA3NYFJ1S00457', temp: '60°C', testType: 'Salt spray', phase: '2 Phase', location: 'Chamber 2', source: 'MIC', status: 'Submitted', raisedAt: '2026-07-15T10:15:00.000Z', savedChecksheets: ['first_phase_observation_sheet'] },
  { id: 3, modelCode: 'YSD', trial: 'P1', chassis: 'MA3ERLF1S00803', temp: '40°C', testType: 'Humidity', phase: '1 Phase', location: 'Lab B', source: 'MIC', status: 'Submitted', raisedAt: '2026-07-16T11:45:00.000Z', savedChecksheets: ['operation_durability_cycles'] },
  { id: 4, modelCode: 'YWD', trial: 'T1', chassis: 'MA3FJEB1S00591', temp: '80°C', testType: 'Cyclic corrosion', phase: '3 Phase', location: 'Chamber 1', source: 'Admin', status: 'Draft', raisedAt: '2026-07-17T08:20:00.000Z', savedChecksheets: ['corrosion_coupon_measurement'] }
];

function loadModelRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(MODEL_RECORDS_KEY));
    if (Array.isArray(records) && records.length) return records;
  } catch {
    // Use seed records below.
  }
  localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(seedRecords));
  return seedRecords;
}

function normalizeSections(record, index) {
  const selected = Array.isArray(record.savedChecksheets) && record.savedChecksheets.length
    ? record.savedChecksheets
    : Array.isArray(record.checksheets)
      ? supportedSections.filter(([, title]) => record.checksheets.includes(title)).map(([id]) => id)
      : [supportedSections[index % supportedSections.length][0]];
  return selected.filter((id) => supportedSections.some(([sectionId]) => sectionId === id));
}

function buildForms() {
  return loadModelRecords().map((record, index) => {
    const source = record.source || 'MIC';
    const raisedAt = record.raisedAt || new Date(Date.now() - index * 86400000).toISOString();
    const sectionIds = normalizeSections(record, index);
    const sectionNames = sectionIds
      .map((sectionId) => supportedSections.find(([id]) => id === sectionId)?.[1])
      .filter(Boolean);
    return {
      ...record,
      source,
      raisedAt,
      status: record.status || 'Pending',
      sectionIds,
      sectionId: sectionIds[0] || supportedSections[0][0],
      formName: `${sectionNames.length} checksheet${sectionNames.length === 1 ? '' : 's'}`,
      sectionNames
    };
  }).filter((record) => record.sectionIds.length > 0);
}

let forms = buildForms();

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
function statusClass(value) { return String(value).toLowerCase().replaceAll(' ', '-'); }
function icon(type) {
  if (type === 'download') return '<svg viewBox="0 0 24 24"><path d="M12 4v10m0 0 4-4m-4 4-4-4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/></svg>';
  if (type === 'fill') return '<svg viewBox="0 0 24 24"><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/></svg>';
  return '<svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3.2"/></svg>';
}

function actionButton(type, form) {
  const label = type === 'fill' ? 'Fill' : type === 'view' ? 'View' : 'Download';
  return `<button class="action-button ${type}" type="button" data-action="${type}" data-record="${escapeHtml(form.id)}" data-section="${form.sectionId}" aria-label="${label} ${escapeHtml(form.formName)}">${icon(type)}${type === 'download' ? '' : `<span>${label}</span>`}</button>`;
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function downloadChecksheet(form) {
  const rows = [
    ['Rust Endurance Checksheet'],
    ['Package', form.formName],
    ['Checksheets', form.sectionNames.join(' | ')],
    ['Model', form.modelCode || ''],
    ['Chassis No.', form.chassis || ''],
    ['Trial', form.trial || ''],
    ['Test Type', form.testType || ''],
    ['Raised By', form.source || 'MIC'],
    ['Status', form.status || 'Pending'],
    ['Raised Date', formatDate(form.raisedAt)]
  ];
  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${form.modelCode || 'model'}-checksheet-package.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`${form.formName} downloaded`);
}

function renderRows(list = forms) {
  rowsElement.innerHTML = list.map((form) => `
    <tr>
      <td>${formatDate(form.raisedAt)}</td>
      <td class="form-name">${escapeHtml(form.formName)}<small>${escapeHtml(form.sectionNames.join(' · '))}</small></td>
      <td>${escapeHtml(form.modelCode || '—')}</td>
      <td>${escapeHtml(form.chassis || '—')}</td>
      <td>${escapeHtml(form.trial || '—')}</td>
      <td>${escapeHtml(form.testType || '—')}</td>
      <td><span class="source-pill source-pill--${String(form.source).toLowerCase()}">${escapeHtml(form.source)}</span></td>
      <td><span class="record-status record-status--${statusClass(form.status)}">${escapeHtml(form.status)}</span></td>
      <td><div class="actions">${actionButton('download', form)}${actionButton('fill', form)}${actionButton('view', form)}</div></td>
    </tr>
  `).join('');
  emptyState.hidden = list.length > 0;
  recordCount.textContent = `${list.length} ${list.length === 1 ? 'package' : 'packages'}`;
}

function applyFilters() {
  const from = document.querySelector('#fromDate').value;
  const to = document.querySelector('#toDate').value;
  const model = document.querySelector('#modelFilter').value.trim().toLowerCase();
  const chassis = document.querySelector('#chassisFilter').value.trim().toLowerCase();
  const source = document.querySelector('#sourceFilter').value;
  renderRows(forms.filter((form) => {
    const date = String(form.raisedAt).slice(0, 10);
    return (!from || date >= from)
      && (!to || date <= to)
      && String(form.modelCode).toLowerCase().includes(model)
      && String(form.chassis).toLowerCase().includes(chassis)
      && (!source || form.source === source);
  }));
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
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
document.querySelectorAll('[data-signout]').forEach((button) => button.addEventListener('click', () => { window.location.href = `${window.location.origin}/`; }));
document.querySelector('#searchForm').addEventListener('submit', (event) => { event.preventDefault(); applyFilters(); });
document.querySelectorAll('#fromDate, #toDate, #modelFilter, #chassisFilter, #sourceFilter').forEach((control) => control.addEventListener('input', applyFilters));
document.querySelector('#clearFilters').addEventListener('click', () => { document.querySelector('#searchForm').reset(); renderRows(); });
document.querySelector('#exportAll').addEventListener('click', () => showToast(`Preparing ${forms.length} forms for export`));

rowsElement.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const form = forms.find((item) =>
    String(item.id) === String(button.dataset.record)
  );
  if (!form) return;
  if (button.dataset.action === 'download') {
    downloadChecksheet(form);
    return;
  }
  const query = new URLSearchParams({
    record: button.dataset.record,
    section: button.dataset.section,
    mode: button.dataset.action
  });
  window.location.href = `./view%20checksheet/?${query}`;
});

renderRows();
