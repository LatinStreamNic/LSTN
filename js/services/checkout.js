const PAYPAL_PERCENT_FEE = 6.7;
const PAYPAL_FIXED_FEE_USD = 0.30;
const PAYPAL_PAYMENT_URL = 'https://paypal.me/WagnerCald?locale.x=es_XC&country.x=NI';

let checkoutView = 'methods';

function getCheckoutTotals(){
  const subtotal = getCartSubtotal();
  const couponDiscount = getCouponDiscountAmount(subtotal);
  const cartTotal = Math.max(0, subtotal - couponDiscount);

  // cartTotal ya está expresado en la moneda seleccionada.
  const paypalPercentFee = cartTotal * (PAYPAL_PERCENT_FEE / 100);
  const paypalFixedFee = PAYPAL_FIXED_FEE_USD * rate;
  const paypalFee = paypalPercentFee + paypalFixedFee;
  const paypalTotal = cartTotal + paypalFee;

  // PayPal se paga en USD; obtenemos el equivalente independientemente
  // de la moneda que el cliente esté visualizando en la tienda.
  const safeRate = Number(rate) > 0 ? Number(rate) : 1;
  const cartTotalUsd = cartTotal / safeRate;
  const paypalPercentFeeUsd = cartTotalUsd * (PAYPAL_PERCENT_FEE / 100);
  const paypalFeeUsd = paypalPercentFeeUsd + PAYPAL_FIXED_FEE_USD;
  const paypalTotalUsd = cartTotalUsd + paypalFeeUsd;

  return {
    subtotal,
    couponDiscount,
    cartTotal,
    paypalPercentFee,
    paypalFixedFee,
    paypalFee,
    paypalTotal,
    cartTotalUsd,
    paypalPercentFeeUsd,
    paypalFeeUsd,
    paypalTotalUsd
  };
}

function openCheckoutOptions(){
  if(!Array.isArray(cart) || cart.length === 0){
    showToast('Tu carrito está vacío.');
    return;
  }

  // Revalidar cupón antes de abrir el selector de pago.
  if(appliedCoupon && typeof getCouponValidationMessage === 'function'){
    const validation = getCouponValidationMessage(appliedCoupon);
    if(!validation.ok){
      appliedCoupon = null;
      const input = document.getElementById('couponInput');
      if(input) input.value = '';
      updateCartUI();
      renderCart();
    }
  }

  checkoutView = 'methods';
  renderCheckoutModal();

  const modal = document.getElementById('checkoutModal');
  if(!modal) return;

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(()=>modal.classList.add('show'));
}

function closeCheckoutOptions(){
  const modal = document.getElementById('checkoutModal');
  if(!modal) return;

  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(()=>{
    if(!modal.classList.contains('show')) modal.style.display = 'none';
  }, 220);
}

function renderCheckoutModal(){
  const content = document.getElementById('checkoutContent');
  if(!content) return;

  if(checkoutView === 'paypal'){
    renderPaypalCheckout(content);
    return;
  }

  const totals = getCheckoutTotals();

  content.innerHTML = `
    <div class="checkout-heading">
      <div class="modal-eyebrow">Finalizar compra</div>
      <h2>Selecciona cómo deseas pagar</h2>
      <p class="modal-sub">Total actual del carrito: <strong>${format(totals.cartTotal)}</strong></p>
    </div>

    <div class="payment-method-grid">
      <button type="button" class="payment-method-card is-disabled" disabled aria-disabled="true">
        <span class="payment-method-icon"><i class="fa-regular fa-credit-card"></i></span>
        <span class="payment-method-copy">
          <strong>Poket</strong>
          <small>Tarjeta de débito y crédito</small>
          <em>Próximamente</em>
        </span>
      </button>

      <button type="button" class="payment-method-card" onclick="selectCheckoutMethod('paypal')">
        <span class="payment-method-icon paypal"><i class="fa-brands fa-paypal"></i></span>
        <span class="payment-method-copy">
          <strong>PayPal</strong>
          <small>Pago en línea mediante PayPal</small>
          <em>Comisión: ${PAYPAL_PERCENT_FEE}% + US$${PAYPAL_FIXED_FEE_USD.toFixed(2)}</em>
        </span>
        <span class="payment-method-arrow"><i class="fa-solid fa-chevron-right"></i></span>
      </button>

      <button type="button" class="payment-method-card" onclick="selectCheckoutMethod('whatsapp')">
        <span class="payment-method-icon whatsapp"><i class="fa-brands fa-whatsapp"></i></span>
        <span class="payment-method-copy">
          <strong>Orden por WhatsApp</strong>
          <small>Genera el pedido y continúa con atención directa</small>
          <em>Sin comisión adicional</em>
        </span>
        <span class="payment-method-arrow"><i class="fa-solid fa-chevron-right"></i></span>
      </button>
    </div>

    <p class="checkout-security-note">
      <i class="fa-solid fa-shield-halved"></i>
      Latin Stream no solicita ni almacena los datos de tu tarjeta dentro de esta web.
    </p>
  `;
}

function selectCheckoutMethod(method){
  if(method === 'paypal'){
    checkoutView = 'paypal';
    renderCheckoutModal();
    return;
  }

  if(method === 'whatsapp'){
    closeCheckoutOptions();
    if(typeof sendCartToWhatsApp === 'function'){
      sendCartToWhatsApp();
    }
    return;
  }

  showToast('Este método de pago todavía no está disponible.');
}

function renderPaypalCheckout(content){
  const totals = getCheckoutTotals();

  const currencyEquivalent = currency === 'USD'
    ? ''
    : `<div class="paypal-equivalent">Equivalente mostrado en la tienda: <strong>${format(totals.paypalTotal)}</strong></div>`;

  content.innerHTML = `
    <button type="button" class="checkout-back" onclick="backToPaymentMethods()">
      <i class="fa-solid fa-arrow-left"></i> Métodos de pago
    </button>

    <div class="checkout-heading paypal-heading">
      <span class="paypal-brand-mark"><i class="fa-brands fa-paypal"></i></span>
      <div>
        <div class="modal-eyebrow">Pago con PayPal</div>
        <h2>Resumen antes de continuar</h2>
        <p class="modal-sub">La comisión se agrega únicamente cuando eliges PayPal.</p>
      </div>
    </div>

    <div class="paypal-fee-summary">
      <div class="summary-line">
        <span>Total del carrito</span>
        <span>${format(totals.cartTotal)}</span>
      </div>
      <div class="summary-line">
        <span>Comisión PayPal (${PAYPAL_PERCENT_FEE}%)</span>
        <span>+${format(totals.paypalPercentFee)}</span>
      </div>
      <div class="summary-line">
        <span>Cargo fijo (US$${PAYPAL_FIXED_FEE_USD.toFixed(2)})</span>
        <span>+${format(totals.paypalFixedFee)}</span>
      </div>
      <div class="summary-line paypal-fee-line">
        <span>Comisión total PayPal</span>
        <span>+${format(totals.paypalFee)}</span>
      </div>
      <div class="summary-line total paypal-total-line">
        <span>Total a pagar</span>
        <span>${format(totals.paypalTotal)}</span>
      </div>
    </div>

    ${currencyEquivalent}

    <div class="paypal-usd-box">
      <span>Monto que debes pagar en PayPal</span>
      <strong>US$${totals.paypalTotalUsd.toFixed(2)}</strong>
      <button type="button" class="copy-amount-button" onclick="copyPaypalAmount()">
        <i class="fa-regular fa-copy"></i> Copiar monto
      </button>
    </div>

    <div class="paypal-actions">
      <button type="button" class="btn-secondary" onclick="backToPaymentMethods()">Cambiar método</button>
      <button type="button" class="btn-buy paypal-continue" onclick="continueToPaypal()">
        <i class="fa-brands fa-paypal"></i> Continuar a PayPal
      </button>
    </div>

    <p class="paypal-payment-note">
      Al continuar se abrirá PayPal en una nueva pestaña. Verifica que el monto a pagar sea
      <strong>US$${totals.paypalTotalUsd.toFixed(2)}</strong> antes de confirmar el pago.
    </p>
  `;
}

function backToPaymentMethods(){
  checkoutView = 'methods';
  renderCheckoutModal();
}

function copyPaypalAmount(){
  const totals = getCheckoutTotals();
  const amount = totals.paypalTotalUsd.toFixed(2);

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(amount)
      .then(()=>showToast(`Monto US$${amount} copiado.`))
      .catch(()=>fallbackCopyPaypalAmount(amount));
    return;
  }

  fallbackCopyPaypalAmount(amount);
}

function fallbackCopyPaypalAmount(amount){
  const temp = document.createElement('textarea');
  temp.value = amount;
  temp.setAttribute('readonly', '');
  temp.style.position = 'fixed';
  temp.style.opacity = '0';
  document.body.appendChild(temp);
  temp.select();

  try{
    document.execCommand('copy');
    showToast(`Monto US$${amount} copiado.`);
  }catch(e){
    showToast(`Monto PayPal: US$${amount}`);
  }

  temp.remove();
}

function continueToPaypal(){
  const totals = getCheckoutTotals();
  const amount = totals.paypalTotalUsd.toFixed(2);

  // Abrir primero para evitar que el navegador bloquee la nueva pestaña.
  const paypalWindow = window.open(PAYPAL_PAYMENT_URL, '_blank');

  if(!paypalWindow){
    showToast('Permite las ventanas emergentes para abrir PayPal.');
    return;
  }

  try{ paypalWindow.opener = null; }catch(e){}

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(amount).catch(()=>{});
  }

  showToast(`PayPal abierto. Monto: US$${amount}`);
}
