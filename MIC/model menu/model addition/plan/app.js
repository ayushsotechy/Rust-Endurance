const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const homeHref = `${window.location.origin}/`;
const submitButton = document.querySelector('#submitPlan');
const addRowButton = document.querySelector('#addRow');
const planTitle = document.querySelector('#planTitle');
const toast = document.querySelector('#toast');
const params = new URLSearchParams(window.location.search);
const sectionId = params.get('section');
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
let toastTimer;

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

if (sectionTitles[sectionId]) {
  planTitle.textContent = `${sectionTitles[sectionId]} Plan`;
}

addRowButton.addEventListener('click', () => {
  showToast('Add row coming soon');
});

submitButton.addEventListener('click', () => {
  window.location.href = '../../';
});
