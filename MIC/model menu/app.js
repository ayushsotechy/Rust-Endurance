const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const rowsElement = document.querySelector('#modelRows');
const emptyState = document.querySelector('#emptyState');
const recordCount = document.querySelector('#recordCount');
const toast = document.querySelector('#toast');
const MODEL_RECORDS_KEY = 'rustEnduranceMicModelRecords';
const MODEL_ADDITION_STATE_KEY = 'rustEnduranceMicModelAdditionStateV2';
let toastTimer;

const sectionTitles = {
  work_start_up_inspection: 'Work Start up Inspection',
  first_phase_observation_sheet: '1st phase observation sheet',
  operation_durability_cycles: 'Operation Durability Cycles',
  corrosion_coupon_measurement: 'Corrosion Coupon data measurement',
  scribe_line_measurement: 'Scribe line measurement',
  crs_check_sheet: 'CRS check sheet',
  dismantling_inspection: 'Dismantling inspection sheet filled',
  photo_annexure: 'Photo Annexure'
};
const defaultEditableSections = Object.keys(sectionTitles);

const defaultRecords = [
  { id: 1, modelCode: 'YED', trial: 'T1', chassis: 'MA3EJKD1S00128', temp: '80°C', testType: 'Cyclic corrosion', phase: 'Phase 1', location: 'Lab A', remarks: 'Initial validation' },
  { id: 2, modelCode: 'YHB', trial: 'T2', chassis: 'MA3NYFJ1S00457', temp: '60°C', testType: 'Salt spray', phase: 'Phase 2', location: 'Chamber 2', remarks: 'Under observation' },
  { id: 3, modelCode: 'YSD', trial: 'P1', chassis: 'MA3ERLF1S00803', temp: '40°C', testType: 'Humidity', phase: 'Phase 1', location: 'Lab B', remarks: 'Baseline sample' },
  { id: 4, modelCode: 'YWD', trial: 'T1', chassis: 'MA3FJEB1S00591', temp: '80°C', testType: 'Cyclic corrosion', phase: 'Phase 3', location: 'Chamber 1', remarks: 'Final cycle' }
];
let records = loadRecords();

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(MODEL_RECORDS_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    // Fall back to seed records.
  }
  localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(defaultRecords));
  return [...defaultRecords];
}

function saveRecords() {
  localStorage.setItem(MODEL_RECORDS_KEY, JSON.stringify(records));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function actionIcon(type) {
  return type === 'edit'
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h-8v14h12v-8M13 11l6-6 2 2-6 6-3 1z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13"/></svg>';
}

function renderRows(list = records) {
  rowsElement.innerHTML = list.map((record) => `
    <tr>
      <td class="model-code">${escapeHtml(record.modelCode)}</td><td>${escapeHtml(record.trial)}</td><td>${escapeHtml(record.chassis)}</td><td>${escapeHtml(record.temp)}</td><td>${escapeHtml(record.testType)}</td><td><span class="status-pill">${escapeHtml(record.phase)}</span></td><td>${escapeHtml(record.location)}</td><td>${escapeHtml(record.remarks || '—')}</td>
      <td><div class="actions"><button class="action-button" data-action="edit" data-id="${escapeHtml(record.id)}" aria-label="Edit ${escapeHtml(record.modelCode)}">${actionIcon('edit')}</button><button class="action-button delete" data-action="delete" data-id="${escapeHtml(record.id)}" aria-label="Delete ${escapeHtml(record.modelCode)}">${actionIcon('delete')}</button></div></td>
    </tr>`).join('');
  emptyState.hidden = list.length !== 0;
  recordCount.textContent = `${list.length} ${list.length === 1 ? 'record' : 'records'}`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function normalizePhase(value) {
  const phase = String(value || '').trim();
  if (!phase) return '0 Phase';
  const phaseNumberFirst = phase.match(/^(\d+(?:\.\d+)?)\s*Phase$/i);
  if (phaseNumberFirst) return `${phaseNumberFirst[1]} Phase`;
  const phaseWordFirst = phase.match(/^Phase\s*(\d+(?:\.\d+)?)$/i);
  if (phaseWordFirst) return `${phaseWordFirst[1]} Phase`;
  return phase;
}

function sectionsForRecord(record) {
  if (Array.isArray(record.savedChecksheets) && record.savedChecksheets.length) {
    return record.savedChecksheets.filter((sectionId) => sectionId in sectionTitles);
  }
  if (Array.isArray(record.checksheets) && record.checksheets.length) {
    const selected = Object.entries(sectionTitles)
      .filter(([, title]) => record.checksheets.includes(title))
      .map(([sectionId]) => sectionId);
    if (selected.length) return selected;
  }
  return defaultEditableSections;
}

function openRecordForEditing(record) {
  const phase = normalizePhase(record.phase);
  const selectedChecksheets = sectionsForRecord(record);
  const phaseBySection = {
    common_form: phase,
    ...Object.fromEntries(Object.keys(sectionTitles).map((sectionId) => [sectionId, phase]))
  };
  const savedValues = record.formState?.values && typeof record.formState.values === 'object'
    ? record.formState.values
    : {};
  const commonDetails = {
    ...(savedValues['common_form::details'] || {}),
    modelCode: record.modelCode || '',
    chassisNo: record.chassis || '',
    tempSymbol: record.temp || '',
    location: record.location || '',
    testTypePrimary: ['Cyclic corrosion', 'Salt spray', 'Humidity'].includes(record.testType) ? record.testType : '',
    testTypeSecondary: record.testType || '',
    'Trial: first select': record.trial || '',
    'Trial: second select': String(record.phase || '').match(/^Phase\s/i) ? record.phase : '',
    remarks: record.remarks || ''
  };

  localStorage.setItem(MODEL_ADDITION_STATE_KEY, JSON.stringify({
    activeSectionId: 'common_form',
    activePhaseBySection: {
      ...phaseBySection,
      ...(record.formState?.activePhaseBySection || {})
    },
    values: {
      ...savedValues,
      'common_form::details': commonDetails
    },
    workflow: {
      selectedChecksheets,
      savedChecksheets: selectedChecksheets,
      commonSaved: true,
      status: 'draft',
      modelRecordId: record.id
    }
  }));

  window.location.href = `./model%20addition/?edit=${encodeURIComponent(record.id)}`;
}

profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = profileMenu.hidden;
  profileMenu.hidden = !open;
  profileButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (event) => { if (!profileMenu.contains(event.target)) { profileMenu.hidden = true; profileButton.setAttribute('aria-expanded', 'false'); } });
document.querySelectorAll('[data-signout]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.href = homeHref;
  });
});

document.querySelector('#searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const model = document.querySelector('#modelFilter').value.trim().toLowerCase();
  const chassis = document.querySelector('#chassisFilter').value.trim().toLowerCase();
  renderRows(records.filter((record) => record.modelCode.toLowerCase().includes(model) && record.chassis.toLowerCase().includes(chassis)));
});
document.querySelector('#clearFilters').addEventListener('click', () => {
  document.querySelector('#searchForm').reset();
  renderRows();
});

rowsElement.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = button.dataset.id;
  const record = records.find((item) => String(item.id) === String(id));
  if (!record) return;
  if (button.dataset.action === 'edit') {
    openRecordForEditing(record);
    return;
  }
  if (button.dataset.action === 'delete' && window.confirm(`Delete model ${record.modelCode}?`)) {
    records = records.filter((item) => String(item.id) !== String(id));
    saveRecords();
    renderRows();
    showToast(`${record.modelCode} deleted`);
  }
});

document.querySelector('#addModel').addEventListener('click', () => {
  localStorage.removeItem(MODEL_ADDITION_STATE_KEY);
});

renderRows();
