const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const rowsElement = document.querySelector('#modelRows');
const emptyState = document.querySelector('#emptyState');
const recordCount = document.querySelector('#recordCount');
const toast = document.querySelector('#toast');
let toastTimer;

let records = [
  { id: 1, modelCode: 'YED', trial: 'T1', chassis: 'MA3EJKD1S00128', temp: '80°C', testType: 'Cyclic corrosion', phase: 'Phase 1', location: 'Lab A', remarks: 'Initial validation' },
  { id: 2, modelCode: 'YHB', trial: 'T2', chassis: 'MA3NYFJ1S00457', temp: '60°C', testType: 'Salt spray', phase: 'Phase 2', location: 'Chamber 2', remarks: 'Under observation' },
  { id: 3, modelCode: 'YSD', trial: 'P1', chassis: 'MA3ERLF1S00803', temp: '40°C', testType: 'Humidity', phase: 'Phase 1', location: 'Lab B', remarks: 'Baseline sample' },
  { id: 4, modelCode: 'YWD', trial: 'T1', chassis: 'MA3FJEB1S00591', temp: '80°C', testType: 'Cyclic corrosion', phase: 'Phase 3', location: 'Chamber 1', remarks: 'Final cycle' }
];

function actionIcon(type) {
  return type === 'edit'
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h-8v14h12v-8M13 11l6-6 2 2-6 6-3 1z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13"/></svg>';
}

function renderRows(list = records) {
  rowsElement.innerHTML = list.map((record) => `
    <tr>
      <td class="model-code">${record.modelCode}</td><td>${record.trial}</td><td>${record.chassis}</td><td>${record.temp}</td><td>${record.testType}</td><td><span class="status-pill">${record.phase}</span></td><td>${record.location}</td><td>${record.remarks || '—'}</td>
      <td><div class="actions"><button class="action-button" data-action="edit" data-id="${record.id}" aria-label="Edit ${record.modelCode}">${actionIcon('edit')}</button><button class="action-button delete" data-action="delete" data-id="${record.id}" aria-label="Delete ${record.modelCode}">${actionIcon('delete')}</button></div></td>
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

profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = profileMenu.hidden;
  profileMenu.hidden = !open;
  profileButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', (event) => { if (!profileMenu.contains(event.target)) { profileMenu.hidden = true; profileButton.setAttribute('aria-expanded', 'false'); } });

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
  const id = Number(button.dataset.id);
  const record = records.find((item) => item.id === id);
  if (button.dataset.action === 'edit') showToast(`Edit ${record.modelCode} coming soon`);
  if (button.dataset.action === 'delete' && window.confirm(`Delete model ${record.modelCode}?`)) {
    records = records.filter((item) => item.id !== id);
    renderRows();
    showToast(`${record.modelCode} deleted`);
  }
});

renderRows();
