function sendCartToWhatsApp(){
  if(cart.length===0){ showToast('Tu carrito está vacío.'); return; }
  const now=new Date().toLocaleString();
  const subtotal = getCartSubtotal();
  const couponDiscount = getCouponDiscountAmount(subtotal);
  const total = subtotal - couponDiscount;
  const lines = cart.map((item,idx)=>{
    const linePrice = item.price * item.qty * rate;
    const hasItemDiscount = typeof item.oldPrice === 'number' && item.oldPrice > item.price;
    const lineOldPrice = hasItemDiscount ? item.oldPrice * item.qty * rate : linePrice;
    const itemDiscountAmount = hasItemDiscount ? (lineOldPrice - linePrice) : 0;
    const couponItemDiscount = appliedCoupon ? getCouponItemDiscount(appliedCoupon, item) : 0;
    const couponPercent = appliedCoupon && couponItemDiscount > 0 ? getCouponItemPercent(appliedCoupon, item) : 0;
    return `${idx+1}. ${item.name}\n• Membresía: ${item.plan}\n• Simultaneo: ${item.cat}\n• Cantidad: ${item.qty}\n• Precio estándar: ${format(lineOldPrice)}\n• Desc. artículo: ${format(itemDiscountAmount)}\n• Cupón: ${appliedCoupon && couponItemDiscount > 0 ? appliedCoupon + ' (' + couponPercent + '%)' : 'No aplica'}\n• Descuento: ${format(couponItemDiscount)}\n• Subtotal: ${format(linePrice)}\n• Subtotal final artículo: ${format(linePrice - couponItemDiscount)}`;
  }).join('\n\n');
  const couponLine = appliedCoupon && coupons[appliedCoupon]
    ? `• Cupón aplicado: ${appliedCoupon} (${coupons[appliedCoupon].label})\n• Desc. cupón: ${format(couponDiscount)}`
    : `• Cupón aplicado: Ninguno\n• Desc. cupón: ${format(0)}`;
  const msg=`Hola, me gustaría realizar la siguiente compra.\n\n🎁 Descuento Día de las Madres\n\n🛒 *Detalles del Producto*\n\n${lines}\n\n💰 *Resumen del pedido*\n• Subtotal: ${format(subtotal)}\n${couponLine}\n• Total final: ${format(total)}\n• Hora de orden: ${now}\n\nQuedo atento a los pasos para completar la compra.`;
  window.open(`https://wa.me/50588581031?text=${encodeURIComponent(msg)}`);
}
