const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const rowsElement = document.querySelector('#approvalRows');
const emptyState = document.querySelector('#emptyState');
const recordCount = document.querySelector('#recordCount');
const toast = document.querySelector('#toast');
const MODEL_RECORDS_KEY = 'rustEnduranceMicModelRecords';
const supportedSections = [
  'work_start_up_inspection',
  'first_phase_observation_sheet',
  'operation_durability_cycles',
  'corrosion_coupon_measurement',
  'scribe_line_measurement',
  'crs_check_sheet',
  'dismantling_inspection',
  'photo_annexure'
];
let toastTimer;

const seedRecords = [
  { id: 1, modelCode: 'YED', chassis: 'MA3EJKD1S00128', source: 'MIC', status: 'Pending', raisedAt: '2026-07-14T09:30:00.000Z', savedChecksheets: supportedSections },
  { id: 2, modelCode: 'YHB', chassis: 'MA3NYFJ1S00457', source: 'MIC', status: 'Submitted', raisedAt: '2026-07-15T10:15:00.000Z', savedChecksheets: supportedSections.slice(0, 2) },
  { id: 3, modelCode: 'YSD', chassis: 'MA3ERLF1S00803', source: 'Admin', status: 'Approved', raisedAt: '2026-07-16T11:45:00.000Z', savedChecksheets: supportedSections.slice(2) }
];

function loadRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(MODEL_RECORDS_KEY));
    if (Array.isArray(records) && records.length) {
      return records.filter((record) => {
        const ids = Array.isArray(record.savedChecksheets) ? record.savedChecksheets : [];
        return ids.some((sectionId) => supportedSections.includes(sectionId)) || !ids.length;
      });
    }
  } catch {
    // Seed records are used when stored data cannot be read.
  }
  localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(seedRecords));
  return seedRecords;
}

let records = loadRecords().map((record, index) => ({
  ...record,
  source: record.source || 'MIC',
  status: record.status || 'Pending',
  raisedAt: record.raisedAt || new Date(Date.now() - index * 86400000).toISOString(),
  firstSection: record.savedChecksheets?.find((sectionId) => supportedSections.includes(sectionId)) || supportedSections[0]
}));

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
function statusClass(value) { return String(value).toLowerCase().replaceAll(' ', '-'); }
function viewIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3.2"/></svg>';
}
function renderRows(list = records) {
  rowsElement.innerHTML = list.map((record) => `
    <tr>
      <td>${formatDate(record.raisedAt)}</td>
      <td class="model-code">${escapeHtml(record.modelCode || '—')}</td>
      <td>${escapeHtml(record.chassis || '—')}</td>
      <td><span class="approval-status approval-status--${statusClass(record.status)}">${escapeHtml(record.status)}</span></td>
      <td><button class="action-button view-button" type="button" data-view="${escapeHtml(record.id)}" data-section="${record.firstSection}">${viewIcon()}<span>View</span></button></td>
    </tr>
  `).join('');
  emptyState.hidden = list.length > 0;
  recordCount.textContent = `${list.length} ${list.length === 1 ? 'request' : 'requests'}`;
}
function applyFilters() {
  const from = document.querySelector('#fromDate').value;
  const to = document.querySelector('#toDate').value;
  renderRows(records.filter((record) => {
    const date = String(record.raisedAt).slice(0, 10);
    return (!from || date >= from) && (!to || date <= to);
  }));
}
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
}
function exportToExcel() {
  const rows = [
    ['Date', 'Model', 'Chassis', 'Raised By', 'Status'],
    ...records.map((record) => [formatDate(record.raisedAt), record.modelCode, record.chassis, record.source, record.status])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'checksheet-approval-requests.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('Approval requests exported');
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
document.querySelectorAll('#fromDate, #toDate').forEach((input) => input.addEventListener('input', applyFilters));
document.querySelector('#exportExcel').addEventListener('click', exportToExcel);
rowsElement.addEventListener('click', (event) => {
  const button = event.target.closest('[data-view]');
  if (!button) return;
  const query = new URLSearchParams({
    record: button.dataset.view,
    section: button.dataset.section,
    approval: '1'
  });
  window.location.href = `../logbook%201%20check%20sheet/view%20checksheet/?${query}`;
});

renderRows();
