const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const sectionTabs = document.querySelector('#sectionTabs');
const sectionTitle = document.querySelector('#sectionTitle');
const sectionBody = document.querySelector('#sectionBody');
let toastTimer;
let activeSectionId = 'work_start_up_inspection';

const sections = {
  work_start_up_inspection: {
    title: 'Work Start up Inspection',
    formClass: 'layout-standard',
    fields: [
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
    ],
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
    formClass: 'layout-standard',
    fields: [
      { type: 'input', label: 'Panel', name: 'panel' },
      { type: 'input', label: 'Gauge', name: 'gauge' },
      { type: 'select', label: 'Method', name: 'method', options: ['Visual', 'Microscope', 'Digital'] },
      { type: 'input', label: 'Inspector', name: 'inspector' },
      { type: 'select', label: 'Phase', name: 'phase', options: ['Phase 1', 'Phase 2', 'Phase 3'] },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    columns: ['Applicable', 'Sl No.', 'Scribe line', 'Checkpoint', 'Limit'],
    rows: [
      [{ type: 'radio' }, '1', 'Front door', 'No spread', '0.5 mm'],
      [{ type: 'radio' }, '2', 'Rear door', 'No lift', '0.5 mm'],
      [{ type: 'radio' }, '3', 'Hood', 'Uniform edge', '0.4 mm'],
      [{ type: 'radio' }, '4', 'Tail gate', 'No crack', '0.4 mm']
    ]
  },
  crs_check_sheet: {
    title: 'CRS check sheet',
    formClass: 'layout-compact',
    fields: [
      { type: 'input', label: 'CRS Item', name: 'crsItem' },
      { type: 'select', label: 'Vehicle', name: 'vehicle', options: ['YED', 'YHB', 'YSD', 'YWD'] },
      { type: 'select', label: 'Location', name: 'location', options: ['Lab A', 'Lab B', 'Chamber 2'] },
      { type: 'input', label: 'Reviewer', name: 'reviewer' },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    columns: ['Applicable', 'Sl No.', 'CRS item', 'Criteria', 'Status'],
    rows: [
      [{ type: 'radio' }, '1', 'Paint edge', 'No blister', 'Pass'],
      [{ type: 'radio' }, '2', 'Fastener', 'No rust', 'Pass'],
      [{ type: 'radio' }, '3', 'Sealant', 'No gap', 'Pending'],
      [{ type: 'radio' }, '4', 'Bracket', 'No corrosion', 'Pass']
    ]
  },
  dismantling_inspection: {
    title: 'Dismantling inspection sheet filled',
    formClass: 'layout-standard',
    fields: [
      { type: 'input', label: 'Part', name: 'part' },
      { type: 'select', label: 'Condition', name: 'condition', options: ['Good', 'Damaged', 'Under review'] },
      { type: 'input', label: 'Inspector', name: 'inspector' },
      { type: 'select', label: 'Phase', name: 'phase', options: ['Phase 1', 'Phase 2', 'Phase 3'] },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    columns: ['Applicable', 'Part', 'Condition', 'Action'],
    rows: [
      [{ type: 'radio' }, 'Bearing', 'Good', 'Record'],
      [{ type: 'radio' }, 'Seal', 'Damaged', 'Replace'],
      [{ type: 'radio' }, 'Bolt', 'Good', 'Record'],
      [{ type: 'radio' }, 'Clamp', 'Under review', 'Inspect']
    ]
  },
  photo_annexure: {
    title: 'Photo Annexure',
    formClass: 'layout-compact',
    fields: [
      { type: 'input', label: 'Photo Set', name: 'photoSet' },
      { type: 'select', label: 'Camera', name: 'camera', options: ['Phone', 'DSLR', 'Tablet'] },
      { type: 'select', label: 'Album', name: 'album', options: ['Front view', 'Side view', 'Close-up'] },
      { type: 'input', label: 'Uploaded By', name: 'uploadedBy' },
      { type: 'input', label: 'Remarks', name: 'remarks', span: 'field--wide' }
    ],
    columns: ['Applicable', 'Photo Set', 'Description', 'Upload status'],
    rows: [
      [{ type: 'radio' }, 'P-01', 'Front assembly', 'Uploaded'],
      [{ type: 'radio' }, 'P-02', 'Side profile', 'Uploaded'],
      [{ type: 'radio' }, 'P-03', 'Underbody', 'Pending'],
      [{ type: 'radio' }, 'P-04', 'Close-up rust area', 'Pending']
    ]
  }
};

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
    return `
      <label class="field select-field${spanClass}">
        <span>${field.label}</span>
        <select name="${field.name}">
          <option value=""></option>
          ${field.options.map((option) => `<option>${option}</option>`).join('')}
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

function renderTable(columns, rows) {
  return `
    <div class="table-frame">
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map((cell) => {
                if (cell && cell.type === 'radio') {
                  return '<td><label class="radio-cell"><input type="radio" name="applicable" /><span></span></label></td>';
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

function renderSection(sectionId) {
  const config = sections[sectionId];
  if (!config) return;
  const sharedFormConfig = sections.work_start_up_inspection;

  activeSectionId = sectionId;
  sectionTitle.textContent = config.title;
  sectionBody.innerHTML = `
    <form class="addition-form ${sharedFormConfig.formClass}">
      ${sharedFormConfig.fields.map(renderField).join('')}
      <button class="primary-button plan-button" type="button" data-plan data-section="${sectionId}">Plan</button>
    </form>
    ${renderTable(sharedFormConfig.columns, sharedFormConfig.rows)}
  `;

  sectionTabs.querySelectorAll('[data-section]').forEach((button) => {
    button.classList.toggle('active', button.dataset.section === sectionId);
    button.setAttribute('aria-pressed', String(button.dataset.section === sectionId));
  });

  const planButton = sectionBody.querySelector('[data-plan]');
  planButton.addEventListener('click', () => {
    window.location.href = `./plan/?section=${encodeURIComponent(sectionId)}`;
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
