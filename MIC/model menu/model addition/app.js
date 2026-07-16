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
const legacyRadioCell = () => ({ type: 'legacy-radio' });
const emptyCell = () => ({ type: 'empty' });
const inputCell = (value = '', label = 'Editable table cell') => ({ type: 'input', value, label });
const couponMeasurementLabels = [
  'initial check date',
  'initial weight',
  'final check date',
  'final weight',
  'weight loss',
  'rust progress'
];
const couponRow = (categoryCell, couponNo, runningDay = '', measurements = []) => [
  legacyRadioCell(),
  categoryCell,
  inputCell(couponNo, `Coupon ${couponNo} number`),
  inputCell(runningDay, `Coupon ${couponNo} running day`),
  ...couponMeasurementLabels.map((label, index) => (
    inputCell(measurements[index] ?? '', `Coupon ${couponNo} ${label}`)
  ))
];

const localDetailFields = [
  { type: 'input', label: 'Model Code:', name: 'modelCode' },
  { type: 'input', label: 'Chassis No', name: 'chassisNo' },
  { type: 'input', label: 'Temp Symbol:', name: 'tempSymbol' },
  { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'] },
  { type: 'select', label: 'Test Type:', name: 'testTypePrimary', options: ['Cyclic corrosion', 'Salt spray', 'Humidity'] },
  { type: 'input', label: 'Test Type:', name: 'testTypeSecondary' },
  { type: 'dual-select', label: 'Trail:', name: 'trial', optionsA: ['T1', 'T2', 'P1'], optionsB: ['Phase 1', 'Phase 2', 'Phase 3'] },
  { type: 'select', label: 'Applicable checksheet', name: 'applicableChecksheet', options: ['Work Start up Inspection', '1st phase observation sheet', 'CRS check sheet'] },
  { type: 'input', label: 'Remarks', name: 'remarks' },
  { type: 'select', label: 'Phases:', name: 'phase', options: phaseOptions }
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
  { type: 'select', label: 'Phases:', name: 'phase', options: phaseOptions, phaseControlled: true }
];

const sections = {
  work_start_up_inspection: {
    title: 'Work Start up Inspection',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Sl No.', 'Category', 'Check points'],
    rows: [
      [legacyRadioCell(), '1', 'Water pump belt or', 'Crack, damage'],
      [legacyRadioCell(), '2', 'Alternator belt', 'Tension'],
      [legacyRadioCell(), '3', 'Engine oil', 'Leak'],
      [legacyRadioCell(), '4', 'Coolant', 'Leak'],
      [
        legacyRadioCell(),
        '5',
        { text: 'Battery\nAuxiliary battery (electric vehicle, hybrid electric vehicle)', className: 'multiline-cell' },
        { text: '• Leak\n• Fluid level\n• Terminal voltage (electric vehicle, hybrid electric vehicle) (     ) V', className: 'multiline-cell' }
      ],
      [legacyRadioCell(), '6', 'Fuel', 'Leak'],
      [
        legacyRadioCell(),
        '7',
        'Brake',
        {
          text: '• Leak\n• Parking brake lever pulling stroke (     ) teeth\n• Foot brake pedal stroke allowance when treading to end (     ) mm\n• Foot brake pedal end play stroke 1–8 mm\n• Fluid level',
          className: 'multiline-cell'
        }
      ],
      [
        legacyRadioCell(),
        '8',
        'Electric vacuum pump (electric vehicle, hybrid electric vehicle)',
        'Operation'
      ],
      [legacyRadioCell(), '9', 'Gear oil', 'Leak'],
      [legacyRadioCell(), '10', 'Clutch', 'Play at pedal tip'],
      [
        legacyRadioCell(),
        '11',
        'Tire',
        { text: '• Abnormal wear, damage\n• Air pressure', className: 'multiline-cell' }
      ],
      [legacyRadioCell(), '12', 'Exhaust gas', 'Leak, smoke color, smoke volume'],
      [
        legacyRadioCell(),
        '13',
        'Steering',
        { text: '• Looseness, noise, abnormal heaviness during operation\n• Play', className: 'multiline-cell' }
      ],
      [legacyRadioCell(), '14', 'Door lock, hood lock', 'Operation'],
      [legacyRadioCell(), '15', 'Mirror, sun visor', 'Operation, retention'],
      [legacyRadioCell(), '16', 'Seatbelt', 'Operation'],
      [legacyRadioCell(), '17', 'Warning lamps lighting', 'OK/NG']
    ]
  },
  first_phase_observation_sheet: {
    title: '1st phase observation sheet',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Sl No.', 'Observation', 'Criteria', 'Actual', 'Attachment'],
    rows: [
      [legacyRadioCell(), '1', '', '', '', ''],
      [legacyRadioCell(), '1', '', '', '', ''],
      [legacyRadioCell(), '1', '', '', '', '']
    ]
  },
  operation_durability_cycles: {
    title: 'Operation Durability Cycles',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Sl No.', 'Category', 'Check points'],
    rows: [
      [legacyRadioCell(), '1', 'Front door outside handle', 'Open/Close'],
      [legacyRadioCell(), '2', 'Front door inside handle', 'Open/Close'],
      [legacyRadioCell(), '3', 'Front door regulator', 'Open/Close'],
      [legacyRadioCell(), '4', 'Front door inside lock', 'Lock/Free'],
      [legacyRadioCell(), '5', 'Front door key', 'Lock/Free'],
      [legacyRadioCell(), '6', 'Outside mirror (body side)', '90° operation'],
      [legacyRadioCell(), '7', 'Outside mirror (mirror side)', 'Up/Down/Left/Right'],
      [legacyRadioCell(), '8', 'Front seat', 'Installation/Removal'],
      [legacyRadioCell(), '9', 'Rear door outside handle', 'Open/Close'],
      [legacyRadioCell(), '10', 'Rear door inside handle', 'Open/Close'],
      [legacyRadioCell(), '11', 'Rear door regulator', 'Open/Close'],
      [legacyRadioCell(), '12', 'Rear door inside lock', 'Lock/Free'],
      [legacyRadioCell(), '13', 'Quarter window', 'Open/Close'],
      [legacyRadioCell(), '14', 'Back door outside handle', 'Open/Close'],
      [legacyRadioCell(), '15', 'Back door opener', 'Open/Close'],
      [legacyRadioCell(), '16', 'Back door window fastener', 'Open/Close'],
      [legacyRadioCell(), '17', 'Back door key', 'Lock/Free'],
      [legacyRadioCell(), '18', 'Trunk lid key', 'Lock/Free'],
      [legacyRadioCell(), '19', 'Side gate', 'Open/Close'],
      [legacyRadioCell(), '20', 'Rear gate', 'Open/Close'],
      [legacyRadioCell(), '21', 'Front hood', 'Open/Close'],
      [legacyRadioCell(), '22', 'Engine oil level gauge', 'Installation/Removal'],
      [legacyRadioCell(), '23', 'Radiator cap', 'Installation/Removal'],
      [legacyRadioCell(), '24', 'Radio antenna', ''],
      [legacyRadioCell(), '25', 'Fuel inlet lid', 'Open/Close'],
      [legacyRadioCell(), '26', 'Fuel tank cap', 'Installation/Removal'],
      [legacyRadioCell(), '27', 'Trunk lid opener', 'Open/Close'],
      [legacyRadioCell(), '28', 'Rear gate inside lock', 'Open/Close'],
      [legacyRadioCell(), '29', 'Electric remote control mirror', 'Up/Down/Left/Right'],
      [legacyRadioCell(), '30', 'Electric back door lock switch', 'Lock/Free'],
      [legacyRadioCell(), '31', 'Electric door inside lock', 'Lock/Free'],
      [legacyRadioCell(), '32', 'Power window', 'Open/Close'],
      [legacyRadioCell(), '33', 'Sun roof', 'Open/Close'],
      [legacyRadioCell(), '34', 'Sun roof', 'Installation/Removal'],
      [legacyRadioCell(), '35', 'Charging lid', 'Open/Close']
    ]
  },
  corrosion_coupon_measurement: {
    title: 'Corrosion Coupon data measurement',
    preserveLocal: true,
    legacyTable: true,
    columns: ['Applicable', 'Category', 'Coupon no.', 'Running Day', 'Initial check date', 'Initial weight', 'Final Check Date', 'Final Weight', 'Weight Loss', 'Rust Progress (µm)'],
    rows: [
      couponRow({ text: 'Underbody', rowSpan: 10, className: 'group-label' }, '1', '5th'),
      couponRow(emptyCell(), '2', '6th'),
      couponRow(emptyCell(), '3', '7th'),
      couponRow(emptyCell(), '4', '8th'),
      couponRow(emptyCell(), '5', '9th'),
      couponRow(emptyCell(), '6', '10th'),
      couponRow(emptyCell(), '7', '11th'),
      couponRow(emptyCell(), '8', '12th'),
      couponRow(emptyCell(), '9', '13th', ['14.01.2025', 'o', 'o', 'o', 'o', 'o']),
      couponRow(emptyCell(), '10', '14th', ['14.01.2025', 'o', 'o', 'o', 'o', 'o']),
      couponRow({ text: 'Exterior', rowSpan: 4, className: 'group-label' }, '21'),
      couponRow(emptyCell(), '22'),
      couponRow(emptyCell(), '23'),
      couponRow(emptyCell(), '24'),
      couponRow({ text: 'Under hood', rowSpan: 2, className: 'group-label' }, '11'),
      couponRow(emptyCell(), '12')
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
    const isPhaseControlled = Boolean(field.phaseControlled);
    return `
      <label class="field select-field${spanClass}">
        <span>${field.label}</span>
        <select name="${field.name}" ${isPhaseControlled ? 'data-phase-select' : ''}>
          <option value=""></option>
          ${field.options.map((option) => `<option ${isPhaseControlled && option === activePhase ? 'selected' : ''}>${option}</option>`).join('')}
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
  if (config.preserveLocal) return localDetailFields;

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

function renderTableCell(cell) {
  if (cell && cell.type === 'radio') {
    return '<td><label class="applicable-cell"><input type="checkbox" data-applicable-toggle /><span></span></label></td>';
  }

  if (cell && cell.type === 'legacy-radio') {
    return '<td><label class="radio-cell"><input type="radio" name="applicable" /><span></span></label></td>';
  }

  if (cell && cell.type === 'empty') {
    return '';
  }

  if (cell && cell.type === 'input') {
    const value = String(cell.value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    const label = String(cell.label ?? 'Editable table cell')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    return `<td class="editable-table-cell"><input class="table-input" type="text" value="${value}" aria-label="${label}" /></td>`;
  }

  if (cell && typeof cell === 'object') {
    const rowSpan = cell.rowSpan ? ` rowspan="${cell.rowSpan}"` : '';
    const colSpan = cell.colSpan ? ` colspan="${cell.colSpan}"` : '';
    const className = cell.className ? ` class="${cell.className}"` : '';
    return `<td${rowSpan}${colSpan}${className}>${cell.text ?? ''}</td>`;
  }

  return `<td>${cell ?? ''}</td>`;
}

function renderTable(columns, rows, legacyTable = false) {
  const frameClass = legacyTable ? 'table-frame' : 'table-frame applicable-table';
  return `
    <div class="${frameClass}">
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map(renderTableCell).join('')}
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
    ${config.phaseSheet ? renderPhaseSheet(sectionId, config) : renderTable(config.columns, config.rows, config.legacyTable)}
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
