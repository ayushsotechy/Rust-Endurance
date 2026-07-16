const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const sectionTabs = document.querySelector('#sectionTabs');
const sectionTitle = document.querySelector('#sectionTitle');
const sectionBody = document.querySelector('#sectionBody');

let activeSectionId = 'work_start_up_inspection';

const radioCell = () => ({ type: 'radio' });
const emptyCell = () => ({ type: 'empty' });
const inputCell = (value = '') => ({ type: 'input', value });
const couponRow = (categoryCell, couponNo, runningDay = '', measurements = []) => [
  radioCell(),
  categoryCell,
  inputCell(couponNo),
  inputCell(runningDay),
  ...Array.from({ length: 6 }, (_, index) => inputCell(measurements[index] ?? ''))
];

const modelAdditionFields = [
  { type: 'input', label: 'Model Code:', name: 'modelCode' },
  { type: 'input', label: 'Chassis No', name: 'chassisNo' },
  { type: 'input', label: 'Temp Symbol:', name: 'tempSymbol' },
  { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'] },
  { type: 'select', label: 'Test Type:', name: 'testTypePrimary', options: ['Cyclic corrosion', 'Salt spray', 'Humidity'] },
  { type: 'input', label: 'Test Type:', name: 'testTypeSecondary' },
  { type: 'dual-select', label: 'Trail:', name: 'trial', optionsA: ['T1', 'T2', 'P1'], optionsB: ['Phase 1', 'Phase 2', 'Phase 3'] },
  { type: 'select', label: 'Applicable checksheet', name: 'applicableChecksheet', options: ['Work Start up Inspection', '1st phase observation sheet', 'CRS check sheet'] },
  { type: 'input', label: 'Remarks', name: 'remarks' },
  { type: 'select', label: 'Phases:', name: 'phase', options: ['Phase 1', 'Phase 2', 'Phase 3'] }
];

const sections = {
  work_start_up_inspection: {
    title: 'Work Start up Inspection',
    header: 'MIC Checksheet Builder',
    table: {
      columns: ['Applicable', 'Sl No.', 'Category', 'Check points'],
      rows: [
        [radioCell(), '1', 'Water pump belt or', 'Crack, damage'],
        [radioCell(), '2', 'Alternator belt', 'Tension'],
        [radioCell(), '3', 'Engine oil', 'Leak'],
        [radioCell(), '4', 'Coolant', 'Leak'],
        [
          radioCell(),
          '5',
          { text: 'Battery\nAuxiliary battery (electric vehicle, hybrid electric vehicle)', className: 'multiline-cell' },
          { text: '• Leak\n• Fluid level\n• Terminal voltage (electric vehicle, hybrid electric vehicle) (     ) V', className: 'multiline-cell' }
        ],
        [radioCell(), '6', 'Fuel', 'Leak'],
        [
          radioCell(),
          '7',
          'Brake',
          {
            text: '• Leak\n• Parking brake lever pulling stroke (     ) teeth\n• Foot brake pedal stroke allowance when treading to end (     ) mm\n• Foot brake pedal end play stroke 1–8 mm\n• Fluid level',
            className: 'multiline-cell'
          }
        ],
        [
          radioCell(),
          '8',
          'Electric vacuum pump (electric vehicle, hybrid electric vehicle)',
          'Operation'
        ],
        [radioCell(), '9', 'Gear oil', 'Leak'],
        [radioCell(), '10', 'Clutch', 'Play at pedal tip'],
        [
          radioCell(),
          '11',
          'Tire',
          { text: '• Abnormal wear, damage\n• Air pressure', className: 'multiline-cell' }
        ],
        [radioCell(), '12', 'Exhaust gas', 'Leak, smoke color, smoke volume'],
        [
          radioCell(),
          '13',
          'Steering',
          { text: '• Looseness, noise, abnormal heaviness during operation\n• Play', className: 'multiline-cell' }
        ],
        [radioCell(), '14', 'Door lock, hood lock', 'Operation'],
        [radioCell(), '15', 'Mirror, sun visor', 'Operation, retention'],
        [radioCell(), '16', 'Seatbelt', 'Operation'],
        [radioCell(), '17', 'Warning lamps lighting', 'OK/NG']
      ]
    }
  },
  first_phase_observation_sheet: {
    title: '1st phase observation sheet',
    header: 'MIC Checksheet Builder',
    table: {
      columns: ['Applicable', 'Sl No.', 'Observation', 'Criteria', 'Actual', 'Attachment'],
      rows: [
        [radioCell(), '1', '', '', '', ''],
        [radioCell(), '1', '', '', '', ''],
        [radioCell(), '1', '', '', '', '']
      ]
    }
  },
  operation_durability_cycles: {
    title: 'Operation Durability Cycles',
    header: 'MIC Checksheet Builder',
    table: {
      columns: ['Applicable', 'Sl No.', 'Category', 'Check points'],
      rows: [
        [radioCell(), '1', 'Front door outside handle', 'Open/Close'],
        [radioCell(), '2', 'Front door inside handle', 'Open/Close'],
        [radioCell(), '3', 'Front door regulator', 'Open/Close'],
        [radioCell(), '4', 'Front door inside lock', 'Lock/Free'],
        [radioCell(), '5', 'Front door key', 'Lock/Free'],
        [radioCell(), '6', 'Outside mirror (body side)', '90° operation'],
        [radioCell(), '7', 'Outside mirror (mirror side)', 'Up/Down/Left/Right'],
        [radioCell(), '8', 'Front seat', 'Installation/Removal'],
        [radioCell(), '9', 'Rear door outside handle', 'Open/Close'],
        [radioCell(), '10', 'Rear door inside handle', 'Open/Close'],
        [radioCell(), '11', 'Rear door regulator', 'Open/Close'],
        [radioCell(), '12', 'Rear door inside lock', 'Lock/Free'],
        [radioCell(), '13', 'Quarter window', 'Open/Close'],
        [radioCell(), '14', 'Back door outside handle', 'Open/Close'],
        [radioCell(), '15', 'Back door opener', 'Open/Close'],
        [radioCell(), '16', 'Back door window fastener', 'Open/Close'],
        [radioCell(), '17', 'Back door key', 'Lock/Free'],
        [radioCell(), '18', 'Trunk lid key', 'Lock/Free'],
        [radioCell(), '19', 'Side gate', 'Open/Close'],
        [radioCell(), '20', 'Rear gate', 'Open/Close'],
        [radioCell(), '21', 'Front hood', 'Open/Close'],
        [radioCell(), '22', 'Engine oil level gauge', 'Installation/Removal'],
        [radioCell(), '23', 'Radiator cap', 'Installation/Removal'],
        [radioCell(), '24', 'Radio antenna', ''],
        [radioCell(), '25', 'Fuel inlet lid', 'Open/Close'],
        [radioCell(), '26', 'Fuel tank cap', 'Installation/Removal'],
        [radioCell(), '27', 'Trunk lid opener', 'Open/Close'],
        [radioCell(), '28', 'Rear gate inside lock', 'Open/Close'],
        [radioCell(), '29', 'Electric remote control mirror', 'Up/Down/Left/Right'],
        [radioCell(), '30', 'Electric back door lock switch', 'Lock/Free'],
        [radioCell(), '31', 'Electric door inside lock', 'Lock/Free'],
        [radioCell(), '32', 'Power window', 'Open/Close'],
        [radioCell(), '33', 'Sun roof', 'Open/Close'],
        [radioCell(), '34', 'Sun roof', 'Installation/Removal'],
        [radioCell(), '35', 'Charging lid', 'Open/Close']
      ]
    }
  },
  corrosion_coupon_measurement: {
    title: 'Corrosion Coupon data measurement',
    header: 'MIC Checksheet Builder',
    table: {
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
    }
  },
  scribe_line_measurement: {
    title: 'Scribe line measurement',
    header: 'MIC Checksheet Builder',
    formClass: 'layout-standard',
    fields: [
      { type: 'input', label: 'Panel', name: 'panel' },
      { type: 'input', label: 'Gauge', name: 'gauge' },
      { type: 'select', label: 'Method', name: 'method', options: ['Visual', 'Microscope', 'Digital'] },
      { type: 'input', label: 'Inspector', name: 'inspector' },
      { type: 'select', label: 'Phase', name: 'phase', options: ['Phase 1', 'Phase 2', 'Phase 3'] },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    table: {
      columns: ['Applicable', 'Sl No.', 'Scribe line', 'Checkpoint', 'Limit'],
      rows: [
        [radioCell(), '1', 'Front door', 'No spread', '0.5 mm'],
        [radioCell(), '2', 'Rear door', 'No lift', '0.5 mm'],
        [radioCell(), '3', 'Hood', 'Uniform edge', '0.4 mm'],
        [radioCell(), '4', 'Tail gate', 'No crack', '0.4 mm']
      ]
    }
  },
  crs_check_sheet: {
    title: 'CRS check sheet',
    header: 'MIC Checksheet Builder',
    formClass: 'layout-meta',
    fields: [
      { type: 'input', label: 'Date', name: 'date' },
      { type: 'input', label: 'Name', name: 'name' },
      { type: 'input', label: 'Shift', name: 'shift' }
    ],
    table: {
      columns: ['Applicable', 'Section', 'Part / Location', 'Sub-Item', 'Film Thickness (µm)'],
      rows: [
        [radioCell(), 'Roof panel', 'Opening trim panel', '(1) Fuel lid hinge', 'Before / After'],
        [radioCell(), 'Side body panel', '', '(2) Fuel lid mounting bolts', 'Before / After'],
        [radioCell(), '', '', '(3) Fuel lid spring', 'Before / After'],
        [radioCell(), '', '', '(4) Fuel filler neck', 'Before / After'],
        [radioCell(), '', '', '(5) Fuel filler neck mounting bolts & nuts', 'Before / After'],
        [radioCell(), '', '', '(6) Molding', 'Before / After'],
        [radioCell(), '', '', '(7) Slide door guide rail', 'Before / After'],
        [radioCell(), '', '', '(8) Matching portion with fuel lid box', 'Before / After'],
        [radioCell(), '', '', '(1) Pillar patching portion', 'Before / After']
      ]
    }
  },
  dismantling_inspection: {
    title: 'Dismantling inspection sheet filled',
    header: 'MIC Checksheet Builder',
    formClass: 'layout-meta',
    fields: [
      { type: 'input', label: 'Date', name: 'date' },
      { type: 'input', label: 'Name', name: 'name' },
      { type: 'input', label: 'Shift', name: 'shift' }
    ],
    blankPanel: true
  },
  photo_annexure: {
    title: 'Photo Annexure',
    header: 'MIC Checksheet Builder',
    formClass: 'layout-compact',
    fields: [
      { type: 'input', label: 'Photo Set', name: 'photoSet' },
      { type: 'select', label: 'Camera', name: 'camera', options: ['Phone', 'DSLR', 'Tablet'] },
      { type: 'select', label: 'Album', name: 'album', options: ['Front view', 'Side view', 'Close-up'] },
      { type: 'input', label: 'Uploaded By', name: 'uploadedBy' },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    table: {
      columns: ['Applicable', 'Photo Set', 'Description', 'Upload status'],
      rows: [
        [radioCell(), 'P-01', 'Front assembly', 'Uploaded'],
        [radioCell(), 'P-02', 'Side profile', 'Uploaded'],
        [radioCell(), 'P-03', 'Underbody', 'Pending'],
        [radioCell(), 'P-04', 'Close-up rust area', 'Pending']
      ]
    }
  }
};

if (persistedState.activeSectionId && persistedState.activeSectionId in sections) {
  activeSectionId = persistedState.activeSectionId;
}

function closeProfileMenu() {
  profileMenu.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
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

function renderCell(cell) {
  if (cell && cell.type === 'radio') {
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
    return `<td class="editable-table-cell"><input class="table-input" type="text" value="${value}" aria-label="Editable table cell" /></td>`;
  }

  if (cell && typeof cell === 'object') {
    const rowSpan = cell.rowSpan ? ` rowspan="${cell.rowSpan}"` : '';
    const colSpan = cell.colSpan ? ` colspan="${cell.colSpan}"` : '';
    const className = cell.className ? ` class="${cell.className}"` : '';
    return `<td${rowSpan}${colSpan}${className}>${cell.text ?? ''}</td>`;
  }

  return `<td>${cell ?? ''}</td>`;
}

function renderTable(tableConfig) {
  if (!tableConfig) return '';

  return `
    <div class="table-frame applicable-table">
      <table>
        <thead>
          <tr>${tableConfig.columns.map((column) => `<th>${column}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${tableConfig.rows.map((row) => `
            <tr>
              ${row.map(renderCell).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderFooterActions(actionIds = []) {
  if (!actionIds.length) return '';

  const labels = {
    save: 'Save',
    submit: 'Submit',
    goback: 'Go Back'
  };

  return `
    <div class="section-actions">
      ${actionIds.map((actionId) => {
        const className = actionId === 'goback'
          ? 'secondary-button inline-button action-button--back'
          : `primary-button action-button action-button--${actionId}`;
        return `<button class="${className}" type="button" data-action="${actionId}">${labels[actionId]}</button>`;
      }).join('')}
    </div>
  `;
}

function renderSection(sectionId) {
  const config = sections[sectionId];
  if (!config) return;

  activeSectionId = sectionId;
  persistedState.activeSectionId = sectionId;
  sectionTitle.textContent = config.title;
  sectionBody.innerHTML = `
    <form class="addition-form layout-standard">
      ${modelAdditionFields.map(renderField).join('')}
      <button class="primary-button plan-button" type="button" data-plan data-section="${sectionId}">Plan</button>
    </form>
    ${config.note ? `<div class="section-note">${config.note}</div>` : ''}
    ${config.table ? renderTable(config.table) : ''}
    ${config.blankPanel ? '<div class="blank-detail-panel" aria-hidden="true"></div>' : ''}
    ${renderFooterActions(['save', 'submit', 'goback'])}
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

  sectionBody.querySelectorAll('[data-action="goback"]').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = '../';
    });
  });

  sectionBody.querySelectorAll('[data-action="submit"]').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = '../';
    });
  });
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
  renderSection(button.dataset.section);
});

renderSection(activeSectionId);
