const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const planButton = document.querySelector('.plan-button');
let toastTimer;

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

planButton.addEventListener('click', () => {
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
  toast.textContent = 'Plan saved';
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
});
