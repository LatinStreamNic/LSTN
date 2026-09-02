function initSiteChrome(){
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navigation = document.getElementById('mainNavigation');
  const navLinks = document.querySelectorAll('.navigation-link');
  const dockLinks = document.querySelectorAll('.mobile-dock-link[data-section]');

  const syncHeader = () => {
    if(header) header.classList.toggle('scrolled', window.scrollY > 12);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, {passive:true});

  if(menuToggle && navigation){
    menuToggle.addEventListener('click', ()=>{
      const open = navigation.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.forEach(link=>link.addEventListener('click', ()=>{
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }));
  }

  const sections = ['inicio','ofertas','membresias','como-comprar','soporte']
    .map(id=>document.getElementById(id)).filter(Boolean);

  if(sections.length){
    let spyTicking = false;
    const setActiveSection = id=>{
      navLinks.forEach(link=>link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      dockLinks.forEach(link=>link.classList.toggle('active', link.dataset.section === id));
    };

    const syncActiveSection = ()=>{
      const headerHeight = header ? header.offsetHeight : 0;
      const probe = window.scrollY + headerHeight + Math.min(window.innerHeight * .30, 220);
      let active = sections[0];

      sections.forEach(section=>{
        if(section.offsetTop <= probe) active = section;
      });

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6;
      if(nearBottom) active = sections[sections.length - 1];
      if(active) setActiveSection(active.id);
      spyTicking = false;
    };

    const requestSpySync = ()=>{
      if(spyTicking) return;
      spyTicking = true;
      requestAnimationFrame(syncActiveSection);
    };

    window.addEventListener('scroll', requestSpySync, {passive:true});
    window.addEventListener('resize', requestSpySync, {passive:true});
    window.addEventListener('hashchange', ()=>setTimeout(syncActiveSection, 80));
    document.addEventListener('click', event=>{
      const link = event.target.closest('a[href^="#"]');
      if(!link) return;
      const id = link.getAttribute('href').slice(1);
      if(sections.some(section=>section.id === id)) setActiveSection(id);
    });

    syncActiveSection();
    setTimeout(syncActiveSection, 180);
  }
}

function bindModalBackdrop(id, closeFn){
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', e=>{ if(e.target === el) closeFn(); });
}

initSiteChrome();
bindModalBackdrop('modal', closeModal);
bindModalBackdrop('cartModal', closeCart);
bindModalBackdrop('privacyModal', closePrivacyModal);

loadSavedCurrency();
updateCartUI();
if(typeof showMomPopupOnce === 'function') showMomPopupOnce();

/* =========================================================
   MOTION UI · animaciones de scroll y profundidad
========================================================= */
function initMotionUI(){
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('scrollProgress');
  const heroImage = document.querySelector('.hero-image-wrapper');
  const store = document.getElementById('store');

  requestAnimationFrame(()=>document.body.classList.add('motion-ready'));

  const syncScrollEffects = ()=>{
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    if(progress) progress.style.width = `${Math.min(100, Math.max(0, (window.scrollY / max) * 100))}%`;

    if(!reduceMotion && heroImage && window.innerWidth > 820){
      const shift = Math.min(26, window.scrollY * .045);
      heroImage.style.setProperty('--hero-shift', `${shift}px`);
    }
  };

  syncScrollEffects();
  window.addEventListener('scroll', syncScrollEffects, {passive:true});
  window.addEventListener('resize', syncScrollEffects, {passive:true});

  if(reduceMotion || !('IntersectionObserver' in window)) return;

  const revealObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});

  const sectionObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, {threshold:.18});

  const registerMotionElements = (root=document)=>{
    const selectors = [
      '.section-intro',
      '.catalog-section-header',
      '.card',
      '.process-heading',
      '.process-card',
      '.support-container > div',
      '.support-button',
      '.hero-footer-container',
      '.footer-container'
    ];

    root.querySelectorAll(selectors.join(',')).forEach((el,index)=>{
      if(el.dataset.motionBound === '1') return;
      el.dataset.motionBound = '1';
      el.classList.add('reveal');

      if(el.matches('.support-container > div')) el.classList.add('reveal-left');
      if(el.matches('.support-button')) el.classList.add('reveal-right');
      if(el.matches('.card,.process-card')) el.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);

      revealObserver.observe(el);
    });

    root.querySelectorAll('.catalog-section').forEach(section=>{
      if(section.dataset.sectionMotion === '1') return;
      section.dataset.sectionMotion = '1';
      sectionObserver.observe(section);
    });
  };

  registerMotionElements(document);

  if(store){
    const mutationObserver = new MutationObserver(()=>registerMotionElements(store));
    mutationObserver.observe(store,{childList:true,subtree:true});
  }
}

initMotionUI();


function initCommercePolish(){
  const helper=document.querySelector('.whatsapp-helper');
  if(helper){
    setTimeout(()=>helper.classList.add('compact'), 8500);
    helper.addEventListener('mouseenter',()=>helper.classList.remove('compact'));
    helper.addEventListener('mouseleave',()=>helper.classList.add('compact'));
  }

  document.addEventListener('keydown', event=>{
    if(event.key !== 'Escape') return;
    const cartModal=document.getElementById('cartModal');
    const productModal=document.getElementById('modal');
    const privacyModal=document.getElementById('privacyModal');
    if(cartModal && cartModal.classList.contains('show')) closeCart();
    else if(productModal && productModal.style.display === 'flex') closeModal();
    else if(privacyModal && privacyModal.style.display === 'flex') closePrivacyModal();
  });
}

initCommercePolish();
