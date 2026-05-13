(function protectImages(){
  const blockedKeys = ['s','u','i','j','c'];

  document.addEventListener('contextmenu', function(e){
    if(e.target.closest && (e.target.closest('img') || e.target.closest('.protected-img'))){
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', function(e){
    if(e.target.tagName === 'IMG' || (e.target.closest && e.target.closest('.protected-img'))){
      e.preventDefault();
    }
  });

  document.addEventListener('selectstart', function(e){
    if(e.target.closest && e.target.closest('.protected-img')){
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', function(e){
    const key = (e.key || '').toLowerCase();
    const isBlockedCombo = (e.ctrlKey || e.metaKey) && blockedKeys.includes(key);
    const isDevToolsKey = e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i','j','c'].includes(key));
    if(isBlockedCombo || isDevToolsKey){
      e.preventDefault();
      e.stopPropagation();
      if(typeof showToast === 'function') showToast('Acción no disponible en esta página.');
      return false;
    }
  }, true);
})();

let currency='USD';
let rate=1;
let selected=null;
let selectedGroup=null;
let selectedVariantIndex=0;
let productGroups=[];
let cart=[];
let appliedCoupon=null;
