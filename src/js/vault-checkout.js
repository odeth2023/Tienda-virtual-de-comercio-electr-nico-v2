/* =========================================================================
   VAULT — Checkout (vault-checkout.html)
   ========================================================================= */

import { escHtml, getCart, saveCart, calculateTotals, getOrders, saveOrders, refreshIcons } from './vault-common.js';
import { initHeader } from '../components/Header.js';

// Initialize header component dynamically
initHeader('checkout');

let cart = getCart();
const content = document.getElementById('checkoutContent');

if (!cart.length) {
  content.innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <i data-lucide="shopping-bag" class="w-14 h-14 opacity-55 text-muted-custom"></i>
      <p class="text-sm uppercase tracking-wider text-muted-custom">Tu carrito está vacío.</p>
      <a href="index.html" class="inline-block bg-gold text-black rounded text-[11px] font-bold tracking-widest uppercase py-3 px-8 hover:bg-[#d4b456] transition-colors duration-200 no-underline">Ir a la tienda</a>
    </div>`;
} else {
  renderCheckout();
}

function renderCheckout() {
  const { subtotal, shipping, tax, total } = calculateTotals(cart);

  content.innerHTML = `
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 max-w-6xl mx-auto px-6 md:px-10 py-10 items-start">
    <!-- LEFT: form -->
    <div class="w-full">
      <!-- Contact -->
      <div class="bg-bg-card border border-border-custom rounded-md p-6 md:p-8 mb-6">
        <div class="font-display text-xl font-medium text-cream flex items-center gap-3 mb-6">
          <span class="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center text-xs font-bold">1</span>
          Información de contacto
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Nombre</label>
            <input type="text" id="fname" placeholder="Ana" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
            <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="fnameErr">Nombre requerido</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Apellido</label>
            <input type="text" id="lname" placeholder="García" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
            <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="lnameErr">Apellido requerido</span>
          </div>
        </div>
        <div class="flex flex-col gap-1.5 mb-4">
          <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Correo electrónico</label>
          <input type="email" id="email" placeholder="ana@correo.com" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
          <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="emailErr">Correo válido requerido</span>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Teléfono</label>
          <input type="tel" id="phone" placeholder="+51 999 000 000" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
        </div>
      </div>

      <!-- Shipping -->
      <div class="bg-bg-card border border-border-custom rounded-md p-6 md:p-8 mb-6">
        <div class="font-display text-xl font-medium text-cream flex items-center gap-3 mb-6">
          <span class="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center text-xs font-bold">2</span>
          Dirección de envío
        </div>
        <div class="flex flex-col gap-1.5 mb-4">
          <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Dirección</label>
          <input type="text" id="address" placeholder="Av. Larco 345" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
          <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="addressErr">Dirección requerida</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Ciudad</label>
            <input type="text" id="city" placeholder="Lima" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
            <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="cityErr">Ciudad requerida</span>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Código postal</label>
            <input type="text" id="zip" placeholder="15046" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">País</label>
          <select class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200 cursor-pointer" id="country">
            <option value="PE">Perú</option>
            <option value="MX">México</option>
            <option value="AR">Argentina</option>
            <option value="CO">Colombia</option>
            <option value="CL">Chile</option>
            <option value="US">Estados Unidos</option>
          </select>
        </div>
      </div>

      <!-- Payment -->
      <div class="bg-bg-card border border-border-custom rounded-md p-6 md:p-8">
        <div class="font-display text-xl font-medium text-cream flex items-center gap-3 mb-6">
          <span class="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center text-xs font-bold">3</span>
          Método de pago
        </div>

        <div class="grid grid-cols-3 gap-3 mb-6" id="payMethods">
          <div class="border border-gold text-gold bg-gold/5 rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-neutral-700 transition-colors duration-200 active pay-method" data-method="card">
            <i data-lucide="credit-card" class="w-5 h-5 mb-1"></i>
            <div class="text-[10px] tracking-widest uppercase font-semibold">Tarjeta</div>
          </div>
          <div class="border border-border-custom rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-neutral-700 transition-colors duration-200 pay-method" data-method="paypal">
            <i data-lucide="wallet" class="w-5 h-5 mb-1"></i>
            <div class="text-[10px] tracking-widest uppercase font-semibold">PayPal</div>
          </div>
          <div class="border border-border-custom rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-neutral-700 transition-colors duration-200 pay-method" data-method="bank">
            <i data-lucide="landmark" class="w-5 h-5 mb-1"></i>
            <div class="text-[10px] tracking-widest uppercase font-semibold">Transferencia</div>
          </div>
        </div>

        <div id="cardSection">
          <!-- Card visual -->
          <div class="aspect-[1.586] w-full max-w-[320px] bg-gradient-to-tr from-[#161616] to-[#252525] border border-border-custom rounded-lg p-5 flex flex-col justify-between shadow-lg mb-6 mx-auto">
            <div class="flex justify-end gap-1">
              <div class="w-6 h-6 rounded-full bg-red-500 opacity-75"></div>
              <div class="w-6 h-6 rounded-full bg-yellow-500 opacity-75 -ml-3"></div>
            </div>
            <div class="w-8 h-6 bg-[#d4af37]/35 border border-[#d4af37]/50 rounded-sm"></div>
            <div class="font-display text-base md:text-lg tracking-widest text-cream my-4 text-center" id="cardNumDisplay">•••• •••• •••• ••••</div>
            <div class="flex justify-between items-end">
              <div class="text-[8px] tracking-widest uppercase text-muted-custom flex flex-col gap-0.5">Titular<span class="text-[10px] text-cream font-medium tracking-wider" id="cardNameDisplay">NOMBRE APELLIDO</span></div>
              <div class="text-[8px] tracking-widest uppercase text-muted-custom flex flex-col gap-0.5">Vence<span class="text-[10px] text-cream font-medium tracking-wider" id="cardExpDisplay">MM / AA</span></div>
            </div>
          </div>

          <div class="flex flex-col gap-1.5 mb-4">
            <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Número de tarjeta</label>
            <div class="relative flex items-center">
              <input type="text" id="cardNum" placeholder="1234 5678 9012 3456" maxlength="19" class="bg-[#111] border border-border-custom rounded py-2 pl-3 pr-10 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200 w-full" />
              <i data-lucide="credit-card" class="absolute right-3 text-muted-custom w-4 h-4"></i>
            </div>
            <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="cardNumErr">Número de tarjeta inválido</span>
          </div>
          <div class="flex flex-col gap-1.5 mb-4">
            <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Nombre en la tarjeta</label>
            <input type="text" id="cardName" placeholder="ANA GARCÍA" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
            <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="cardNameErr">Nombre requerido</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">Vencimiento</label>
              <input type="text" id="cardExp" placeholder="MM / AA" maxlength="7" class="bg-[#111] border border-border-custom rounded py-2 px-3 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200" />
              <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="cardExpErr">Fecha inválida</span>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] tracking-widest uppercase text-muted-custom font-semibold">CVV</label>
              <div class="relative flex items-center">
                <input type="text" id="cardCvv" placeholder="•••" maxlength="4" class="bg-[#111] border border-border-custom rounded py-2 pl-3 pr-10 text-cream text-[13px] outline-none focus:border-gold-dim transition-colors duration-200 w-full" />
                <i data-lucide="lock" class="absolute right-3 text-muted-custom w-4 h-4"></i>
              </div>
              <span class="text-[10px] text-red-500 font-medium tracking-wide mt-1 hidden" id="cardCvvErr">CVV inválido</span>
            </div>
          </div>
        </div>

        <div id="altSection" class="hidden py-6 text-center text-xs tracking-wider text-muted-custom border-t border-border-custom mt-4">
          Serás redirigido a completar el pago de forma segura.
        </div>
      </div>

      <button class="w-full bg-gold border-none rounded text-black cursor-pointer text-xs font-bold tracking-widest uppercase py-3.5 hover:bg-[#d4b456] flex items-center justify-center gap-2 transition-all duration-200 mt-6" id="payBtn">
        <i data-lucide="lock" class="w-3.5 h-3.5"></i>
        Pagar $${total.toFixed(2)}
      </button>
    </div>

    <!-- RIGHT: summary -->
    <aside class="w-full lg:sticky lg:top-24">
      <div class="bg-bg-card border border-border-custom rounded-md p-6">
        <div class="font-display text-lg tracking-[0.08em] font-medium pb-4 border-b border-border-custom mb-4">Resumen del pedido</div>
        <div class="flex flex-col gap-4 max-h-[300px] overflow-y-auto mb-4" id="summaryItems">
          ${cart.map(item => `
            <div class="flex gap-3 items-center">
              <img class="w-12 h-12 object-contain bg-[#1c1c1c] rounded p-1.5 flex-shrink-0" src="${item.image}" alt="${escHtml(item.title)}" />
              <div class="flex-1 min-w-0">
                <div class="text-xs text-cream truncate">${escHtml(item.title)}</div>
                <div class="text-[9px] text-muted-custom mt-0.5">Cant. ${item.qty}</div>
              </div>
              <div class="text-xs text-cream font-medium">$${(item.price * item.qty).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
        <div class="border-b border-border-custom mb-4"></div>
        <div class="flex gap-2 mb-4">
          <input class="bg-[#111] border border-border-custom rounded py-1.5 px-3 text-cream text-[13px] flex-1 outline-none focus:border-gold-dim" type="text" placeholder="Código de descuento" id="couponInput" />
          <button class="bg-transparent border border-gold-dim rounded text-gold cursor-pointer text-[10px] font-bold tracking-wider uppercase py-1.5 px-4 hover:bg-gold hover:text-black transition-colors duration-200" onclick="applyCoupon()">Aplicar</button>
        </div>
        <div class="border-b border-border-custom mb-4"></div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between text-xs text-muted-custom">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-xs text-muted-custom">
            <span>Envío</span>
            <span>${shipping === 0 ? '<span class="text-green-500 font-medium">Gratis</span>' : '$' + shipping.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-xs text-muted-custom">
            <span>Impuestos (8%)</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-base text-cream font-semibold border-t border-border-custom pt-3 mt-1">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>
        ${subtotal <= 50 ? `<div class="flex items-center gap-1.5 text-[10px] text-muted-custom bg-border-custom/30 border border-border-custom/50 rounded py-2 px-3 mt-4 mb-4">
          <i data-lucide="check" class="w-3 h-3 text-green-500"></i>
          Agrega $${(50 - subtotal).toFixed(2)} más para envío gratis
        </div>` : `<div class="flex items-center gap-1.5 text-[10px] text-muted-custom bg-border-custom/30 border border-border-custom/50 rounded py-2 px-3 mt-4 mb-4">
          <i data-lucide="check" class="w-3 h-3 text-green-500"></i>
          Envío gratuito aplicado
        </div>`}
        <div class="flex items-center justify-center gap-2 text-[10px] tracking-wider uppercase text-muted-custom mt-6">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          Pago 100% seguro con encriptación SSL
        </div>
      </div>
    </aside>
  </div>`;

  bindEvents();
  refreshIcons();
}

function applyCoupon() {
  const val = document.getElementById('couponInput').value.trim().toUpperCase();
  if (val === 'VAULT10') alert('¡Cupón aplicado! 10% de descuento (demo)');
  else alert('Cupón no válido');
}

function bindEvents() {
  // Payment method tabs
  document.querySelectorAll('.pay-method').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.pay-method').forEach(x => {
        x.className = 'border border-border-custom rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-neutral-700 transition-colors duration-200 pay-method';
      });
      el.className = 'border border-gold text-gold bg-gold/5 rounded p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-neutral-700 transition-colors duration-200 active pay-method';
      const method = el.dataset.method;
      document.getElementById('cardSection').style.display = method === 'card' ? 'block' : 'none';
      
      const altSec = document.getElementById('altSection');
      if (method !== 'card') {
        altSec.classList.remove('hidden');
      } else {
        altSec.classList.add('hidden');
      }
    });
  });

  // Card number formatting
  const cardNumInput = document.getElementById('cardNum');
  cardNumInput && cardNumInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = v;
    document.getElementById('cardNumDisplay').textContent = v.length ? v.padEnd(19, ' •').slice(0,19).replace(/\s{2,}/g,' ') : '•••• •••• •••• ••••';
  });

  // Card name
  const cardNameInput = document.getElementById('cardName');
  cardNameInput && cardNameInput.addEventListener('input', e => {
    const v = e.target.value.toUpperCase();
    e.target.value = v;
    document.getElementById('cardNameDisplay').textContent = v || 'NOMBRE APELLIDO';
  });

  // Card expiry
  const cardExpInput = document.getElementById('cardExp');
  cardExpInput && cardExpInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0,2) + ' / ' + v.slice(2);
    e.target.value = v;
    document.getElementById('cardExpDisplay').textContent = v || 'MM / AA';
  });

  // Pay button
  document.getElementById('payBtn').addEventListener('click', validateAndPay);
}

function validateAndPay() {
  const method = document.querySelector('.pay-method.active').dataset.method;
  let valid = true;

  // Contact validation
  const fields = [
    { id: 'fname', errId: 'fnameErr', check: v => v.length >= 2 },
    { id: 'lname', errId: 'lnameErr', check: v => v.length >= 2 },
    { id: 'email', errId: 'emailErr', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'address', errId: 'addressErr', check: v => v.length >= 5 },
    { id: 'city', errId: 'cityErr', check: v => v.length >= 2 },
  ];

  if (method === 'card') {
    fields.push(
      { id: 'cardNum', errId: 'cardNumErr', check: v => v.replace(/\s/g,'').length === 16 },
      { id: 'cardName', errId: 'cardNameErr', check: v => v.trim().length >= 3 },
      { id: 'cardExp', errId: 'cardExpErr', check: v => /^\d{2}\s\/\s\d{2}$/.test(v) },
      { id: 'cardCvv', errId: 'cardCvvErr', check: v => /^\d{3,4}$/.test(v) },
    );
  }

  fields.forEach(({ id, errId, check }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(errId);
    if (!el) return;
    const ok = check(el.value.trim());
    if (!ok) {
      el.classList.add('border-red-500');
      errEl && errEl.classList.remove('hidden');
      valid = false;
    } else {
      el.classList.remove('border-red-500');
      errEl && errEl.classList.add('hidden');
    }
  });

  if (!valid) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

  simulatePayment();
}

function simulatePayment() {
  const overlay = document.getElementById('processingOverlay');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.className = "fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center gap-6 pointer-events-auto transition-opacity duration-300 opacity-100";
  document.body.style.overflow = 'hidden';

  const steps = ['ps1','ps2','ps3','ps4'];
  const delays = [600, 1500, 2600, 3600];

  steps.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) {
        document.getElementById(steps[i-1]).classList.remove('active');
        document.getElementById(steps[i-1]).classList.add('done');
      }
      document.getElementById(id).classList.add('active');
    }, delays[i]);
  });

  setTimeout(() => {
    document.getElementById('ps4').classList.remove('active');
    document.getElementById('ps4').classList.add('done');
    const ring = document.getElementById('procRing');
    ring.className = 'w-12 h-12 border-4 border-green-500 rounded-full';
    
    const title = document.getElementById('procTitle');
    title.textContent = '¡Pago exitoso!';
    title.className = 'font-display text-2xl font-medium text-green-500';
    
    document.getElementById('procSub').textContent = 'Redirigiendo…';
  }, 4600);

  setTimeout(() => {
    // Save order to localStorage
    const order = {
      id: 'VAULT-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: calculateTotals(cart).subtotal,
      status: 'created',
      customer: {
        name: (document.getElementById('fname').value + ' ' + document.getElementById('lname').value).trim(),
        email: document.getElementById('email').value,
        address: document.getElementById('address').value + ', ' + document.getElementById('city').value
      }
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);

    // Clear cart
    saveCart([]);

    // Navigate
    window.location.href = 'vault-confirmation.html?order=' + order.id;
  }, 5400);
}

window.applyCoupon = applyCoupon;
