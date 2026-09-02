document.addEventListener('DOMContentLoaded', initWebsite);

async function initWebsite() {
  const sections = [
    ['#navbar', 'components/navbar.html'],
    ['#hero', 'sections/hero.html'],
    ['#servicios', 'sections/servicios.html'],
    ['#estilos', 'sections/estilos-paginas.html'],
    ['#precios', 'sections/precios.html'],
    ['#proceso', 'sections/proceso.html'],
    ['#ventajas', 'sections/ventajas.html'],
    ['#muestras', 'sections/muestras.html'],
    ['#faq', 'sections/faq.html'],
    ['#contacto', 'sections/contacto.html'],
    ['#footer', 'sections/footer.html']
  ];

  await Promise.all(sections.map(([selector, file]) => loadHTML(selector, file)));
  initNavigation();
  initScrollReveal();
  initFAQ();
  initQuoteForm();
  setCurrentYear();
}

async function loadHTML(selector, file) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`${file}: ${response.status}`);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error('No se pudo cargar:', error);
    target.innerHTML = '<div class="component-error">No fue posible cargar esta sección.</div>';
  }
}

function initNavigation() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNavigation');
  if (!header || !toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    updateActiveNav();
  }, { passive: true });

  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
}

function updateActiveNav() {
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let current = 'inicio';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) current = section.id;
  });
  links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(item => observer.observe(item));
}

function initFAQ() {
  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        const otherButton = other.querySelector('button');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('quoteName').value.trim();
    const type = document.getElementById('quoteType').value;
    const budget = document.getElementById('quoteBudget').value;
    const goal = document.getElementById('quoteGoal').value.trim();

    const message = [
      'Hola WC DIGITAL, quiero cotizar un sitio web.',
      '',
      `Nombre/negocio: ${name}`,
      `Tipo de sitio: ${type}`,
      `Presupuesto: ${budget}`,
      `Objetivo: ${goal || 'Por definir'}`
    ].join('\n');

    window.open(`https://wa.me/50588342164?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}

function setCurrentYear() {
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
}
