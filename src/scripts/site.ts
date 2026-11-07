// Interacciones pequeñas y accesibles. El contenido principal funciona sin JavaScript.
const menuButton = document.querySelector<HTMLButtonElement>('#menu-toggle');
const nav = document.querySelector<HTMLElement>('#nav-links');

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
  nav.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  nav?.classList.toggle('is-open', open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 841px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

const year = document.querySelector<HTMLElement>('#footer-year');
if (year) year.textContent = String(new Date().getFullYear());

const form = document.querySelector<HTMLFormElement>('#contact-form');
const formStatus = document.querySelector<HTMLElement>('#form-status');
form?.addEventListener('submit', async (event) => {
  if (!form.checkValidity()) return;
  event.preventDefault();
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
  if (formStatus) { formStatus.classList.remove('error'); formStatus.textContent = 'Enviando mensaje…'; }
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Falló el servicio de correo');
    form.reset();
    if (formStatus) formStatus.textContent = '¡Mensaje enviado! Gracias por escribirme.';
  } catch {
    if (formStatus) {
      formStatus.textContent = 'No fue posible enviarlo. Intenta nuevamente o contáctame por correo.';
      formStatus.classList.add('error');
    }
  } finally {
    if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
  }
});
