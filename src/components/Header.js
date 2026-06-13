import { refreshIcons } from '../js/vault-common.js';

export function Header(type = 'store') {
  if (type === 'store') {
    return `
      <div class="flex items-center gap-8">
        <a href="index.html" class="font-display text-2xl font-semibold tracking-[0.25em] text-cream no-underline">V<span class="text-gold">A</span>ULT</a>
        <nav class="hidden md:flex gap-6">
          <a href="#" class="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-custom hover:text-cream transition-colors duration-200">Colección</a>
          <a href="#" class="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-custom hover:text-cream transition-colors duration-200">Destacados</a>
          <a href="vault-orders.html" class="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-custom hover:text-cream transition-colors duration-200">Mis Pedidos</a>
        </nav>
      </div>
      <div class="flex items-center gap-5">
        <div class="flex items-center bg-bg-card border border-border-custom rounded overflow-hidden focus-within:border-gold-dim transition-colors duration-200">
          <input type="text" id="searchInput" placeholder="Buscar productos…" class="bg-transparent border-none outline-none text-cream text-[13px] py-1.5 px-3 w-36 md:w-48 placeholder-muted-custom" />
          <button aria-label="Buscar" class="bg-transparent border-none cursor-pointer py-1.5 px-2.5 text-muted-custom flex items-center hover:text-gold transition-colors duration-200">
            <i data-lucide="search" class="w-3.5 h-3.5 stroke-[2.5]"></i>
          </button>
        </div>
        <button class="relative bg-transparent border border-border-custom rounded-md text-cream cursor-pointer flex items-center gap-2 py-1.5 px-3 md:px-4 text-[13px] font-medium tracking-wide hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200" id="openCart" aria-label="Abrir carrito">
          <div class="relative flex items-center justify-center w-7 h-7 bg-gold/10 border border-gold/30 rounded-full flex-shrink-0 transition-all duration-200">
            <span class="absolute -top-1.5 -right-1.5 bg-gold text-black text-[10px] font-extrabold min-w-[17px] h-[17px] rounded-full flex items-center justify-center border-2 border-bg-app transition-transform duration-200 hidden" id="cartCount">0</span>
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-cream group-hover:text-gold transition-colors duration-200"></i>
          </div>
          <span class="hidden md:inline text-[13px] font-medium tracking-widest">Carrito</span>
        </button>
      </div>
    `;
  } else if (type === 'checkout') {
    return `
      <a href="index.html" class="font-display text-2xl font-semibold tracking-[0.25em] text-cream no-underline">V<span class="text-gold">A</span>ULT</a>
      <div class="flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-wider text-muted-custom">
        <span class="flex items-center gap-1.5 bg-green-500/10 text-green-500 py-1 px-2.5 rounded-full border border-green-500/20">
          <i data-lucide="check" class="w-2.5 h-2.5 stroke-[3]"></i>
          Carrito
        </span>
        <span class="text-muted-custom font-light">›</span>
        <span class="flex items-center gap-1 bg-gold/10 text-gold py-1 px-2.5 rounded-full border border-gold/30 font-bold">Pago</span>
        <span class="text-muted-custom font-light">›</span>
        <span class="flex items-center gap-1 py-1 px-2.5 rounded-full border border-transparent">Confirmación</span>
      </div>
      <a href="index.html" class="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.15em] uppercase text-muted-custom hover:text-cream transition-colors duration-200">
        <i data-lucide="arrow-left" class="w-3 h-3 stroke-[2.5]"></i>
        Volver
      </a>
    `;
  } else if (type === 'confirmation') {
    return `
      <a href="index.html" class="font-display text-2xl font-semibold tracking-[0.25em] text-cream no-underline">V<span class="text-gold">A</span>ULT</a>
    `;
  } else if (type === 'orders') {
    return `
      <a href="index.html" class="font-display text-2xl font-semibold tracking-[0.25em] text-cream no-underline">V<span class="text-gold">A</span>ULT</a>
      <nav class="flex gap-6">
        <a href="index.html" class="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-custom hover:text-cream transition-colors duration-200">Tienda</a>
        <a href="vault-orders.html" class="text-[11px] font-bold tracking-[0.15em] uppercase text-gold border-b border-gold pb-1">Mis Pedidos</a>
      </nav>
    `;
  }
  return '';
}

export function initHeader(type = 'store') {
  const headerEl = document.querySelector('header');
  if (headerEl) {
    headerEl.className = "sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-bg-app/90 backdrop-blur-md border-b border-border-custom";
    headerEl.innerHTML = Header(type);
    refreshIcons();
  }
}
