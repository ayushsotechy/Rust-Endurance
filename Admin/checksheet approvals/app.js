const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const submissionList = document.querySelector('#submissionList');
const reviewTitle = document.querySelector('#reviewTitle');
const reviewMeta = document.querySelector('#reviewMeta');
const reviewStatus = document.querySelector('#reviewStatus');
const reviewDetails = document.querySelector('#reviewDetails');
const reviewFeedback = document.querySelector('#reviewFeedback');
const approveButton = document.querySelector('#approveButton');
const sendBackButton = document.querySelector('#sendBackButton');
const toast = document.querySelector('#toast');
let selectedId = 1;
let toastTimer;

const submissions = [
  { id: 1, title: 'Logbook 1 Check sheet', model: 'YED', chassis: 'MA3EJKD1S00128', mic: 'MIC-204', submitted: '16 Jul 2026, 09:20', phase: 'Phase 1', status: 'Pending', remarks: '' },
  { id: 2, title: 'Operation Durability Cycles', model: 'YHB', chassis: 'MA3NYFJ1S00457', mic: 'MIC-118', submitted: '16 Jul 2026, 10:05', phase: 'Phase 2', status: 'Pending', remarks: '' },
  { id: 3, title: 'Corrosion Coupon Data', model: 'YSD', chassis: 'MA3ERLF1S00803', mic: 'MIC-176', submitted: '15 Jul 2026, 17:40', phase: 'Phase 1', status: 'Approved', remarks: '' },
  { id: 4, title: 'Photo Annexure', model: 'YWD', chassis: 'MA3FJEB1S00591', mic: 'MIC-143', submitted: '15 Jul 2026, 16:15', phase: 'Phase 3', status: 'Sent back', remarks: 'Retake left-side sill photo and resubmit.' }
];

function closeProfileMenu() {
  profileMenu.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
}

function statusClass(status) {
  if (status === 'Approved') return 'approved';
  if (status === 'Sent back') return 'sent-back';
  return '';
}

function renderSummary() {
  document.querySelector('#pendingCount').textContent = submissions.filter((item) => item.status === 'Pending').length;
  document.querySelector('#approvedCount').textContent = submissions.filter((item) => item.status === 'Approved').length;
  document.querySelector('#sentBackCount').textContent = submissions.filter((item) => item.status === 'Sent back').length;
}

function renderList() {
  submissionList.innerHTML = submissions.map((item) => `
    <button class="submission-card ${item.id === selectedId ? 'active' : ''}" type="button" data-id="${item.id}">
      <div class="submission-meta">
        <span class="status-pill ${statusClass(item.status)}">${item.status}</span>
        <span>${item.submitted}</span>
      </div>
      <h2>${item.title}</h2>
      <p>${item.model} · ${item.chassis} · ${item.mic}</p>
    </button>
  `).join('');
}

function renderReview() {
  const item = submissions.find((submission) => submission.id === selectedId);
  reviewStatus.textContent = item.status;
  reviewStatus.className = `status-pill ${statusClass(item.status)}`;
  reviewTitle.textContent = item.title;
  reviewMeta.textContent = `${item.mic} submitted this checksheet for admin review.`;
  reviewFeedback.value = item.remarks;
  reviewDetails.innerHTML = [
    ['Model', item.model],
    ['Chassis No.', item.chassis],
    ['Submitted by', item.mic],
    ['Submitted on', item.submitted],
    ['Test phase', item.phase],
    ['Current status', item.status]
  ].map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');
}

function render() {
  renderSummary();
  renderList();
  renderReview();
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

submissionList.addEventListener('click', (event) => {
  const card = event.target.closest('.submission-card');
  if (!card) return;
  selectedId = Number(card.dataset.id);
  render();
});

approveButton.addEventListener('click', () => {
  const item = submissions.find((submission) => submission.id === selectedId);
  item.status = 'Approved';
  item.remarks = '';
  render();
  showToast(`${item.title} approved`);
});

sendBackButton.addEventListener('click', () => {
  const item = submissions.find((submission) => submission.id === selectedId);
  const remarks = reviewFeedback.value.trim();
  if (!remarks) {
    showToast('Add remarks before sending back');
    reviewFeedback.focus();
    return;
  }
  item.status = 'Sent back';
  item.remarks = remarks;
  render();
  showToast(`${item.title} sent back to MIC`);
});

render();
