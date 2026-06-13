import { escHtml, refreshIcons } from '../js/vault-common.js';

export function CartItemHTML(item) {
  return `
    <div class="flex gap-4 pb-4 border-b border-border-custom animate-fade-in" data-id="${item.id}">
      <img class="w-16 h-16 object-contain bg-[#1c1c1c] rounded p-2 flex-shrink-0" src="${item.image}" alt="${escHtml(item.title)}" />
      <div class="flex-1 min-w-0">
        <p class="text-[13px] font-medium text-cream line-clamp-2 leading-snug mb-1">${escHtml(item.title)}</p>
        <span class="font-display text-[15px] font-semibold text-gold">$${item.price.toFixed(2)}</span>
        <div class="flex items-center gap-2 mt-2">
          <button class="qty-btn bg-border-custom border-none rounded w-6 h-6 flex items-center justify-center text-cream cursor-pointer font-bold text-xs hover:bg-gold hover:text-black transition-colors duration-200" data-id="${item.id}" data-delta="-1">−</button>
          <span class="text-xs font-semibold w-5 text-center">${item.qty}</span>
          <button class="qty-btn bg-border-custom border-none rounded w-6 h-6 flex items-center justify-center text-cream cursor-pointer font-bold text-xs hover:bg-gold hover:text-black transition-colors duration-200" data-id="${item.id}" data-delta="1">+</button>
          <button class="remove-btn bg-transparent border-none text-muted-custom cursor-pointer text-[10px] tracking-wider uppercase ml-auto p-0 hover:text-red-500 flex items-center gap-1 transition-colors duration-200" data-id="${item.id}">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            Quitar
          </button>
        </div>
      </div>
    </div>
  `;
}

export function CartEmptyHTML() {
  return `
    <div class="flex flex-col items-center justify-center h-full gap-3 text-muted-custom" id="cartEmpty">
      <i data-lucide="shopping-bag" class="w-11 h-11 opacity-30 text-muted-custom"></i>
      <p class="text-xs tracking-widest uppercase font-semibold">Tu carrito está vacío</p>
    </div>
  `;
}

export function CartPanelHTML() {
  return `
    <div class="cart-overlay fixed inset-0 bg-black/60 z-50 opacity-0 pointer-events-none transition-opacity duration-300" id="cartOverlay"></div>
    <aside class="cart-panel fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-bg-cart border-l-2 border-gold z-50 flex flex-col translate-x-full transition-transform duration-300 ease-out shadow-2xl" id="cartPanel" aria-label="Carrito de compras">
      <div class="flex items-center justify-between p-6 border-b border-border-custom">
        <div>
          <h2 class="font-display text-xl tracking-[0.12em] font-medium">Carrito</h2>
          <span class="text-xs text-muted-custom tracking-wider" id="cartItemsLabel">0 artículos</span>
        </div>
        <button class="close-cart bg-transparent border-none text-muted-custom cursor-pointer p-1 hover:text-cream flex items-center justify-center transition-colors duration-200" id="closeCart" aria-label="Cerrar carrito">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4" id="cartItems">
        ${CartEmptyHTML()}
      </div>
      <div class="p-6 border-t border-border-custom">
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-[11px] tracking-widest uppercase text-muted-custom">Subtotal</span>
          <strong class="font-display text-xl font-bold text-cream" id="cartTotal">$0.00</strong>
        </div>
        <p class="text-[10px] text-muted-custom tracking-wider mb-4">Envío e impuestos calculados al finalizar</p>
        <button class="checkout-btn w-full bg-gold border-none rounded text-black cursor-pointer text-[13px] font-bold tracking-widest uppercase py-3.5 hover:bg-[#d4b456] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all duration-200" id="checkoutBtn" disabled>
          Finalizar compra
        </button>
      </div>
    </aside>
  `;
}

export function initCartPanel() {
  let container = document.getElementById('cartContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'cartContainer';
    document.body.appendChild(container);
  }
  container.innerHTML = CartPanelHTML();
  refreshIcons();
}
