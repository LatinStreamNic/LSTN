let catalogFilterCategory = 'all';
let catalogFilterDevice = 'all';
let catalogFiltersBound = false;

function buildVariantsFromOfficialPrices(group){
  const key = `${group.name}|${String(group.plan || '').trim()}`;
  const table = officialDevicePrices[key];

  if(table){
    const base = group.variants.find(v => v.available !== false) || group.variants[0] || group;
    group.variants = Object.keys(table).map(label=>{
      const data = table[label] || {};
      return {
        ...base,
        name: group.name,
        plan: group.plan,
        img: group.img,
        desc: group.desc || '',
        cat: label,
        deviceLabel: label,
        price: Number(data.price || 0),
        oldPrice: Number(typeof data.oldPrice === 'number' ? data.oldPrice : (data.price || 0)),
        available: data.available !== false
      };
    });
    return group;
  }

  group.variants = group.variants
    .filter(v => typeof v.price === 'number')
    .map(v => ({...v, deviceLabel: v.deviceLabel || normalizeDeviceLabel(v.cat)}));

  return group;
}

function buildProductGroups(){
  const map = {};
  products.forEach((p,i)=>{
    const key = `${p.name}|${String(p.plan || '').trim()}|${p.img}`;
    if(!map[key]){
      map[key] = {name:p.name, plan:String(p.plan || '').trim(), img:p.img, desc:p.desc || '', variants:[]};
    }
    map[key].variants.push({...p,index:i,deviceLabel:normalizeDeviceLabel(p.cat)});
  });

  productGroups = Object.values(map).map((g, groupIndex)=>{
    buildVariantsFromOfficialPrices(g);
    return {...g, groupIndex};
  });
}

function groupHasAvailable(group){
  return group.variants.some(v=>v.available !== false);
}

function getDefaultVariant(group){
  return group.variants.find(v=>v.available !== false && typeof v.price === 'number') || group.variants.find(v=>typeof v.price === 'number') || group.variants[0];
}

function getSectionSlug(name){
  return String(name || 'membresia').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function getBrandKey(name){
  const n = String(name || '').toLowerCase();
  if(n.includes('stella')) return 'stella';
  if(n.includes('weib') && n.includes('veltix')) return 'combo';
  if(n.includes('weib')) return 'weib';
  if(n.includes('tele')) return 'telelatino';
  if(n.includes('veltix')) return 'veltix';
  if(n.includes('streaming')) return 'streaming';
  return 'default';
}

function renderAnimatedPrice(usd, prefix=''){
  const value = Number(usd || 0);
  return `${prefix}<span class="js-price" data-usd="${value.toFixed(4)}">${format(value * rate)}</span>`;
}

function groupMatchesDevice(group){
  if(catalogFilterDevice === 'all') return true;
  return group.variants.some(v=>{
    if(v.available === false) return false;
    const n = getDeviceNumber(v.deviceLabel || v.cat);
    if(catalogFilterDevice === '3plus') return n !== null && n >= 3;
    return n === Number(catalogFilterDevice);
  });
}

function groupMatchesFilters(group){
  const categoryOk = catalogFilterCategory === 'all' || group.name === catalogFilterCategory;
  return categoryOk && groupMatchesDevice(group);
}

function renderCategoryFilters(){
  const holder = document.getElementById('categoryFilters');
  if(!holder) return;
  const categories = [...new Set(productGroups.map(g=>g.name))];
  holder.innerHTML = [
    `<button type="button" class="filter-chip ${catalogFilterCategory === 'all' ? 'active' : ''}" data-category-filter="all">Todos</button>`,
    ...categories.map(name=>`<button type="button" class="filter-chip ${catalogFilterCategory === name ? 'active' : ''}" data-category-filter="${encodeURIComponent(name)}">${name}</button>`)
  ].join('');
}

function syncFilterButtons(){
  document.querySelectorAll('[data-category-filter]').forEach(btn=>{
    const raw = btn.dataset.categoryFilter || 'all';
    const value = raw === 'all' ? 'all' : decodeURIComponent(raw);
    btn.classList.toggle('active', value === catalogFilterCategory);
  });
  document.querySelectorAll('[data-device-filter]').forEach(btn=>btn.classList.toggle('active', btn.dataset.deviceFilter === catalogFilterDevice));
}

function initCatalogFilters(){
  const toolbar = document.getElementById('catalogToolbar');
  if(!toolbar || catalogFiltersBound) return;
  catalogFiltersBound = true;
  toolbar.addEventListener('click', event=>{
    const categoryButton = event.target.closest('[data-category-filter]');
    if(categoryButton){
      const raw = categoryButton.dataset.categoryFilter || 'all';
      catalogFilterCategory = raw === 'all' ? 'all' : decodeURIComponent(raw);
      loadProducts({preserveFeatured:true});
      return;
    }
    const deviceButton = event.target.closest('[data-device-filter]');
    if(deviceButton){
      catalogFilterDevice = deviceButton.dataset.deviceFilter || 'all';
      loadProducts({preserveFeatured:true});
    }
  });
}

function getGroupMaxDiscount(group){
  return Math.max(0, ...group.variants.map(v=>getDiscountPercent(v)));
}

function renderFeaturedProducts(){
  const holder = document.getElementById('featuredProducts');
  if(!holder || !productGroups.length) return;
  const available = productGroups.filter(groupHasAvailable);
  if(!available.length){ holder.innerHTML=''; return; }

  const picks = [];
  const usedImages = new Set();
  const addUniquePick = (candidates, label, icon)=>{
    const group = candidates.find(g=>
      g &&
      !picks.some(p=>p.group.groupIndex === g.groupIndex) &&
      !usedImages.has(String(g.img || ''))
    ) || candidates.find(g=>g && !picks.some(p=>p.group.groupIndex === g.groupIndex));

    if(group){
      picks.push({group,label,icon});
      usedImages.add(String(group.img || ''));
    }
  };

  const byDiscount = [...available].sort((a,b)=>getGroupMaxDiscount(b)-getGroupMaxDiscount(a));
  const byDuration = [...available].sort((a,b)=>parsePlanMonths(b.plan)-parsePlanMonths(a.plan));
  const byOptions = [...available].sort((a,b)=>b.variants.length-a.variants.length);

  addUniquePick(byDiscount, getGroupMaxDiscount(byDiscount[0])>0 ? 'Oferta especial' : 'Buena opción', 'fa-fire');
  addUniquePick(byDuration, 'Recomendado', 'fa-star');
  addUniquePick(byOptions, 'Más dispositivos', 'fa-tv');
  addUniquePick(available, 'Opción destacada', 'fa-sparkles');
  addUniquePick(available, 'Opción destacada', 'fa-sparkles');

  holder.innerHTML = picks.slice(0,3).map(({group,label,icon},idx)=>{
    const main = getDefaultVariant(group);
    const discount = getGroupMaxDiscount(group);
    const deviceText = `${group.variants.length} ${group.variants.length === 1 ? 'opción de dispositivo' : 'opciones de dispositivos'}`;
    return `<article class="featured-card featured-card-${idx+1}" data-brand="${getBrandKey(group.name)}" onclick="openModal(${group.groupIndex})" tabindex="0" role="button" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openModal(${group.groupIndex});}">
      <div class="featured-card-media protected-img"><img src="${group.img}" alt="${group.name} ${group.plan}" draggable="false" loading="lazy" oncontextmenu="return false;"></div>
      <div class="featured-card-overlay"></div>
      <div class="featured-card-content">
        <div class="featured-badge"><i class="fa-solid ${icon}"></i>${label}</div>
        <div class="featured-card-bottom">
          <div><span>${group.name}</span><h3>${group.plan}</h3><p>${deviceText}${discount>0 ? ` · Hasta ${discount}% de descuento` : ''}</p></div>
          <div class="featured-price">${(!main || main.available === false) ? 'Agotado' : renderAnimatedPrice(Number(main.price || 0),'Desde ')}</div>
        </div>
      </div>
    </article>`;
  }).join('');
}
function renderCatalogCard(group){
  const main = getDefaultVariant(group);
  const discountPercent = getGroupMaxDiscount(group);
  const available = groupHasAvailable(group);
  return `<article class="card ${!available ? 'out-stock' : ''}" data-brand="${getBrandKey(group.name)}" onclick="openModal(${group.groupIndex})" tabindex="0" role="button" aria-label="Ver ${group.name} ${group.plan}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openModal(${group.groupIndex});}">
    <div class="card-accent" aria-hidden="true"></div>
    ${!available ? `<div class="stock-badge">AGOTADO</div>` : ''}
    ${discountPercent > 0 ? `<div class="card-discount">OFERTA · HASTA ${discountPercent}%</div>` : ''}
    <div class="protected-img"><img src="${group.img}" alt="${group.name} ${group.plan}" draggable="false" loading="lazy" oncontextmenu="return false;"></div>
    <div class="info">
      <span class="card-service">${group.name}</span>
      <p>${group.plan}</p>
      <span>${group.variants.length} ${group.variants.length === 1 ? 'opción de dispositivo' : 'opciones de dispositivos'}</span>
      <div class="card-price-row"><div class="price">${(!main || main.available === false) ? 'Agotado' : renderAnimatedPrice(Number(main.price || 0),'Desde ')}</div><button type="button" class="card-view-button" onclick="event.stopPropagation();openModal(${group.groupIndex})">Ver planes <i class="fa-solid fa-arrow-right"></i></button></div>
    </div>
  </article>`;
}

function loadProducts(options={}){
  buildProductGroups();
  renderCategoryFilters();
  initCatalogFilters();
  syncFilterButtons();
  renderFeaturedProducts();

  const sections = {};
  productGroups.filter(groupMatchesFilters).forEach(group=>{
    if(!sections[group.name]) sections[group.name]=[];
    sections[group.name].push(group);
  });

  let html='';
  let visibleCount=0;
  Object.entries(sections).forEach(([name, groups])=>{
    const availableCount = groups.filter(groupHasAvailable).length;
    visibleCount += groups.length;
    html += `<section class="catalog-section" id="catalog-${getSectionSlug(name)}">
      <div class="catalog-section-header"><div><h3>${name}</h3><p>Selecciona una duración para ver dispositivos y precio final.</p></div><span class="catalog-section-count">${availableCount} ${availableCount === 1 ? 'plan disponible' : 'planes disponibles'}</span></div>
      <div class="product-grid">${groups.map(renderCatalogCard).join('')}</div>
    </section>`;
  });

  if(!html){
    html = `<div class="catalog-empty"><i class="fa-solid fa-filter-circle-xmark"></i><h3>No encontramos planes con esos filtros.</h3><p>Prueba otra combinación de servicio o cantidad de dispositivos.</p><button type="button" onclick="resetCatalogFilters()">Mostrar todo</button></div>`;
  }

  const store = document.getElementById('store');
  if(store) store.innerHTML = html;
  const result = document.getElementById('filterResults');
  if(result) result.textContent = `${visibleCount} ${visibleCount === 1 ? 'plan mostrado' : 'planes mostrados'}`;
}

function resetCatalogFilters(){
  catalogFilterCategory='all';
  catalogFilterDevice='all';
  loadProducts();
}

function animateCatalogPrices(fromRate, toRate){
  const elements = document.querySelectorAll('.js-price[data-usd]');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || fromRate === toRate){
    elements.forEach(el=>{ el.textContent = format(Number(el.dataset.usd || 0) * toRate); });
    return;
  }
  const start = performance.now();
  const duration = 520;
  elements.forEach(el=>el.classList.add('price-changing'));
  const tick = now=>{
    const t=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-t,3);
    elements.forEach(el=>{
      const usd=Number(el.dataset.usd || 0);
      const value=usd*(fromRate+(toRate-fromRate)*eased);
      el.textContent=`${currency} ${value.toFixed(2)}`;
    });
    if(t<1) requestAnimationFrame(tick);
    else elements.forEach(el=>el.classList.remove('price-changing'));
  };
  requestAnimationFrame(tick);
}

function scrollToMemberships(){
  const memberships = document.getElementById('membresias') || document.getElementById('store');
  if(memberships){ memberships.scrollIntoView({behavior:'smooth', block:'start'}); }
}
