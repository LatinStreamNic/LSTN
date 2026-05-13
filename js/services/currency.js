function setCurrency(c,r){
  currency=c;
  rate=r;
  localStorage.setItem('latinStoreCurrency', JSON.stringify({currency:c, rate:r}));
  const welcome = document.getElementById('welcome');
  if(welcome){
    welcome.classList.add('hide');
    setTimeout(()=>{ welcome.style.display='none'; }, 360);
  }
  updateCurrencyButton();
  loadProducts();
  updateCartUI();
}

function showCurrencySelector(){
  const welcome = document.getElementById('welcome');
  if(!welcome) return;
  welcome.style.display='flex';
  requestAnimationFrame(()=>welcome.classList.remove('hide'));
}

function updateCurrencyButton(){
  const btn = document.getElementById('currencyChangeBtn');
  if(btn) btn.textContent = `🌎 ${currency}`;
}

function loadSavedCurrency(){
  try{
    const saved = JSON.parse(localStorage.getItem('latinStoreCurrency') || 'null');
    if(saved && saved.currency && typeof saved.rate === 'number'){
      currency = saved.currency;
      rate = saved.rate;
      const welcome = document.getElementById('welcome');
      if(welcome){
        welcome.classList.add('hide');
        welcome.style.display='none';
      }
      updateCurrencyButton();
      loadProducts();
      updateCartUI();
      return true;
    }
  }catch(e){}
  updateCurrencyButton();
  return false;
}
