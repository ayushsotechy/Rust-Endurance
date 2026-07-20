const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const formRail = document.querySelector('#formRail');
const formTitle = document.querySelector('#formTitle');
const sourceBadge = document.querySelector('#sourceBadge');
const statusBadge = document.querySelector('#statusBadge');
const vehicleDetails = document.querySelector('#vehicleDetails');
const filledTable = document.querySelector('#filledTable');
const toast = document.querySelector('#toast');
const MODEL_RECORDS_KEY = 'rustEnduranceMicModelRecords';
const FILLED_FORMS_KEY = 'rustEnduranceAdminFilledChecksheets';
const params = new URLSearchParams(window.location.search);
let activeSection = params.get('section') || 'work_start_up_inspection';
const pageMode = params.get('mode') === 'fill' ? 'fill' : 'view';
const approvalMode = params.get('approval') === '1';
let toastTimer;

const sections = {
  work_start_up_inspection: {
    title: 'Work Start up Inspection',
    columns: ['Sl No.', 'Category', 'Check points', 'PIC 1', 'PIC 2', 'PIC 3', 'PIC 4'],
    rows: [
      ['1', 'Water pump belt or', 'Crack, damage', 'OK', 'OK', 'OK', 'OK'],
      ['2', 'Alternator belt', 'Tension', 'OK', 'OK', 'OK', 'OK'],
      ['3', 'Engine oil', 'Leak', 'OK', 'OK', 'OK', 'OK'],
      ['4', 'Coolant', 'Leak', 'OK', 'OK', 'OK', 'Pending']
    ]
  },
  first_phase_observation_sheet: {
    title: '1st phase observation sheet',
    columns: ['Sl No.', 'Observation', 'Criteria', 'Actual', 'Attachment', 'Status'],
    rows: [
      ['1', 'Body surface inspection', 'No red rust', 'No red rust observed', 'front-body.jpg', 'OK'],
      ['2', 'Underbody inspection', 'No perforation', 'Surface corrosion only', 'underbody.jpg', 'OK'],
      ['3', 'Door hem inspection', 'No blistering', 'Minor blistering', 'door-hem.jpg', 'Pending']
    ]
  },
  operation_durability_cycles: {
    title: 'Operation Durability Cycles',
    columns: ['Sl No.', 'Category', 'Check points', 'Actual Cycles', 'Result'],
    rows: [
      ['1', 'Front door outside handle', 'Open/Close', '500', 'OK'],
      ['2', 'Front door inside handle', 'Open/Close', '500', 'OK'],
      ['3', 'Front door regulator', 'Open/Close', '300', 'OK'],
      ['4', 'Front door inside lock', 'Lock/Free', '500', 'OK'],
      ['5', 'Front door key', 'Lock/Free', '500', 'Pending'],
      ['6', 'Battery', 'Lock/Free', '250', 'OK']
    ]
  },
  corrosion_coupon_measurement: {
    title: 'Corrosion Coupon data measurement',
    wide: true,
    columns: ['Category', 'Coupon no.', 'Running Day', 'Initial check date', 'Initial weight', 'Final Check Date', 'Final Weight', 'Weight Loss', 'Rust Progress (µm)'],
    rows: Array.from({ length: 10 }, (_, index) => [
      'Underbody',
      String(index + 1),
      `${index + 5}${index + 5 === 5 ? 'th' : index + 5 === 6 ? 'th' : index + 5 === 7 ? 'th' : index + 5 === 8 ? 'th' : index + 5 === 9 ? 'th' : 'th'}`,
      index > 7 ? '14.01.2025' : '—',
      index > 7 ? '42.16 g' : '—',
      index > 7 ? '28.01.2025' : '—',
      index > 7 ? '41.92 g' : '—',
      index > 7 ? '0.24 g' : '—',
      index > 7 ? '12.4' : '—'
    ])
  },
  scribe_line_measurement: {
    title: 'Scribe line measurement',
    columns: ['Sl No.', 'Body panel', 'Direction', 'Measurement (mm)', 'Result'],
    rows: [
      ['1', 'Hood', 'Left: V', '2.1', 'OK'],
      ['2', 'Front fender', 'Left: H', '2.4', 'OK'],
      ['3', 'Front door', 'Right: V', '2.8', 'Pending'],
      ['4', 'Rear door', 'Right: H', '2.2', 'OK']
    ]
  },
  crs_check_sheet: {
    title: 'CRS check sheet',
    columns: ['Sl No.', 'Inspection area', 'Inspection portion', 'Film before (µm)', 'Film after (µm)', 'Result'],
    rows: [
      ['1', 'Roof panel', 'Outer panel', '82', '78', 'OK'],
      ['2', 'Side body panel', 'Opening trim', '76', '71', 'OK'],
      ['3', 'Fender panel', 'Mounting bolts', '69', '61', 'Pending'],
      ['4', 'Front hood panel', 'Hinge mounting', '80', '75', 'OK']
    ]
  },
  dismantling_inspection: {
    title: 'Dismantling inspection sheet filled',
    columns: ['Sl No.', 'Removal / Fuse cut parts', 'Position', 'Side', 'Corrosion rating', 'Comment'],
    rows: [
      ['1', 'Front hood', 'Front hood', '—', '1', 'Acceptable'],
      ['2', 'Door', 'Front', 'L', '1', 'Acceptable'],
      ['3', 'Door', 'Front', 'R', '2', 'Review'],
      ['4', 'Cross member', 'Rear floor', '—', '1', 'Acceptable']
    ]
  },
  photo_annexure: {
    title: 'Photo Annexure',
    columns: ['Photo Set', 'Description', 'File', 'Upload status'],
    rows: [
      ['P-01', 'Front assembly', 'front-assembly.jpg', 'Uploaded'],
      ['P-02', 'Side profile', 'side-profile.jpg', 'Uploaded'],
      ['P-03', 'Underbody', 'underbody.jpg', 'Uploaded'],
      ['P-04', 'Close-up rust area', 'rust-closeup.jpg', 'Pending']
    ]
  }
};

const fallbackRecord = { id: 1, modelCode: 'YED', chassis: 'MA3EJKD1S00128', trial: 'T1', testType: 'Cyclic corrosion', phase: '1 Phase', location: 'Lab A', source: 'MIC', status: 'Submitted' };
function loadRecord() {
  try {
    const records = JSON.parse(localStorage.getItem(MODEL_RECORDS_KEY));
    return records?.find((record) => String(record.id) === params.get('record')) || records?.[0] || fallbackRecord;
  } catch {
    return fallbackRecord;
  }
}
const record = loadRecord();
const sectionTitleToId = Object.fromEntries(
  Object.entries(sections).map(([sectionId, section]) => [section.title, sectionId])
);

function sectionsForRecord() {
  if (Array.isArray(record.savedChecksheets) && record.savedChecksheets.length) {
    const selected = record.savedChecksheets.filter((sectionId) => sectionId in sections);
    if (selected.length) return selected;
  }
  if (Array.isArray(record.checksheets) && record.checksheets.length) {
    const selected = record.checksheets.map((title) => sectionTitleToId[title]).filter(Boolean);
    if (selected.length) return selected;
  }
  return Object.keys(sections);
}
const availableSectionIds = sectionsForRecord();
if (!availableSectionIds.includes(activeSection)) activeSection = availableSectionIds[0];

function loadFilledForms() {
  try {
    return JSON.parse(localStorage.getItem(FILLED_FORMS_KEY)) || {};
  } catch {
    return {};
  }
}
let filledForms = loadFilledForms();

function filledFormKey() {
  return `${record.id}::${activeSection}`;
}

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function sheetApprovalStatus(sectionId) {
  if (record.sheetApprovals?.[sectionId]) return record.sheetApprovals[sectionId];
  if (record.approvedChecksheets?.includes(sectionId)) return 'Approved';
  if (record.status === 'Approved') return 'Approved';
  return 'Pending';
}
function approvalClass(status) {
  return String(status).toLowerCase().replaceAll(' ', '-');
}
function renderRail() {
  formRail.innerHTML = availableSectionIds.map((id) => `
    <button class="form-tab ${id === activeSection ? 'active' : ''}" type="button" data-section="${id}">
      <span>${sections[id].title}</span>
      ${approvalMode ? `<small class="sheet-state sheet-state--${approvalClass(sheetApprovalStatus(id))}">${sheetApprovalStatus(id)}</small>` : ''}
    </button>
  `).join('');
}
function renderDetails() {
  const fields = [
    ['Model', record.modelCode || '—'],
    ['Chassis No.', record.chassis || '—'],
    ['Trial', record.trial || '—'],
    ['Test Type', record.testType || '—'],
    ['Phase', record.phase || '—']
  ];
  vehicleDetails.innerHTML = fields.map(([label, value]) => `<div class="detail-field"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
}
function renderSection() {
  const section = sections[activeSection] || sections.work_start_up_inspection;
  const rows = filledForms[filledFormKey()] || section.rows;
  const currentApprovalStatus = sheetApprovalStatus(activeSection);
  formTitle.textContent = section.title;
  sourceBadge.textContent = `Raised by ${record.source || 'MIC'} · ${record.location || 'Rust Endurance Lab'}`;
  statusBadge.textContent = approvalMode ? currentApprovalStatus : record.status || 'Submitted';
  statusBadge.className = `record-status sheet-status--${approvalClass(approvalMode ? currentApprovalStatus : record.status || 'Submitted')}`;
  filledTable.innerHTML = `
    <table class="filled-table ${section.wide ? 'corrosion-table' : ''}">
      <thead><tr>${section.columns.map((column) => `<th>${column}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell, cellIndex) => {
        const cls = cell === 'OK' ? 'ok' : cell === 'Pending' ? 'pending' : '';
        if (pageMode === 'fill' && cellIndex > 0) {
          return `<td><input type="text" value="${escapeHtml(cell)}" aria-label="${escapeHtml(section.columns[cellIndex])}" /></td>`;
        }
        return `<td class="${cls}">${escapeHtml(cell)}</td>`;
      }).join('')}</tr>`).join('')}</tbody>
    </table>
  `;
  renderRail();
}

function collectFilledRows() {
  const section = sections[activeSection] || sections.work_start_up_inspection;
  return [...filledTable.querySelectorAll('tbody tr')].map((row, rowIndex) => {
    const original = (filledForms[filledFormKey()] || section.rows)[rowIndex] || [];
    return [...row.cells].map((cell, cellIndex) => {
      const input = cell.querySelector('input');
      return input ? input.value : original[cellIndex] ?? cell.textContent.trim();
    });
  });
}

function saveFilledForm() {
  if (pageMode !== 'fill') return;
  filledForms[filledFormKey()] = collectFilledRows();
  localStorage.setItem(FILLED_FORMS_KEY, JSON.stringify(filledForms));
}

function updateRecordStatus(status) {
  try {
    const records = JSON.parse(localStorage.getItem(MODEL_RECORDS_KEY)) || [];
    const recordIndex = records.findIndex((item) => String(item.id) === String(record.id));
    if (recordIndex >= 0) {
      records[recordIndex] = { ...records[recordIndex], status, updatedAt: new Date().toISOString() };
      localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(records));
    }
  } catch {
    showToast('Unable to update the approval status');
    return false;
  }
  return true;
}

function updateCurrentSheetApproval(status) {
  try {
    const records = JSON.parse(localStorage.getItem(MODEL_RECORDS_KEY)) || [];
    const recordIndex = records.findIndex((item) => String(item.id) === String(record.id));
    if (recordIndex < 0) return false;

    const storedRecord = records[recordIndex];
    const baselineApprovals = Object.fromEntries(
      availableSectionIds.map((sectionId) => [
        sectionId,
        storedRecord.sheetApprovals?.[sectionId]
          || (storedRecord.approvedChecksheets?.includes(sectionId) || storedRecord.status === 'Approved' ? 'Approved' : 'Pending')
      ])
    );
    const sheetApprovals = { ...baselineApprovals, [activeSection]: status };
    const approvedChecksheets = availableSectionIds.filter((sectionId) => sheetApprovals[sectionId] === 'Approved');
    const hasSentBack = availableSectionIds.some((sectionId) => sheetApprovals[sectionId] === 'Sent back');
    const packageStatus = approvedChecksheets.length === availableSectionIds.length
      ? 'Approved'
      : approvedChecksheets.length
        ? 'Partially approved'
        : hasSentBack
          ? 'Sent back'
          : 'Pending';

    records[recordIndex] = {
      ...storedRecord,
      sheetApprovals,
      approvedChecksheets,
      status: packageStatus,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(records));
    record.sheetApprovals = sheetApprovals;
    record.approvedChecksheets = approvedChecksheets;
    record.status = packageStatus;
  } catch {
    showToast('Unable to update this checksheet approval');
    return false;
  }
  return true;
}
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
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
formRail.addEventListener('click', (event) => {
  const button = event.target.closest('[data-section]');
  if (!button) return;
  saveFilledForm();
  activeSection = button.dataset.section;
  renderSection();
});
const saveButton = document.querySelector('#saveButton');
const submitButton = document.querySelector('#submitButton');
const backLinks = document.querySelectorAll('.back-link, .viewer-actions .secondary-button');
if (approvalMode) {
  document.querySelector('.page-heading h1').textContent = 'Approve Checksheet';
  saveButton.textContent = 'Approve';
  submitButton.textContent = 'Send Back';
  const returnHref = params.get('return') === 'model'
    ? '../../model%20menu/'
    : '../../checksheet%20approvals/';
  backLinks.forEach((link) => { link.href = returnHref; });
} else if (pageMode === 'view') {
  saveButton.classList.add('is-hidden');
  submitButton.classList.add('is-hidden');
  document.querySelector('.page-heading h1').textContent = 'View Checksheet';
} else {
  document.querySelector('.page-heading h1').textContent = 'Fill Checksheet';
}
saveButton.addEventListener('click', () => {
  if (approvalMode) {
    if (!updateCurrentSheetApproval('Approved')) return;
    showToast(`${formTitle.textContent} approved for PIC handoff`);
    renderSection();
    return;
  }
  saveFilledForm();
  showToast(`${formTitle.textContent} saved`);
});
submitButton.addEventListener('click', () => {
  if (approvalMode) {
    if (!updateCurrentSheetApproval('Sent back')) return;
    showToast(`${formTitle.textContent} sent back`);
    renderSection();
    return;
  }
  saveFilledForm();
  updateRecordStatus('Submitted');
  showToast(`${formTitle.textContent} submitted`);
  setTimeout(() => { window.location.href = '../'; }, 650);
});

renderDetails();
renderSection();
