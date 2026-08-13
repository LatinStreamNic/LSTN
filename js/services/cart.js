function addSelectedToCart(){

  if(!selected){
    return;
  }

  if(selected.available === false){
    showToast('Este producto está agotado.');
    return;
  }


  /*
  |--------------------------------------------------------------------------
  | OBTENER EL TIPO DE DISPOSITIVO
  |--------------------------------------------------------------------------
  */

  const deviceLabel =
    selected.deviceLabel ||
    selected.cat ||
    '';


  /*
  |--------------------------------------------------------------------------
  | BUSCAR SI YA EXISTE EN EL CARRITO
  |--------------------------------------------------------------------------
  */

  const existingIndex = cart.findIndex(
    item =>
      item.name === selected.name &&
      item.plan === selected.plan &&
      normalizeCouponText(item.deviceLabel || item.cat) ===
      normalizeCouponText(deviceLabel)
  );


  if(existingIndex >= 0){

    cart[existingIndex].qty += 1;

  } else {

    cart.push({

      name: selected.name,

      plan: selected.plan,

      cat: deviceLabel,

      deviceLabel: deviceLabel,

      price: selected.price,

      oldPrice: selected.oldPrice,

      img: selected.img,

      desc: selected.desc || '',

      qty: 1

    });

  }


  closeModal();

  updateCartUI();

  showToast('Producto agregado al carrito.');
}



function openCart(){

  renderCart();

  const modal =
    document.getElementById('cartModal');

  if(modal){
    modal.style.display = 'flex';
  }

}



function closeCart(){

  const modal =
    document.getElementById('cartModal');

  if(modal){
    modal.style.display = 'none';
  }

}



function removeFromCart(index){

  cart.splice(index, 1);


  if(cart.length === 0){

    appliedCoupon = null;

    const input =
      document.getElementById('couponInput');

    if(input){
      input.value = '';
    }

  }


  updateCartUI();

  renderCart();

}



function clearCart(){

  cart = [];

  appliedCoupon = null;


  const input =
    document.getElementById('couponInput');


  if(input){
    input.value = '';
  }


  updateCartUI();

  renderCart();

  showToast('Carrito vaciado.');

}



/*
|--------------------------------------------------------------------------
| NORMALIZAR TEXTO
|--------------------------------------------------------------------------
|
| Sirve para evitar errores por:
|
| ClienteVip
| CLIENTEVIP
| clientevip
|
| También elimina espacios innecesarios.
|
*/

function normalizeCouponText(value){

  return String(value || '')
    .trim()
    .toLowerCase();

}



/*
|--------------------------------------------------------------------------
| SUBTOTAL DEL CARRITO
|--------------------------------------------------------------------------
*/

function getCartSubtotal(){

  return cart.reduce(

    (sum, item) =>
      sum +
      (
        Number(item.price || 0) *
        Number(item.qty || 0) *
        rate
      ),

    0

  );

}



/*
|--------------------------------------------------------------------------
| SUBTOTAL ELEGIBLE PARA CUPÓN
|--------------------------------------------------------------------------
*/

function getCouponEligibleSubtotal(coupon){

  if(!coupon){
    return 0;
  }


  return cart.reduce((sum, item)=>{

    const itemEligible =
      isItemEligibleForCoupon(
        item,
        coupon
      );


    if(!itemEligible){
      return sum;
    }


    return sum +
      (
        Number(item.price || 0) *
        Number(item.qty || 0) *
        rate
      );

  }, 0);

}



/*
|--------------------------------------------------------------------------
| VALIDAR SI PRODUCTO ACEPTA CUPÓN
|--------------------------------------------------------------------------
*/

function isItemEligibleForCoupon(item, coupon){

  if(!item || !coupon){
    return false;
  }


  const price =
    Number(item.price || 0);


  const oldPrice =
    Number(item.oldPrice || 0);


  const hasItemDiscount =
    oldPrice > 0 &&
    oldPrice > price;


  /*
  |--------------------------------------------------------------------------
  | Si el producto ya tiene descuento y el cupón NO permite combinar ofertas
  |--------------------------------------------------------------------------
  */

  if(
    hasItemDiscount &&
    coupon.appliesToDiscounted === false
  ){
    return false;
  }


  return true;

}



/*
|--------------------------------------------------------------------------
| BUSCAR CUPÓN
|--------------------------------------------------------------------------
|
| No diferencia entre mayúsculas y minúsculas.
|
| ClienteVip
| CLIENTEVIP
| clientevip
|
| Todos funcionarán.
|
*/

function findCouponCode(enteredCode){

  if(!enteredCode){
    return null;
  }


  if(
    typeof coupons === 'undefined' ||
    !coupons
  ){
    return null;
  }


  const normalizedCode =
    normalizeCouponText(enteredCode);


  return Object.keys(coupons).find(

    couponCode =>
      normalizeCouponText(couponCode) ===
      normalizedCode

  ) || null;

}



/*
|--------------------------------------------------------------------------
| BUSCAR PRODUCTO EN CONFIGURACIÓN DEL CUPÓN
|--------------------------------------------------------------------------
*/

function findCouponProductConfig(products, productName){

  if(!products || !productName){
    return null;
  }


  const normalizedProduct =
    normalizeCouponText(productName);


  const productKey =
    Object.keys(products).find(

      key =>
        normalizeCouponText(key) ===
        normalizedProduct

    );


  if(!productKey){
    return null;
  }


  return products[productKey];

}



/*
|--------------------------------------------------------------------------
| BUSCAR PORCENTAJE SEGÚN DISPOSITIVO
|--------------------------------------------------------------------------
*/

function findDeviceDiscount(deviceRates, deviceLabel){

  if(!deviceRates || !deviceLabel){
    return null;
  }


  const normalizedDevice =
    normalizeCouponText(deviceLabel);


  const deviceKey =
    Object.keys(deviceRates).find(

      key =>
        normalizeCouponText(key) ===
        normalizedDevice

    );


  if(!deviceKey){
    return null;
  }


  const value =
    Number(deviceRates[deviceKey]);


  if(Number.isNaN(value)){
    return null;
  }


  return value;

}



/*
|--------------------------------------------------------------------------
| OBTENER PORCENTAJE DEL CUPÓN PARA UN PRODUCTO
|--------------------------------------------------------------------------
*/

function getCouponItemPercent(code, item){

  if(
    typeof coupons === 'undefined' ||
    !coupons
  ){
    return 0;
  }


  const coupon =
    coupons[code];


  if(
    !coupon ||
    coupon.type !== 'percent'
  ){
    return 0;
  }


  /*
  |--------------------------------------------------------------------------
  | CUPÓN NORMAL
  |--------------------------------------------------------------------------
  */

  if(!coupon.useDeviceDiscount){

    return Number(
      coupon.value || 0
    );

  }


  /*
  |--------------------------------------------------------------------------
  | OBTENER CONFIGURACIÓN
  |--------------------------------------------------------------------------
  */

  const config =

    (
      typeof couponDeviceDiscounts !== 'undefined' &&
      couponDeviceDiscounts
    )

    ? couponDeviceDiscounts[code] || {}

    : {};


  const productName =
    item.name || '';


  const deviceLabel =
    item.deviceLabel ||
    item.cat ||
    '';


  /*
  |--------------------------------------------------------------------------
  | PRIORIDAD 1
  |--------------------------------------------------------------------------
  |
  | Buscar descuento específico por producto.
  |
  */

  const productRates =
    findCouponProductConfig(
      config.products,
      productName
    );


  if(productRates){

    const productDeviceDiscount =
      findDeviceDiscount(
        productRates,
        deviceLabel
      );


    if(productDeviceDiscount !== null){

      return productDeviceDiscount;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | PRIORIDAD 2
  |--------------------------------------------------------------------------
  |
  | Buscar porcentaje general según dispositivo.
  |
  */

  const defaultDeviceDiscount =
    findDeviceDiscount(
      config.defaultByDevice,
      deviceLabel
    );


  if(defaultDeviceDiscount !== null){

    return defaultDeviceDiscount;

  }


  /*
  |--------------------------------------------------------------------------
  | PRIORIDAD 3
  |--------------------------------------------------------------------------
  |
  | Usar porcentaje general del cupón.
  |
  */

  return Number(
    coupon.value || 0
  );

}



/*
|--------------------------------------------------------------------------
| DESCUENTO DEL CUPÓN POR PRODUCTO
|--------------------------------------------------------------------------
*/

function getCouponItemDiscount(code, item){

  if(
    typeof coupons === 'undefined' ||
    !coupons
  ){
    return 0;
  }


  const coupon =
    coupons[code];


  if(
    !coupon ||
    !isItemEligibleForCoupon(
      item,
      coupon
    )
  ){
    return 0;
  }


  const lineSubtotal =

    Number(item.price || 0) *

    Number(item.qty || 0) *

    rate;


  if(coupon.type === 'percent'){

    const percent =
      getCouponItemPercent(
        code,
        item
      );


    return lineSubtotal *
      (
        percent /
        100
      );

  }


  return 0;

}



/*
|--------------------------------------------------------------------------
| DESCUENTO TOTAL DEL CUPÓN
|--------------------------------------------------------------------------
*/

function getCouponDiscountAmount(subtotal){

  if(!appliedCoupon){
    return 0;
  }


  if(
    typeof coupons === 'undefined' ||
    !coupons
  ){
    return 0;
  }


  const coupon =
    coupons[appliedCoupon];


  if(!coupon){
    return 0;
  }


  const minSubtotal =

    Number(
      coupon.minSubtotal || 0
    ) *

    rate;


  if(subtotal < minSubtotal){
    return 0;
  }


  const eligibleSubtotal =
    getCouponEligibleSubtotal(
      coupon
    );


  if(eligibleSubtotal <= 0){
    return 0;
  }


  let discount = 0;


  /*
  |--------------------------------------------------------------------------
  | PORCENTAJE
  |--------------------------------------------------------------------------
  */

  if(coupon.type === 'percent'){

    discount = cart.reduce(

      (sum, item) =>

        sum +

        getCouponItemDiscount(
          appliedCoupon,
          item
        ),

      0

    );

  }


  /*
  |--------------------------------------------------------------------------
  | VALOR FIJO
  |--------------------------------------------------------------------------
  */

  else if(coupon.type === 'fixed'){

    discount =

      Number(
        coupon.value || 0
      ) *

      rate;

  }


  return Math.min(
    discount,
    eligibleSubtotal
  );

}



/*
|--------------------------------------------------------------------------
| VALIDACIÓN DEL CUPÓN
|--------------------------------------------------------------------------
*/

function getCouponValidationMessage(code){

  if(
    typeof coupons === 'undefined' ||
    !coupons
  ){

    return {
      ok:false,
      text:'No se pudo cargar la configuración de cupones.'
    };

  }


  const coupon =
    coupons[code];


  if(!coupon){

    return {
      ok:false,
      text:'Cupón no válido.'
    };

  }


  const subtotal =
    getCartSubtotal();


  const minSubtotal =

    Number(
      coupon.minSubtotal || 0
    ) *

    rate;


  /*
  |--------------------------------------------------------------------------
  | COMPRA MÍNIMA
  |--------------------------------------------------------------------------
  */

  if(subtotal < minSubtotal){

    return {

      ok:false,

      text:
        `Este cupón requiere una compra mínima de ${format(minSubtotal)}.`

    };

  }


  /*
  |--------------------------------------------------------------------------
  | PRODUCTOS ELEGIBLES
  |--------------------------------------------------------------------------
  */

  const eligibleSubtotal =
    getCouponEligibleSubtotal(
      coupon
    );


  if(eligibleSubtotal <= 0){

    return {

      ok:false,

      text:
        'Este cupón no aplica porque los productos del carrito ya tienen oferta activa.'

    };

  }


  return {

    ok:true,

    text:
      `Cupón aplicado: ${code}.`

  };

}



/*
|--------------------------------------------------------------------------
| APLICAR CUPÓN
|--------------------------------------------------------------------------
*/

function applyCoupon(){

  const input =
    document.getElementById(
      'couponInput'
    );


  const status =
    document.getElementById(
      'couponStatus'
    );


  if(!input || !status){
    return;
  }


  /*
  |--------------------------------------------------------------------------
  | VERIFICAR QUE coupons.js ESTÉ CARGADO
  |--------------------------------------------------------------------------
  */

  if(
    typeof coupons === 'undefined'
  ){

    appliedCoupon = null;

    status.className =
      'coupon-status coupon-error';

    status.textContent =
      'Error: no se cargó la configuración de cupones.';

    return;

  }


  /*
  |--------------------------------------------------------------------------
  | CARRITO VACÍO
  |--------------------------------------------------------------------------
  */

  if(cart.length === 0){

    appliedCoupon = null;

    status.className =
      'coupon-status coupon-error';

    status.textContent =
      'Agrega al menos un producto al carrito antes de aplicar un cupón.';


    updateCartUI();

    return;

  }


  /*
  |--------------------------------------------------------------------------
  | OBTENER CÓDIGO INTRODUCIDO
  |--------------------------------------------------------------------------
  */

  const enteredCode =
    String(
      input.value || ''
    ).trim();


  /*
  |--------------------------------------------------------------------------
  | CAMPO VACÍO
  |--------------------------------------------------------------------------
  */

  if(!enteredCode){

    appliedCoupon = null;

    status.className =
      'coupon-status';

    status.textContent =
      '';


    updateCartUI();

    renderCart();

    return;

  }


  /*
  |--------------------------------------------------------------------------
  | BUSCAR CUPÓN
  |--------------------------------------------------------------------------
  */

  const code =
    findCouponCode(
      enteredCode
    );


  /*
  |--------------------------------------------------------------------------
  | NO EXISTE
  |--------------------------------------------------------------------------
  */

  if(!code){

    appliedCoupon = null;

    status.className =
      'coupon-status coupon-error';

    status.textContent =
      'Cupón no válido.';


    updateCartUI();

    return;

  }


  /*
  |--------------------------------------------------------------------------
  | VALIDAR CUPÓN
  |--------------------------------------------------------------------------
  */

  const validation =
    getCouponValidationMessage(
      code
    );


  if(validation.ok){

    appliedCoupon =
      code;


    /*
    |--------------------------------------------------------------------------
    | Mostrar nombre oficial
    |--------------------------------------------------------------------------
    */

    input.value =
      code;


    status.className =
      'coupon-status coupon-ok';


    status.textContent =
      validation.text;

  }

  else {

    appliedCoupon =
      null;


    status.className =
      'coupon-status coupon-error';


    status.textContent =
      validation.text;

  }


  /*
  |--------------------------------------------------------------------------
  | ACTUALIZAR CARRITO
  |--------------------------------------------------------------------------
  */

  updateCartUI();

  renderCart();

}



/*
|--------------------------------------------------------------------------
| CONTADOR DEL CARRITO
|--------------------------------------------------------------------------
*/

function updateCartCount(){

  const count =
    cart.reduce(

      (sum, item) =>
        sum +
        Number(item.qty || 0),

      0

    );


  const cartCount =
    document.getElementById(
      'cartCount'
    );


  if(cartCount){
    cartCount.textContent =
      count;
  }

}



/*
|--------------------------------------------------------------------------
| ACTUALIZAR TOTALES
|--------------------------------------------------------------------------
*/

function updateCartUI(){

  updateCartCount();


  const subtotalFinal =
    getCartSubtotal();


  const productDiscount =
    getProductDiscountAmount();


  const subtotalStandard =
    subtotalFinal +
    productDiscount;


  const couponDiscount =
    getCouponDiscountAmount(
      subtotalFinal
    );


  const total =
    subtotalFinal -
    couponDiscount;


  const subtotalStandardEl =
    document.getElementById(
      'cartSubtotalStandard'
    );


  const productDiscountEl =
    document.getElementById(
      'cartProductDiscount'
    );


  const discountEl =
    document.getElementById(
      'cartCouponDiscount'
    );


  const totalEl =
    document.getElementById(
      'cartTotal'
    );


  if(subtotalStandardEl){

    subtotalStandardEl.textContent =
      format(
        subtotalStandard
      );

  }


  if(productDiscountEl){

    productDiscountEl.textContent =
      '-' +
      format(
        productDiscount
      );

  }


  if(discountEl){

    discountEl.textContent =
      '-' +
      format(
        couponDiscount
      );

  }


  if(totalEl){

    totalEl.textContent =
      format(
        total
      );

  }

}



/*
|--------------------------------------------------------------------------
| MOSTRAR CARRITO
|--------------------------------------------------------------------------
*/

function renderCart(){

  const list =
    document.getElementById(
      'cartList'
    );


  const status =
    document.getElementById(
      'couponStatus'
    );


  const input =
    document.getElementById(
      'couponInput'
    );


  if(!list){
    return;
  }


  /*
  |--------------------------------------------------------------------------
  | CUPÓN ACTIVO
  |--------------------------------------------------------------------------
  */

  if(
    input &&
    appliedCoupon
  ){

    input.value =
      appliedCoupon;

  }


  /*
  |--------------------------------------------------------------------------
  | CARRITO VACÍO
  |--------------------------------------------------------------------------
  */

  if(cart.length === 0){

    list.innerHTML = `

      <div class="empty-cart">

        <p>
          Abre un producto y pulsa “Agregar al carrito”.
        </p>

        <p
          style="
            margin-top:8px;
            opacity:0.7;
          "
        ></p>

      </div>

    `;


    if(status){

      status.className =
        'coupon-status';

      status.textContent =
        '';

    }


    updateCartUI();

    return;

  }


  /*
  |--------------------------------------------------------------------------
  | PRODUCTOS
  |--------------------------------------------------------------------------
  */

  list.innerHTML = cart.map(
    (item, index)=>{


      const linePrice =

        Number(item.price || 0) *

        Number(item.qty || 0) *

        rate;


      const oldPrice =
        Number(
          item.oldPrice || 0
        );


      const price =
        Number(
          item.price || 0
        );


      const hasItemDiscount =

        oldPrice > 0 &&

        oldPrice > price;


      const lineOldPrice =

        hasItemDiscount

        ? oldPrice *
          Number(item.qty || 0) *
          rate

        : linePrice;


      const itemDiscountPercent =

        hasItemDiscount

        ? Math.round(

            (
              (
                oldPrice -
                price
              ) /

              oldPrice

            ) *

            100

          )

        : 0;


      const itemSavings =

        hasItemDiscount

        ? lineOldPrice -
          linePrice

        : 0;


      const couponPercent =

        appliedCoupon

        ? getCouponItemPercent(
            appliedCoupon,
            item
          )

        : 0;


      const couponItemDiscount =

        appliedCoupon

        ? getCouponItemDiscount(
            appliedCoupon,
            item
          )

        : 0;


      /*
      |--------------------------------------------------------------------------
      | INFORMACIÓN DEL CUPÓN
      |--------------------------------------------------------------------------
      */

      let couponHtml = '';


      if(
        appliedCoupon &&
        coupons[appliedCoupon]
      ){

        if(couponItemDiscount > 0){

          couponHtml = `

            <div class="cart-item-discount">

              <span>
                Cupón ${appliedCoupon}:
                -${format(couponItemDiscount)}
              </span>

              <strong>
                ${couponPercent}%
              </strong>

            </div>

          `;

        }

        else if(
          coupons[appliedCoupon]
            .useDeviceDiscount
        ){

          couponHtml = `

            <div class="cart-item-meta">

              Cupón ${appliedCoupon}:
              0% para ${item.deviceLabel || item.cat}

            </div>

          `;

        }

      }


      return `

        <div class="cart-item">

          <div class="protected-img">

            <img
              src="${item.img}"
              alt="${item.name} ${item.plan}"
              draggable="false"
              loading="lazy"
              oncontextmenu="return false;"
            >

          </div>


          <div>

            <div class="cart-item-title">

              ${item.name}

            </div>


            <div class="cart-item-meta">

              ${item.plan}
              •
              ${item.deviceLabel || item.cat}

            </div>


            <div class="cart-item-meta">

              ${item.desc || ''}

            </div>


            <div class="cart-item-meta">

              Cantidad:
              ${item.qty}

            </div>


            <div class="cart-item-price">

              ${format(linePrice)}

            </div>


            ${

              hasItemDiscount

              ? `

                <div class="cart-item-old-price">

                  ${format(lineOldPrice)}

                </div>


                <div class="cart-item-discount">

                  <span>

                    Ahorras
                    ${format(itemSavings)}

                  </span>


                  <strong>

                    -${itemDiscountPercent}%

                  </strong>

                </div>

              `

              : ''

            }


            ${couponHtml}

          </div>


          <button
            class="icon-btn"
            onclick="removeFromCart(${index})"
          >

            Quitar

          </button>

        </div>

      `;

    }

  ).join('');


  /*
  |--------------------------------------------------------------------------
  | REVALIDAR CUPÓN
  |--------------------------------------------------------------------------
  */

  if(
    status &&
    appliedCoupon &&
    coupons[appliedCoupon]
  ){

    const validation =
      getCouponValidationMessage(
        appliedCoupon
      );


    status.className =

      validation.ok

      ? 'coupon-status coupon-ok'

      : 'coupon-status coupon-error';


    status.textContent =
      validation.text;


    if(!validation.ok){

      appliedCoupon = null;


      if(input){
        input.value = '';
      }

    }

  }

  else if(
    status &&
    !appliedCoupon
  ){

    status.className =
      'coupon-status';


    status.textContent =
      '';

  }


  updateCartUI();

}
