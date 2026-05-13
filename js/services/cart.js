function addSelectedToCart(){
  if(!selected) return;
  if(selected.available === false){ showToast('Este producto está agotado.'); return; }
  const existingIndex = cart.findIndex(item => item.name===selected.name && item.plan===selected.plan && item.cat===selected.cat);
  if(existingIndex >= 0){ cart[existingIndex].qty += 1; }
  else { cart.push({name:selected.name,plan:selected.plan,cat:selected.deviceLabel || selected.cat,price:selected.price,oldPrice:selected.oldPrice,img:selected.img,desc:selected.desc || '',qty:1}); }
  closeModal();
  updateCartUI();
  showToast('Producto agregado al carrito.');
}

function openCart(){ renderCart(); document.getElementById('cartModal').style.display='flex'; }

function closeCart(){ document.getElementById('cartModal').style.display='none'; }

function removeFromCart(index){ cart.splice(index,1); if(cart.length===0){ appliedCoupon=null; document.getElementById('couponInput').value=''; } updateCartUI(); renderCart(); }

function clearCart(){ cart=[]; appliedCoupon=null; const input=document.getElementById('couponInput'); if(input) input.value=''; updateCartUI(); renderCart(); showToast('Carrito vaciado.'); }

function getCartSubtotal(){ return cart.reduce((sum,item)=>sum + (item.price * item.qty * rate), 0); }

function getCouponEligibleSubtotal(coupon){
  if(!coupon) return 0;

  return cart.reduce((sum,item)=>{
    const itemEligible = isItemEligibleForCoupon(item, coupon);
    if(!itemEligible) return sum;
    return sum + (item.price * item.qty * rate);
  }, 0);
}

function isItemEligibleForCoupon(item, coupon){
  if(!item || !coupon) return false;
  const hasItemDiscount = typeof item.oldPrice === 'number' && item.oldPrice > item.price;
  if(hasItemDiscount && coupon.appliesToDiscounted === false){
    return false;
  }
  return true;
}

function getCouponItemPercent(code, item){
  const coupon = coupons[code];
  if(!coupon || coupon.type !== 'percent') return 0;

  if(!coupon.useDeviceDiscount){
    return Number(coupon.value || 0);
  }

  const config = couponDeviceDiscounts[code] || {};
  const productRates = (config.products && config.products[item.name]) ? config.products[item.name] : null;
  const deviceLabel = item.cat;

  if(productRates && typeof productRates[deviceLabel] === 'number'){
    return productRates[deviceLabel];
  }

  if(config.defaultByDevice && typeof config.defaultByDevice[deviceLabel] === 'number'){
    return config.defaultByDevice[deviceLabel];
  }

  return Number(coupon.value || 0);
}

function getCouponItemDiscount(code, item){
  const coupon = coupons[code];
  if(!coupon || !isItemEligibleForCoupon(item, coupon)) return 0;

  const lineSubtotal = item.price * item.qty * rate;
  if(coupon.type === 'percent'){
    const percent = getCouponItemPercent(code, item);
    return lineSubtotal * (percent / 100);
  }

  return 0;
}

function getCouponDiscountAmount(subtotal){
  if(!appliedCoupon) return 0;

  const coupon = coupons[appliedCoupon];
  if(!coupon) return 0;

  const minSubtotal = (coupon.minSubtotal || 0) * rate;
  if(subtotal < minSubtotal) return 0;

  const eligibleSubtotal = getCouponEligibleSubtotal(coupon);
  if(eligibleSubtotal <= 0) return 0;

  let discount = 0;
  if(coupon.type === 'percent'){
    discount = cart.reduce((sum,item)=>sum + getCouponItemDiscount(appliedCoupon, item), 0);
  } else if(coupon.type === 'fixed'){
    discount = coupon.value * rate;
  }

  return Math.min(discount, eligibleSubtotal);
}

function getCouponValidationMessage(code){
  const coupon = coupons[code];
  if(!coupon) return {ok:false,text:'Cupón no válido.'};

  const subtotal = getCartSubtotal();
  const minSubtotal = (coupon.minSubtotal || 0) * rate;

  if(subtotal < minSubtotal){
    return {ok:false,text:`Este cupón requiere una compra mínima de ${format(minSubtotal)}.`};
  }

  const eligibleSubtotal = getCouponEligibleSubtotal(coupon);
  if(eligibleSubtotal <= 0){
    return {ok:false,text:'Este cupón no aplica porque los productos del carrito ya tienen oferta activa.'};
  }

  return {ok:true,text:`Cupón aplicado: ${code}.`};
}

function applyCoupon(){
  const input=document.getElementById('couponInput');
  const code=(input.value || '').trim().toUpperCase();
  const status=document.getElementById('couponStatus');

  if(cart.length===0){
    appliedCoupon=null;
    status.className='coupon-status coupon-error';
    status.textContent='Agrega al menos un producto al carrito antes de aplicar un cupón.';
    updateCartUI();
    return;
  }

  if(!code){
    appliedCoupon=null;
    status.className='coupon-status';
    status.textContent='';
    updateCartUI();
    renderCart();
    return;
  }

  const validation = getCouponValidationMessage(code);

  if(validation.ok){
    appliedCoupon=code;
    status.className='coupon-status coupon-ok';
    status.textContent=validation.text;
  } else {
    appliedCoupon=null;
    status.className='coupon-status coupon-error';
    status.textContent=validation.text;
  }

  updateCartUI();
  renderCart();
}

function updateCartCount(){ const count = cart.reduce((sum,item)=>sum + item.qty, 0); document.getElementById('cartCount').textContent = count; }

function updateCartUI(){
  updateCartCount();

  const subtotalFinal = getCartSubtotal();
  const productDiscount = getProductDiscountAmount();
  const subtotalStandard = subtotalFinal + productDiscount;
  const couponDiscount = getCouponDiscountAmount(subtotalFinal);
  const total = subtotalFinal - couponDiscount;

  const subtotalStandardEl = document.getElementById('cartSubtotalStandard');
  const productDiscountEl = document.getElementById('cartProductDiscount');
  const discountEl = document.getElementById('cartCouponDiscount');
  const totalEl = document.getElementById('cartTotal');

  if(subtotalStandardEl) subtotalStandardEl.textContent = format(subtotalStandard);
  if(productDiscountEl) productDiscountEl.textContent = '-' + format(productDiscount);
  if(discountEl) discountEl.textContent = '-' + format(couponDiscount);
  if(totalEl) totalEl.textContent = format(total);
}

function renderCart(){
  const list=document.getElementById('cartList');
  const status=document.getElementById('couponStatus');
  const input=document.getElementById('couponInput');
  if(input){ input.value = appliedCoupon || ''; }
  if(cart.length===0){
    list.innerHTML = `<div class="empty-cart"><p>Abre un producto y pulsa “Agregar al carrito”.</p><p style="margin-top:8px;opacity:0.7;"></p></div>`;
    if(status){ status.className='coupon-status'; status.textContent=''; }
    updateCartUI();
    return;
  }
  list.innerHTML = cart.map((item,index)=>{
    const linePrice = item.price * item.qty * rate;
    const hasItemDiscount = typeof item.oldPrice === 'number' && item.oldPrice > item.price;
    const lineOldPrice = hasItemDiscount ? item.oldPrice * item.qty * rate : linePrice;
    const itemDiscountPercent = hasItemDiscount ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;
    const itemSavings = hasItemDiscount ? (lineOldPrice - linePrice) : 0;
    const couponPercent = appliedCoupon ? getCouponItemPercent(appliedCoupon, item) : 0;
    const couponItemDiscount = appliedCoupon ? getCouponItemDiscount(appliedCoupon, item) : 0;
    const couponHtml = couponItemDiscount > 0 ? `<div class="cart-item-discount"><span>Cupón ${appliedCoupon}: -${format(couponItemDiscount)}</span><strong>${couponPercent}%</strong></div>` : ``;
    return `<div class="cart-item"><div class="protected-img"><img src="${item.img}" alt="${item.name} ${item.plan}" draggable="false" loading="lazy" oncontextmenu="return false;"></div><div><div class="cart-item-title">${item.name}</div><div class="cart-item-meta">${item.plan} • ${item.cat}</div><div class="cart-item-meta">${item.desc || ''}</div><div class="cart-item-meta">Cantidad: ${item.qty}</div><div class="cart-item-price">${format(linePrice)}</div>${hasItemDiscount ? `<div class="cart-item-old-price">${format(lineOldPrice)}</div><div class="cart-item-discount"><span>Ahorras ${format(itemSavings)}</span><strong>-${itemDiscountPercent}%</strong></div>` : ``}${couponHtml}</div><button class="icon-btn" onclick="removeFromCart(${index})">Quitar</button></div>`;
  }).join('');
  if(status && appliedCoupon && coupons[appliedCoupon]){
    const validation = getCouponValidationMessage(appliedCoupon);
    status.className = validation.ok ? 'coupon-status coupon-ok' : 'coupon-status coupon-error';
    status.textContent = validation.text;
    if(!validation.ok){ appliedCoupon = null; if(input){ input.value=''; } }
  }
  else if(status && !appliedCoupon){ status.className='coupon-status'; status.textContent=''; }
  updateCartUI();
}
