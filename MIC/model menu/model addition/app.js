const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const sectionTabs = document.querySelector('#sectionTabs');
const sectionTitle = document.querySelector('#sectionTitle');
const sectionBody = document.querySelector('#sectionBody');
let toastTimer;
let activeSectionId = 'work_start_up_inspection';
let activePhaseBySection = {
  scribe_line_measurement: '0 Phase',
  crs_check_sheet: '0 Phase',
  dismantling_inspection: '0 Phase',
  photo_annexure: '0 Phase'
};
const STORAGE_KEY = 'rustEnduranceMicModelAdditionState';
let persistedState = loadState();

if (persistedState.activePhaseBySection) {
  activePhaseBySection = { ...activePhaseBySection, ...persistedState.activePhaseBySection };
}

const phaseOptions = ['0 Phase', '0.5 Phase', '1 Phase', '2 Phase', '3 Phase', '4 Phase', '5 Phase', '6 Phase', '7 Phase', '8 Phase', '9 Phase', '10 Phase', '11 Phase', '12 Phase'];
const bodyPanels = ['Hood', 'Front fender', 'Front door', 'Rear door', 'Quarter panel', 'Back door', 'Roof'];
const scribeDirections = ['Left: V', 'Left: H', 'Right: V', 'Right: H'];
const crsRows = [
  ['Roof panel', 'Roof panel'],
  ['Side body panel', 'Opening trim'],
  ['Side body panel', 'Panel'],
  ['Side body panel', 'Fuel lid hinge'],
  ['Side body panel', 'Fuel lid mounting bolts'],
  ['Side body panel', 'Fuel lid spring'],
  ['Side body panel', 'Fuel filler neck'],
  ['Side body panel', 'Fuel filler neck mounting bolts & nuts'],
  ['Side body panel', 'Molding'],
  ['Side body panel', 'Slide door guide rail'],
  ['Side body panel', 'Matching portion with fuel lid box'],
  ['Pillar panel', 'Pillar patching portion'],
  ['Fender panel', 'Opening trim'],
  ['Fender panel', 'Panel'],
  ['Fender panel', 'Fender panel mounting bolts'],
  ['Fender panel', 'Matching portion with inner panel'],
  ['Front hood panel', 'Outer side'],
  ['Front hood panel', 'Inner side'],
  ['Front hood panel', 'Matching portion with inner panel'],
  ['Front hood panel', 'Hinge mounting portion'],
  ['Front hood panel', 'Hinge mounting bolts'],
  ['Front hood panel', 'Lock'],
  ['Front hood panel', 'Striker'],
  ['Front hood panel', 'Lock & striker mounting bolts'],
  ['Side sill panel', 'Side sill panel'],
  ['Skirt panel', 'Front'],
  ['Skirt panel', 'Rear'],
  ['Skirt panel', 'Skirt panel mounting bolts'],
  ['Door panel', 'Front door L'],
  ['Door panel', 'Front door R'],
  ['Door panel', 'Rear door L'],
  ['Door panel', 'Rear door R'],
  ['Door panel', 'Back door/Trunk'],
  ['Matching with inner panel', 'Front door L'],
  ['Matching with inner panel', 'Front door R'],
  ['Matching with inner panel', 'Rear door L'],
  ['Matching with inner panel', 'Rear door R'],
  ['Matching with inner panel', 'Back door/Trunk'],
  ['Door sash', 'Front door L'],
  ['Door sash', 'Front door R'],
  ['Door sash', 'Rear door L'],
  ['Door sash', 'Rear door R'],
  ['Door sash', 'Back door/Trunk'],
  ['Matching with hinge', 'Front door L'],
  ['Matching with hinge', 'Front door R'],
  ['Matching with hinge', 'Rear door L'],
  ['Matching with hinge', 'Rear door R'],
  ['Matching with hinge', 'Back door/Trunk'],
  ['Hinge arm mounting portion', 'Front door L'],
  ['Hinge arm mounting portion', 'Front door R'],
  ['Hinge arm mounting portion', 'Rear door L'],
  ['Hinge arm mounting portion', 'Rear door R'],
  ['Hinge arm mounting portion', 'Back door/Trunk'],
  ['Hinge arm mounting bolts, pins', 'Front door L'],
  ['Hinge arm mounting bolts, pins', 'Front door R'],
  ['Hinge arm mounting bolts, pins', 'Rear door L'],
  ['Hinge arm mounting bolts, pins', 'Rear door R'],
  ['Hinge arm mounting bolts, pins', 'Back door/Trunk'],
  ['Outside handle or button', 'Front door L'],
  ['Outside handle or button', 'Front door R'],
  ['Outside handle or button', 'Rear door L'],
  ['Outside handle or button', 'Rear door R'],
  ['Outside handle or button', 'Back door/Trunk']
];
const dismantlingRows = [
  ['Front hood', 'Front hood', ''],
  ['Door', 'Front', 'L'],
  ['Door', 'Front', 'R'],
  ['Door', 'Rear', 'L'],
  ['Door', 'Rear', 'R'],
  ['Door', 'Back', ''],
  ['Trunk lid', 'Trunk lid', ''],
  ['Cross member', 'Front', ''],
  ['Cross member', 'Rear floor', ''],
  ['Member', 'Front side (portions which mount suspension arm)', 'L'],
  ['Member', 'Front side (portions which mount suspension arm)', 'R'],
  ['Member', 'Floor side', 'L'],
  ['Member', 'Floor side', 'R'],
  ['Member', 'Rear floor side', 'L'],
  ['Member', 'Rear floor side', 'R'],
  ['Member', 'Back panel upper', ''],
  ['Pillar', 'Front', 'L'],
  ['Pillar', 'Front', 'R'],
  ['Pillar', 'Center', 'L'],
  ['Pillar', 'Center', 'R'],
  ['Pillar', 'Rear', 'L'],
  ['Pillar', 'Rear', 'R'],
  ['Door hinge', 'Front', 'L'],
  ['Door hinge', 'Front', 'R'],
  ['Door hinge', 'Rear', 'L'],
  ['Door hinge', 'Rear', 'R'],
  ['Side sill', 'Left', ''],
  ['Side sill', 'Right', ''],
  ['Roof side rail', 'Left', ''],
  ['Roof side rail', 'Right', ''],
  ['Frame, rear suspension', 'Frame, rear suspension', ''],
  ['Housing, rear combination', 'Housing, rear combination', ''],
  ['Fuel tank', 'Fuel tank', ''],
  ['Off road car - frame assy', 'Frame assy', ''],
  ['Off road car - member', 'Front panel', ''],
  ['Off road car - member', 'Rear floor tale', ''],
  ['Off road car - member', 'Center floor', ''],
  ['Off road car - member', 'Front side', 'L'],
  ['Off road car - member', 'Front side', 'R'],
  ['Off road car', 'Panel, soft top attachment', ''],
  ['Cab over type - panel', 'Front', ''],
  ['Cab over type - panel', 'Tale skirt', ''],
  ['Cab over type - panel', 'Rear floor upper', ''],
  ['Cab over type - panel', 'Quarter', 'L'],
  ['Cab over type - panel', 'Quarter', 'R'],
  ['Cab over type - panel', 'Slide rail', 'L'],
  ['Cab over type - panel', 'Slide rail', 'R'],
  ['Cab over type - member', 'Rear seat leg', ''],
  ['Cab over type - member', 'Engine service hole, rear', ''],
  ['Cab over type - member', 'Front floor', 'L'],
  ['Cab over type - member', 'Front floor', 'R'],
  ['Front suspension arm ball joint', 'Front suspension arm ball joint', ''],
  ['Remarks', 'Remarks', '']
];
const sharedDetailFields = [
  { type: 'input', label: 'Model Code:', name: 'modelCode' },
  { type: 'input', label: 'Chassis No', name: 'chassisNo' },
  { type: 'input', label: 'Temp Symbol:', name: 'tempSymbol' },
  { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'] },
  { type: 'select', label: 'Test Type:', name: 'testTypePrimary', options: ['Cyclic corrosion', 'Salt spray', 'Humidity'] },
  { type: 'input', label: 'Test Type:', name: 'testTypeSecondary' },
  { type: 'dual-select', label: 'Trail:', name: 'trial', optionsA: ['T1', 'T2', 'P1'], optionsB: ['Phase 1', 'Phase 2', 'Phase 3'] },
  { type: 'select', label: 'Applicable checksheet', name: 'applicableChecksheet', options: [] },
  { type: 'input', label: 'Remarks', name: 'remarks' },
  { type: 'select', label: 'Phases:', name: 'phase', options: phaseOptions }
];

const sections = {
  work_start_up_inspection: {
    title: 'Work Start up Inspection',
    formClass: 'layout-standard',
    columns: ['Applicable', 'Sl No.', 'Category', 'Check points'],
    rows: [
      [{ type: 'radio' }, '1', 'Water pump belt or', 'Crack, damage'],
      [{ type: 'radio' }, '2', 'Alternator belt', 'Tension'],
      [{ type: 'radio' }, '3', 'Engine oil', 'Leak'],
      [{ type: 'radio' }, '4', 'Coolant hose', 'Bulge, seepage']
    ]
  },
  first_phase_observation_sheet: {
    title: '1st phase observation sheet',
    formClass: 'layout-compact',
    fields: [
      { type: 'input', label: 'Model Code:', name: 'modelCode' },
      { type: 'input', label: 'Trial No', name: 'trialNo' },
      { type: 'select', label: 'Observation Type', name: 'observationType', options: ['Visual', 'Dimensional', 'Functional'] },
      { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'] },
      { type: 'input', label: 'Inspector', name: 'inspector' },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    columns: ['Applicable', 'Sl No.', 'Observation', 'Reference', 'Status'],
    rows: [
      [{ type: 'radio' }, '1', 'Door alignment', 'Spec A', 'Pending'],
      [{ type: 'radio' }, '2', 'Torque mark', 'Spec B', 'Observed'],
      [{ type: 'radio' }, '3', 'Panel gap', 'Spec C', 'Pending'],
      [{ type: 'radio' }, '4', 'Seal fitment', 'Spec D', 'Observed']
    ]
  },
  operation_durability_cycles: {
    title: 'Operation Durability Cycles',
    formClass: 'layout-standard',
    fields: [
      { type: 'input', label: 'Cycle No', name: 'cycleNo' },
      { type: 'select', label: 'Phase', name: 'phase', options: ['Phase 1', 'Phase 2', 'Phase 3'] },
      { type: 'input', label: 'Duration', name: 'duration' },
      { type: 'select', label: 'Environment', name: 'environment', options: ['Lab A', 'Lab B', 'Chamber 2'] },
      { type: 'input', label: 'Model Code', name: 'modelCode' },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    columns: ['Applicable', 'Cycle', 'Checkpoint', 'Expected condition'],
    rows: [
      [{ type: 'radio' }, '1', 'Heat soak', 'Stable'],
      [{ type: 'radio' }, '2', 'Vibration', 'No looseness'],
      [{ type: 'radio' }, '3', 'Cooling', 'No deformation'],
      [{ type: 'radio' }, '4', 'Post-run', 'Nominal']
    ]
  },
  corrosion_coupon_measurement: {
    title: 'Corrosion Coupon data measurement',
    formClass: 'layout-compact',
    fields: [
      { type: 'input', label: 'Coupon ID', name: 'couponId' },
      { type: 'input', label: 'Exposure Days', name: 'exposureDays' },
      { type: 'select', label: 'Media', name: 'media', options: ['Salt spray', 'Humidity', 'Cyclic corrosion'] },
      { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'] },
      { type: 'input', label: 'Measured By', name: 'measuredBy' },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    columns: ['Applicable', 'Coupon', 'Measurement', 'Acceptance', 'Status'],
    rows: [
      [{ type: 'radio' }, 'C-01', 'Mass loss', 'Within limit', 'Pending'],
      [{ type: 'radio' }, 'C-02', 'Surface pitting', 'None visible', 'Observed'],
      [{ type: 'radio' }, 'C-03', 'Coating lift', 'No lift', 'Pending'],
      [{ type: 'radio' }, 'C-04', 'Rust spread', 'Minimal', 'Observed']
    ]
  },
  scribe_line_measurement: {
    title: 'Scribe line measurement',
    phaseSheet: 'scribe'
  },
  crs_check_sheet: {
    title: 'CRS check sheet',
    phaseSheet: 'crs'
  },
  dismantling_inspection: {
    title: 'Dismantling inspection sheet filled',
    phaseSheet: 'dismantling'
  },
  photo_annexure: {
    title: 'Photo Annexure',
    phaseSheet: 'standard',
    columns: ['Applicable', 'Photo Set', 'Description', 'Upload status'],
    rows: [
      [{ type: 'radio' }, 'P-01', 'Front assembly', 'Uploaded'],
      [{ type: 'radio' }, 'P-02', 'Side profile', 'Uploaded'],
      [{ type: 'radio' }, 'P-03', 'Underbody', 'Pending'],
      [{ type: 'radio' }, 'P-04', 'Close-up rust area', 'Pending']
    ]
  }
};

if (persistedState.activeSectionId && persistedState.activeSectionId in sections) {
  activeSectionId = persistedState.activeSectionId;
}

function closeProfileMenu() {
  profileMenu.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
}

function showToast(message) {
  clearTimeout(toastTimer);
  let toast = document.querySelector('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    activeSectionId,
    activePhaseBySection,
    values: persistedState.values || {}
  }));
}

function stateKey(sectionId = activeSectionId) {
  return `${sectionId}::${activePhaseBySection[sectionId] || phaseOptions[0]}`;
}

function detailsKey(sectionId = activeSectionId) {
  return `${sectionId}::details`;
}

function controlStoreKey(control) {
  return control.closest('.addition-form') ? detailsKey() : stateKey();
}

function getValueStore(key = stateKey()) {
  persistedState.values ||= {};
  persistedState.values[key] ||= {};
  return persistedState.values[key];
}

function controlKey(control, index) {
  return control.name || control.getAttribute('aria-label') || `control-${index}`;
}

function restoreControls() {
  sectionBody.querySelectorAll('input, select, textarea').forEach((control, index) => {
    if (control.matches('[data-phase-select]')) return;
    const store = getValueStore(controlStoreKey(control));
    const key = controlKey(control, index);
    if (!(key in store)) return;

    if (control.type === 'checkbox') {
      control.checked = Boolean(store[key]);
      return;
    }

    control.value = store[key];
  });
}

function persistControls() {
  sectionBody.querySelectorAll('input, select, textarea').forEach((control, index) => {
    if (control.matches('[data-phase-select]')) return;
    const store = getValueStore(controlStoreKey(control));
    const key = controlKey(control, index);
    store[key] = control.type === 'checkbox' ? control.checked : control.value;
  });
  saveState();
}

function renderField(field) {
  const spanClass = field.span ? ` ${field.span}` : '';

  if (field.type === 'dual-select') {
    return `
      <label class="field trail-group${spanClass}">
        <span>${field.label}</span>
        <div class="dual-selects">
          <select aria-label="${field.label} first select">
            <option value=""></option>
            ${field.optionsA.map((option) => `<option>${option}</option>`).join('')}
          </select>
          <select aria-label="${field.label} second select">
            <option value=""></option>
            ${field.optionsB.map((option) => `<option>${option}</option>`).join('')}
          </select>
        </div>
      </label>
    `;
  }

  if (field.type === 'select') {
    const activePhase = activePhaseBySection[activeSectionId] || phaseOptions[0];
    return `
      <label class="field select-field${spanClass}">
        <span>${field.label}</span>
        <select name="${field.name}" ${field.name === 'phase' ? 'data-phase-select' : ''}>
          <option value=""></option>
          ${field.options.map((option) => `<option ${field.name === 'phase' && option === activePhase ? 'selected' : ''}>${option}</option>`).join('')}
        </select>
      </label>
    `;
  }

  return `
    <label class="field${spanClass}">
      <span>${field.label}</span>
      <input type="text" name="${field.name}" placeholder="" />
    </label>
  `;
}

function getSharedFields(sectionId) {
  const config = sections[sectionId];

  return sharedDetailFields.map((field) => {
    if (field.name === 'applicableChecksheet') {
      return { ...field, options: [config.title] };
    }
    return field;
  });
}

function renderSharedDetailsForm(sectionId) {
  return `
    <form class="addition-form layout-standard">
      ${getSharedFields(sectionId).map(renderField).join('')}
      <button class="primary-button plan-button" type="button" data-plan data-section="${sectionId}">Plan</button>
    </form>
  `;
}

function renderTable(columns, rows) {
  return `
    <div class="table-frame applicable-table">
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map((cell) => {
                if (cell && cell.type === 'radio') {
                  return '<td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>';
                }
                return `<td>${cell}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderScribeMatrix(sectionId) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
    <section class="sheet-detail scribe-sheet" aria-label="Scribe line measurement ${activePhase}">
      <div class="table-frame scribe-frame applicable-table">
        <table class="scribe-table">
          <thead>
            <tr>
              <th>Applicable</th>
              <th>Category</th>
              ${bodyPanels.map((panel) => `<th>${panel}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${scribeDirections.map((direction, index) => `
              <tr>
                <td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>
                <td>${direction}</td>
                ${bodyPanels.map((panel) => `
                  <td>
                    <input type="text" aria-label="${activePhase} ${direction} ${panel}" disabled />
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
        <button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>
      </div>
    </section>
  `;
}

function renderCrsSheet(sectionId) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
    <section class="sheet-detail crs-sheet" aria-label="CRS check sheet ${activePhase}">
      <div class="table-frame applicable-table crs-frame">
        <table class="crs-table">
          <thead>
            <tr>
              <th>Applicable</th>
              <th>Inspection area</th>
              <th>Inspection portion</th>
              <th>Film t before (um)</th>
              <th>Film t after (um)</th>
              <th>Result</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            ${crsRows.map(([area, portion]) => `
              <tr>
                <td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>
                <td>${area}</td>
                <td>${portion}</td>
                <td><input type="text" aria-label="${activePhase} ${area} ${portion} film before" disabled /></td>
                <td><input type="text" aria-label="${activePhase} ${area} ${portion} film after" disabled /></td>
                <td>
                  <select aria-label="${activePhase} ${area} ${portion} result" disabled>
                    <option value=""></option>
                    <option>OK</option>
                    <option>NG</option>
                    <option>Observation</option>
                  </select>
                </td>
                <td><input type="text" aria-label="${activePhase} ${area} ${portion} remark" disabled /></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <p class="sheet-note">Including rust, water with rust at each hole edge and panel matching portion.</p>
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
        <button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>
      </div>
    </section>
  `;
}

function renderDismantlingSheet(sectionId) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
    <section class="sheet-detail dismantling-sheet" aria-label="Dismantling inspection sheet ${activePhase}">
      <div class="table-frame applicable-table dismantling-frame">
        <table class="dismantling-table">
          <thead>
            <tr>
              <th>Applicable</th>
              <th>Removal / Fuse cut parts</th>
              <th>Position</th>
              <th>Side</th>
              <th>Corrosion rating scale of parts inside</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            ${dismantlingRows.map(([part, position, side]) => `
              <tr>
                <td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>
                <td>${part}</td>
                <td>${position}</td>
                <td>${side}</td>
                <td>
                  <select aria-label="${activePhase} ${part} ${position} corrosion rating" disabled>
                    <option value=""></option>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </td>
                <td><input type="text" aria-label="${activePhase} ${part} ${position} comment" disabled /></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
        <button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>
      </div>
    </section>
  `;
}

function renderStandardPhaseSheet(sectionId, config) {
  const activePhase = activePhaseBySection[sectionId] || phaseOptions[0];

  return `
    <section class="sheet-detail" aria-label="${config.title} ${activePhase}">
      ${renderTable(config.columns, config.rows)}
      <div class="sheet-actions">
        <button class="primary-button save-sheet" type="button" data-save-sheet>Save</button>
        <button class="primary-button submit-sheet" type="button" data-submit-sheet>Submit</button>
      </div>
    </section>
  `;
}

function renderPhaseSheet(sectionId, config) {
  if (config.phaseSheet === 'scribe') return renderScribeMatrix(sectionId);
  if (config.phaseSheet === 'crs') return renderCrsSheet(sectionId);
  if (config.phaseSheet === 'dismantling') return renderDismantlingSheet(sectionId);
  return renderStandardPhaseSheet(sectionId, config);
}

function renderSection(sectionId) {
  const config = sections[sectionId];
  if (!config) return;

  activeSectionId = sectionId;
  persistedState.activeSectionId = sectionId;
  sectionTitle.textContent = config.title;
  sectionBody.innerHTML = `
    ${renderSharedDetailsForm(sectionId)}
    ${config.phaseSheet ? renderPhaseSheet(sectionId, config) : renderTable(config.columns, config.rows)}
  `;

  sectionTabs.querySelectorAll('[data-section]').forEach((button) => {
    button.classList.toggle('active', button.dataset.section === sectionId);
    button.setAttribute('aria-pressed', String(button.dataset.section === sectionId));
  });

  const planButton = sectionBody.querySelector('[data-plan]');
  if (planButton) {
    planButton.addEventListener('click', () => {
      window.location.href = `./plan/?section=${encodeURIComponent(sectionId)}`;
    });
  }

  const phaseSelect = sectionBody.querySelector('[data-phase-select]');
  if (phaseSelect) {
    phaseSelect.addEventListener('change', () => {
      persistControls();
      activePhaseBySection[sectionId] = phaseSelect.value || phaseOptions[0];
      persistedState.activePhaseBySection = { ...activePhaseBySection };
      saveState();
      renderSection(sectionId);
    });
  }

  const saveSheetButton = sectionBody.querySelector('[data-save-sheet]');
  if (saveSheetButton) {
    saveSheetButton.addEventListener('click', () => {
      persistControls();
      showToast(`${config.title} ${activePhaseBySection[sectionId]} saved`);
    });
  }

  const submitSheetButton = sectionBody.querySelector('[data-submit-sheet]');
  if (submitSheetButton) {
    submitSheetButton.addEventListener('click', () => {
      persistControls();
      showToast(`${config.title} ${activePhaseBySection[sectionId]} submitted`);
    });
  }

  restoreControls();

  sectionBody.querySelectorAll('[data-applicable-toggle]').forEach((toggle) => {
    const row = toggle.closest('tr');
    const updateRow = () => {
      row.classList.toggle('is-applicable', toggle.checked);
      row.querySelectorAll('input[type="text"], textarea, select').forEach((field) => {
        field.disabled = !toggle.checked;
      });
    };
    toggle.addEventListener('change', updateRow);
    updateRow();
  });

  sectionBody.addEventListener('input', persistControls);
  sectionBody.addEventListener('change', persistControls);
  saveState();
}

profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const shouldOpen = profileMenu.hidden;
  profileMenu.hidden = !shouldOpen;
  profileButton.setAttribute('aria-expanded', String(shouldOpen));
});

document.addEventListener('click', (event) => {
  if (!profileMenu.contains(event.target)) closeProfileMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProfileMenu();
    profileButton.focus();
  }
});

document.querySelectorAll('[data-signout]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.href = homeHref;
  });
});

sectionTabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-section]');
  if (!button || button.dataset.section === activeSectionId) return;
  persistControls();
  renderSection(button.dataset.section);
});

renderSection(activeSectionId);
