const profileButton = document.querySelector('#profileButton');
const profileMenu = document.querySelector('#profileMenu');
const toast = document.querySelector('#toast');
const homeHref = `${window.location.origin}/`;
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

document.querySelectorAll('[data-signout]').forEach((button) => {
  button.addEventListener('click', () => {
    window.location.href = homeHref;
  });
});

document.querySelector('#menuGrid').addEventListener('click', (event) => {
  const card = event.target.closest('.menu-card');
  if (!card) return;

  if (card.dataset.route) {
    window.location.href = card.dataset.route;
    return;
  }

  clearTimeout(toastTimer);
  toast.textContent = `${card.dataset.module} selected`;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
});
