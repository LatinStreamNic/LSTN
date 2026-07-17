function renderModalPrice(){
  if(!selected) return;
  const price=Number(selected.price || 0)*rate;
  const discountActive=hasDiscount(selected);
  const original=discountActive ? Number(selected.oldPrice || 0)*rate : null;
  document.getElementById('modalText').innerText=`${selected.plan} - ${selected.deviceLabel || selected.cat}`;
  if(discountActive){
    const discountPercent = getDiscountPercent(selected);
    const savings = original - price;
    document.getElementById('modalPrice').innerHTML=`<div class="price-row"><div class="price-big">${format(price)}</div><div class="old-price">${format(original)}</div></div><div class="discount-bar"><span>Ahorras ${format(savings)}</span><span class="discount-pill">-${discountPercent}% OFF</span></div>`;
  } else {
    document.getElementById('modalPrice').innerHTML=`<div class="price-row"><div class="price-big">${format(price)}</div></div>`;
  }
  const buyBtn = document.querySelector('#modal .btn-buy');
  const stockText = document.getElementById('modalStockText');
  if(selected.available === false){
    buyBtn.textContent = 'Producto agotado';
    buyBtn.classList.add('disabled');
    buyBtn.disabled = true;
    stockText.textContent = 'Este producto no está disponible por el momento.';
  } else {
    buyBtn.textContent = 'Agregar al carrito';
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
    sessionStorage.setItem('momPopupClosed','1');
  }
}

function copyMomCoupon(){
  const coupon = 'LatinStream';

  navigator.clipboard.writeText(coupon).then(() => {

    const couponInput = document.getElementById('couponInput');

    if(couponInput){
      couponInput.value = coupon;
    }

    appliedCoupon = coupon;

    closeMomPopup();

    showToast('Cupón copiado correctamente 🎉');

  }).catch(() => {
    showToast('No se pudo copiar el cupón');
  });
}

//function showMomPopupOnce(){
  //const popup = document.getElementById('momPopup');
  //if(!popup) return;
  //if(sessionStorage.getItem('momPopupClosed') === '1') return;
 // setTimeout(()=>popup.classList.add('show'), 650);
//}
