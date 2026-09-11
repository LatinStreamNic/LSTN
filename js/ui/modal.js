function renderModalPrice(){
  if(!selected) return;
  const price=Number(selected.price || 0)*rate;
  const discountActive=hasDiscount(selected);
  const original=discountActive ? Number(selected.oldPrice || 0)*rate : null;
  document.getElementById('modalText').innerText=`${selected.plan} - ${selected.deviceLabel || selected.cat}`;
  let priceHtml = '';

  if(discountActive){
    const discountPercent = getDiscountPercent(selected);
    const savings = original - price;
    priceHtml = `<div class="price-row"><div class="price-big">${format(price)}</div><div class="old-price">${format(original)}</div></div><div class="discount-bar"><span>Ahorras ${format(savings)}</span><span class="discount-pill">-${discountPercent}% OFF</span></div>`;
  } else {
    priceHtml = `<div class="price-row"><div class="price-big">${format(price)}</div></div>`;
  }

  const couponOffer = typeof getShowcaseCouponOfferForItem === 'function'
    ? getShowcaseCouponOfferForItem(selected)
    : null;

  if(couponOffer){
    const couponPrice = price * (1 - (couponOffer.percent / 100));
    priceHtml += `<div class="discount-bar coupon-promo-bar"><span>Con cupón <strong>${couponOffer.code}</strong>: ${format(couponPrice)}</span><span class="discount-pill">-${couponOffer.percent}% EXTRA</span></div>`;
  }

  document.getElementById('modalPrice').innerHTML = priceHtml;
  const buyBtn = document.querySelector('#modal .btn-buy');
  const stockText = document.getElementById('modalStockText');
  if(selected.available === false){
    buyBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Producto agotado';
    buyBtn.classList.add('disabled');
    buyBtn.disabled = true;
    stockText.textContent = 'Este producto no está disponible por el momento.';
  } else {
    buyBtn.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Agregar al carrito';
    buyBtn.classList.remove('disabled');
    buyBtn.disabled = false;
    stockText.textContent = '';
  }
}

function changeSelectedVariant(value){
  selectedVariantIndex = parseInt(value,10) || 0;
  selected = selectedGroup.variants[selectedVariantIndex];
  renderModalPrice();
}

function openModal(i){
  selectedGroup=productGroups[i];
  selectedVariantIndex=Math.max(0, selectedGroup.variants.findIndex(v=>v.available !== false));
  selected=selectedGroup.variants[selectedVariantIndex] || selectedGroup.variants[0];
  document.getElementById('modal').style.display='flex';
  document.getElementById('modalImg').src=selectedGroup.img;
  document.getElementById('modalImg').alt=`${selectedGroup.name} ${selectedGroup.plan}`;
  document.getElementById('modalTitle').innerText=selectedGroup.name;
  document.getElementById('modalDesc').innerText=selectedGroup.desc || '';
  document.getElementById('modalBenefitText').innerHTML=`<div class="device-select-box"><label>Selecciona cantidad de dispositivos</label><select onchange="changeSelectedVariant(this.value)">${selectedGroup.variants.map((v,idx)=>`<option value="${idx}" ${idx===selectedVariantIndex?'selected':''}>${v.deviceLabel} — ${v.available === false ? 'Agotado' : format(Number(v.price || 0)*rate)}</option>`).join('')}</select></div>`;
  renderModalPrice();
}

function closeModal(){
  document.getElementById('modal').style.display='none';
  document.body.classList.remove('modal-open');
}

function openPrivacyModal(){ document.getElementById('privacyModal').style.display='flex'; }

function closePrivacyModal(){ document.getElementById('privacyModal').style.display='none'; }

function closeMomPopup(){
  const popup = document.getElementById('momPopup');
  if(popup){
    popup.classList.remove('show');
    sessionStorage.setItem('promoPopupClosed_FiestasPatrias','1');
    popup.setAttribute('aria-hidden','true');
  }
}

function copyMomCoupon(){
  const coupon = 'FiestasPatrias';
  const couponInput = document.getElementById('couponInput');

  if(couponInput){
    couponInput.value = coupon;
  }

  const finish = () => {
    closeMomPopup();
    showToast('Cupón FiestasPatrias copiado.');
  };

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(coupon).then(finish).catch(finish);
  } else {
    finish();
  }
}

function showMomPopupOnce(){
  const popup = document.getElementById('momPopup');
  if(!popup) return;

  const couponCode = 'FiestasPatrias';
  const coupon = (typeof coupons !== 'undefined' && coupons) ? coupons[couponCode] : null;
  if(!coupon || typeof isCouponDateValid !== 'function' || !isCouponDateValid(coupon)) return;

  const storageKey = `promoPopupClosed_${couponCode}`;
  if(sessionStorage.getItem(storageKey) === '1') return;

  setTimeout(()=>{
    popup.classList.add('show');
    popup.setAttribute('aria-hidden','false');
  }, 650);
}
