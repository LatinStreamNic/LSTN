document.addEventListener('DOMContentLoaded', initWebsite);

const WCD = {
  phone: '50588342164',
  plans: {
    landing: { name: 'Landing Page', price: 3500 },
    portfolio: { name: 'Portafolio / Marca personal', price: 5000 },
    professional: { name: 'Web Profesional', price: 6500 },
    booking: { name: 'Servicios / Reservas', price: 8500 },
    catalog: { name: 'Catálogo Pro', price: 9500 },
    store: { name: 'Tienda Online', price: 14500 }
  },
  extraPage: 600,
  productBlock: 500
};

async function initWebsite() {
  const sections = [
    ['#navbar', 'components/navbar.html'],
    ['#hero', 'sections/hero.html'],
    ['#servicios', 'sections/servicios.html'],
    ['#portafolio', 'sections/portfolio.html'],
    ['#estilos', 'sections/estilos-paginas.html'],
    ['#porQue', 'sections/por-que.html'],
    ['#precios', 'sections/precios.html'],
    ['#comparador', 'sections/comparador.html'],
    ['#cotizador', 'sections/cotizador.html'],
    ['#mantenimiento', 'sections/mantenimiento.html'],
    ['#proceso', 'sections/proceso.html'],
    ['#muestras', 'sections/muestras.html'],
    ['#pagos', 'sections/pagos.html'],
    ['#ventajas', 'sections/ventajas.html'],
    ['#faq', 'sections/faq.html'],
    ['#contacto', 'sections/contacto.html'],
    ['#footer', 'sections/footer.html']
  ];

  await Promise.all(sections.map(([selector, file]) => loadHTML(selector, file)));
  initNavigation();
  initScrollReveal();
  initFAQ();
  initQuoteForm();
  initCalculator();
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
    target.innerHTML = '<div class="component-error">No fue posible cargar esta sección. Para vista local, abre el proyecto mediante un servidor local.</div>';
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
  let current = 'inicio';
  links.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section && window.scrollY >= section.offsetTop - 150) current = section.id;
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
  }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });
  items.forEach(item => observer.observe(item));
}

function initFAQ() {
  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('button')?.setAttribute('aria-expanded', 'false');
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
      'Hola WC DIGITAL, quiero cotizar un sitio web.', '',
      `Nombre/negocio: ${name}`,
      `Tipo de sitio: ${type}`,
      `Presupuesto: ${budget}`,
      `Objetivo: ${goal || 'Por definir'}`
    ].join('\n');
    window.open(`https://wa.me/${WCD.phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}

function initCalculator() {
  const type = document.getElementById('calcType');
  if (!type) return;
  const pages = document.getElementById('calcExtraPages');
  const products = document.getElementById('calcProductBlocks');
  const maintenance = document.getElementById('calcMaintenance');
  const addons = [...document.querySelectorAll('.calc-addon')];
  const totalEl = document.getElementById('calcTotal');
  const monthlyEl = document.getElementById('calcMonthly');
  const planNameEl = document.getElementById('calcPlanName');
  const breakdownEl = document.getElementById('calcBreakdown');
  const sendBtn = document.getElementById('sendCalc');
  const resetBtn = document.getElementById('resetCalc');

  const format = value => `C$ ${Number(value).toLocaleString('es-NI')}`;
  const clamp = (input, min, max) => {
    let value = parseInt(input.value || 0, 10);
    value = Math.max(min, Math.min(max, Number.isFinite(value) ? value : 0));
    input.value = value;
    return value;
  };

  const calculate = () => {
    const plan = WCD.plans[type.value];
    const pageCount = clamp(pages, 0, 20);
    const productCount = clamp(products, 0, 20);
    let total = plan.price + pageCount * WCD.extraPage + productCount * WCD.productBlock;
    const selected = [];
    addons.forEach(addon => {
      if (addon.checked) {
        const price = Number(addon.dataset.price || 0);
        total += price;
        selected.push({ name: addon.closest('label').querySelector('b').textContent, price });
      }
    });
    const monthly = Number(maintenance.value || 0);
    planNameEl.textContent = plan.name;
    totalEl.textContent = format(total);
    monthlyEl.textContent = monthly ? `${format(monthly)} / mes` : 'No seleccionado';

    const rows = [{ name: plan.name, price: plan.price }];
    if (pageCount) rows.push({ name: `${pageCount} página(s) adicional(es)`, price: pageCount * WCD.extraPage });
    if (productCount) rows.push({ name: `${productCount * 10} productos extra`, price: productCount * WCD.productBlock });
    rows.push(...selected);
    breakdownEl.innerHTML = rows.map(row => `<div><span>${row.name}</span><b>${format(row.price)}</b></div>`).join('');
    return { plan, pageCount, productCount, selected, total, monthly };
  };

  document.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.dataset.step === 'pages' ? pages : products;
      input.value = Number(input.value || 0) + Number(button.dataset.dir);
      calculate();
    });
  });
  [type, pages, products, maintenance, ...addons].forEach(control => control.addEventListener('change', calculate));
  [pages, products].forEach(control => control.addEventListener('input', calculate));

  resetBtn?.addEventListener('click', () => {
    type.value = 'professional'; pages.value = 0; products.value = 0; maintenance.value = 0;
    addons.forEach(a => a.checked = false);
    calculate();
  });

  sendBtn?.addEventListener('click', () => {
    const result = calculate();
    const extras = result.selected.length ? result.selected.map(x => `- ${x.name}`).join('\n') : '- Ninguno';
    const message = [
      'Hola WC DIGITAL, quiero cotizar este estimado:', '',
      `Proyecto: ${result.plan.name}`,
      `Páginas adicionales: ${result.pageCount}`,
      `Productos extra: ${result.productCount * 10}`,
      'Extras:', extras,
      `Estimado de proyecto: ${format(result.total)}`,
      `Mantenimiento: ${result.monthly ? `${format(result.monthly)}/mes` : 'No seleccionado'}`,
      '', 'Entiendo que es un estimado y quiero confirmar el alcance y precio final.'
    ].join('\n');
    window.open(`https://wa.me/${WCD.phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
  calculate();
}

function setCurrentYear() {
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
}
