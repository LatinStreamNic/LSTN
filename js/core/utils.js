function getProductDiscountAmount(){
  return cart.reduce((sum, item) => {
    const hasItemDiscount = typeof item.oldPrice === 'number' && item.oldPrice > item.price;
    if(!hasItemDiscount) return sum;

    return sum + ((item.oldPrice - item.price) * item.qty * rate);
  }, 0);
}

function format(p){return currency + ' ' + p.toFixed(2);}

function hasDiscount(product){return typeof product.oldPrice === 'number' && product.oldPrice > product.price;}

function getDiscountPercent(product){if(!hasDiscount(product)) return 0; return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);}

function getSavings(product){if(!hasDiscount(product)) return 0; return (product.oldPrice - product.price) * rate;}

function renderCardExtra(p){
  if(!hasDiscount(p)) return '';
  return `<div class="card-saving-box"><span>Ahorras ${format(getSavings(p))}</span><span class="card-saving-pill">-${getDiscountPercent(p)}%</span></div>`;
}

function normalizeDeviceLabel(cat){
  const c = (cat || '').toLowerCase();
  if(c.includes('3 tv') || c.includes('3 dispositivo')) return '3 Dispositivos';
  if(c.includes('2 dispositivo')) return '2 Dispositivos';
  if(c.includes('1 dispositivo')) return '1 Dispositivo';
  if(c.includes('5 dispositivo')) return '5 Dispositivos';
  return cat || 'Plan';
}

function getDeviceNumber(label){
  const match = String(label || '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function parsePlanMonths(plan){
  const match = String(plan || '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

function showToast(text){const toast=document.getElementById('toast'); toast.textContent=text; toast.classList.add('show'); clearTimeout(showToast._timer); showToast._timer=setTimeout(()=>toast.classList.remove('show'),2200);}
