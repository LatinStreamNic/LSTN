function buildVariantsFromOfficialPrices(group){
  const key = `${group.name}|${String(group.plan || '').trim()}`;
  const table = officialDevicePrices[key];

  // Si existe una tabla oficial para este producto/plan,
  // se usan EXACTAMENTE esas opciones y en el MISMO ORDEN escrito.
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

  // Respaldo: si no existe tabla oficial, usa las variantes antiguas que tengan precio.
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

  productGroups = Object.values(map).map(g=>{
    buildVariantsFromOfficialPrices(g);
    return g;
  });
}

function groupHasAvailable(group){
  return group.variants.some(v=>v.available !== false);
}

function getDefaultVariant(group){
  return group.variants.find(v=>v.available !== false && typeof v.price === 'number') || group.variants.find(v=>typeof v.price === 'number') || group.variants[0];
}

function renderDevicePrices(group){
  return `<div class="device-price-list">${group.variants.map(v=>{
    const priceText = v.available === false ? 'Agotado' : format(v.price * rate);
    const oldText = hasDiscount(v) ? `<small>Antes ${format(v.oldPrice * rate)}</small>` : '';
    return `<div class="device-price-row"><strong>${v.deviceLabel}${oldText}</strong><span>${priceText}</span></div>`;
  }).join('')}</div>`;
}

function loadProducts(){
  buildProductGroups();
  let sections={};
  productGroups.forEach((g,i)=>{ if(!sections[g.name]) sections[g.name]=[]; sections[g.name].push({...g,groupIndex:i}); });
  let html='';
  for(let s in sections){
    html+=`<div class="section"><h3>${s}</h3><div class="carousel"><div class="track" id="track-${s.replace(/\s+/g,'-')}">`;
    sections[s].forEach(group=>{
      const main = getDefaultVariant(group);
      const discountPercent = Math.max(...group.variants.map(v=>getDiscountPercent(v)));
      const available = groupHasAvailable(group);
      html+=`<div class="card ${!available ? 'out-stock' : ''}" onclick="openModal(${group.groupIndex})">${!available ? `<div class="stock-badge">AGOTADO</div>` : ''}${discountPercent > 0 ? `<div class="card-discount">OFERTA</div>` : ''}<div class="protected-img"><img src="${group.img}" alt="${group.name} ${group.plan}" draggable="false" loading="lazy" oncontextmenu="return false;"></div><div class="info"><p>${group.plan}</p><span>Selecciona el plan para ver opciones</span><div class="price">Desde ${(!main || main.available === false) ? 'Agotado' : format(Number(main.price || 0)*rate)}</div></div></div>`;
    });
    html+=`</div></div></div>`;
  }
  document.getElementById('store').innerHTML=html;
  document.querySelectorAll('.track').forEach(track=>{
    track.innerHTML += track.innerHTML;
    let pos=0, speed=0.4, isPaused=false;
    function animate(){ if(!isPaused){ pos -= speed; track.style.transform = `translateX(${pos}px)`; if(Math.abs(pos) >= track.scrollWidth / 2){ pos = 0; } } requestAnimationFrame(animate); }
    animate();
    track.addEventListener('mouseenter',()=>isPaused=true);
    track.addEventListener('mouseleave',()=>isPaused=false);
    track.addEventListener('touchstart',()=>isPaused=true,{passive:true});
    track.addEventListener('touchend',()=>isPaused=false,{passive:true});
  });
}

function scrollToMemberships(){
  const store = document.getElementById('store');
  if(store){ store.scrollIntoView({behavior:'smooth', block:'start'}); }
}
