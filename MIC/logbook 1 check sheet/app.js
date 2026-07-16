const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const rowsElement = document.querySelector('#logbookRows');
const emptyState = document.querySelector('#emptyState');
const toast = document.querySelector('#toast');
const form = document.querySelector('#searchForm');
let toastTimer;

const records = [
  { date: '2026-07-14', model: 'Draft', chassis: 'Draft', status: 'Draft' },
  { date: '2026-07-15', model: 'Submitted', chassis: 'Submitted', status: 'Submitted' },
  { date: '2026-07-16', model: 'xxxxx', chassis: 'xxxxx', status: 'xxxxx' }
];

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function actionButton(type, label) {
  const icon = type === 'download'
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10m0 0 4-4m-4 4-4-4"/><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/></svg>'
    : type === 'fill'
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/><path d="m14 6 4 4"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3.2"/></svg>';

  return `<button class="action-button ${type}" type="button" data-action="${type}" aria-label="${label}">${icon}${type === 'fill' || type === 'view' ? `<span>${label}</span>` : ''}</button>`;
}

function renderRows(list = records) {
  rowsElement.innerHTML = list.map((record) => `
    <tr>
      <td>${formatDate(record.date)}</td>
      <td>${record.model}</td>
      <td>${record.chassis}</td>
      <td>${record.status}</td>
      <td>
        <div class="actions">
          ${actionButton('download', 'Download')}
          ${actionButton('fill', 'Fill')}
          ${actionButton('view', 'View')}
        </div>
      </td>
    </tr>
  `).join('');

  emptyState.hidden = list.length !== 0;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function closeProfileMenu() {
  profileMenu.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fromDate = document.querySelector('#fromDate').value;
  const toDate = document.querySelector('#toDate').value;

  const filtered = records.filter((record) => {
    if (fromDate && record.date < fromDate) return false;
    if (toDate && record.date > toDate) return false;
    return true;
  });

  renderRows(filtered);
  showToast(filtered.length ? `Showing ${filtered.length} record${filtered.length === 1 ? '' : 's'}` : 'No matching records');
});

rowsElement.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  if (action === 'download') showToast('Download started');
  if (action === 'fill') showToast('Opening fill sheet');
  if (action === 'view') showToast('Opening record view');
});

renderRows();
