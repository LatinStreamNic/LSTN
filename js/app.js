// =========================================================
// DESCUENTO DE CUPÓN POR PRODUCTO Y DISPOSITIVO
// Edita estos porcentajes cuando quieras cambiar la promo.
// Ejemplo: MAMA30 en WeibTV/Gravicso de 3 Dispositivos = 30%.
// Ese porcentaje NO afecta 1 Dispositivo, 2 Dispositivos ni 5 Dispositivos.
// =========================================================




// =========================================================
// PRECIOS OFICIALES POR DISPOSITIVO
// Edita SOLO esta tabla para cambiar los precios reales.
// price = precio final / oldPrice = precio estándar tachado.
// Si no hay descuento, usa el mismo número en price y oldPrice.
// Si una opción está agotada, cambia available:true por available:false.
// =========================================================



























































































document.getElementById('modal').addEventListener('click', function(e){ if(e.target.id === 'modal'){ closeModal(); } });
document.getElementById('cartModal').addEventListener('click', function(e){ if(e.target.id === 'cartModal'){ closeCart(); } });
document.getElementById('privacyModal').addEventListener('click', function(e){ if(e.target.id === 'privacyModal'){ closePrivacyModal(); } });
loadSavedCurrency();
updateCartUI();
showMomPopupOnce();
