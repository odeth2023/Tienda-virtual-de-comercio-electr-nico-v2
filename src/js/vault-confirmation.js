/* =========================================================================
   VAULT — Confirmación (vault-confirmation.html)
   ========================================================================= */

import { escHtml, calculateTotals, getOrders, formatDate, refreshIcons } from './vault-common.js';
import { initHeader } from '../components/Header.js';

// Initialize header component dynamically
initHeader('confirmation');

function statusLabel(s) {
  const map = { created:'Creado', shipped:'En camino', delivered:'Entregado', cancelled:'Cancelado' };
  return map[s] || s;
}

const params = new URLSearchParams(window.location.search);
const orderId = params.get('order');
const orders = getOrders();
const order = orders.find(o => o.id === orderId) || orders[0];

const page = document.getElementById('pageContent');

if (!order) {
  page.innerHTML = `
    <div class="text-center py-20">
      <p class="text-xs tracking-widest uppercase text-muted-custom">No se encontró la orden. <a href="index.html" class="text-gold font-bold no-underline hover:underline ml-1">Volver a la tienda</a></p>
    </div>`;
} else {
  const { total } = calculateTotals(order.items);

  const trackSteps = [
    { id: 'created', label: 'Creado', sub: 'Orden registrada',
      icon: `<i data-lucide="check" class="w-3.5 h-3.5 stroke-[2.5]"></i>` },
    { id: 'preparing', label: 'Preparando', sub: 'En bodega',
      icon: `<i data-lucide="package" class="w-3.5 h-3.5 stroke-[2.5]"></i>` },
    { id: 'shipped', label: 'En camino', sub: 'Con courier',
      icon: `<i data-lucide="truck" class="w-3.5 h-3.5 stroke-[2.5]"></i>` },
    { id: 'delivered', label: 'Entregado', sub: 'En tu puerta',
      icon: `<i data-lucide="home" class="w-3.5 h-3.5 stroke-[2.5]"></i>` },
  ];

  // Determine step states
  const statusMap = { created: 0, preparing: 1, shipped: 2, delivered: 3 };
  const currentStep = statusMap[order.status] || 0;

  page.innerHTML = `
    <div class="flex items-center justify-center my-6">
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
    </div>
    
    <div class="text-center flex flex-col items-center gap-3 mb-8">
      <h1 class="font-display text-3xl md:text-4xl font-light text-cream leading-tight">¡Tu compra fue<br /><em class="italic text-gold">exitosa!</em></h1>
      <p class="text-xs text-muted-custom tracking-wider">Recibirás un correo de confirmación pronto.</p>
      <div class="inline-flex items-center gap-1.5 bg-neutral-800 text-cream text-[10px] tracking-wider uppercase py-1 px-3 rounded-full border border-border-custom font-semibold">
        <i data-lucide="clipboard-list" class="w-3 h-3 stroke-[2.5]"></i>
        Pedido ${escHtml(order.id)}
      </div>
    </div>

    <!-- Status track -->
    <div class="bg-bg-card border border-border-custom rounded-md mb-6 overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-border-custom text-xs font-semibold tracking-wider text-muted-custom uppercase">
        <span>Estado del pedido</span>
        <span class="text-gold">${statusLabel(order.status)}</span>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between gap-1 w-full max-w-lg mx-auto flex-wrap md:flex-nowrap">
          ${trackSteps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            
            let dotStyle = 'bg-border-custom text-muted-custom';
            let labelStyle = 'text-muted-custom';
            
            if (isDone) {
              dotStyle = 'bg-green-500/10 text-green-500 border-green-500/25';
              labelStyle = 'text-green-500';
            } else if (isActive) {
              dotStyle = 'bg-gold/10 text-gold border-gold/45 shadow-[0_0_12px_rgba(201,168,76,0.2)]';
              labelStyle = 'text-gold';
            }

            return `
              <div class="flex flex-col items-center flex-1 text-center min-w-[70px] py-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 mb-2 ${dotStyle}">
                  ${step.icon}
                </div>
                <div class="text-[10px] font-semibold tracking-wider uppercase ${labelStyle}">${step.label}</div>
                <div class="text-[9px] text-muted-custom mt-0.5">${step.sub}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Order items -->
    <div class="bg-bg-card border border-border-custom rounded-md mb-6 overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-border-custom text-xs font-semibold tracking-wider text-muted-custom uppercase">
        <span>Artículos</span>
        <span>${order.items.reduce((s,i)=>s+i.qty,0)} productos</span>
      </div>
      <div class="p-6 flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          ${order.items.map(item => `
            <div class="flex items-center gap-4">
              <img class="w-12 h-12 object-contain bg-[#1c1c1c] rounded p-1.5 flex-shrink-0" src="${item.image}" alt="${escHtml(item.title)}" />
              <div class="flex-1 min-w-0 text-[13px] text-cream">
                <div class="truncate font-medium">${escHtml(item.title)}</div>
                <div class="text-[10px] text-muted-custom mt-0.5">Cant. ${item.qty} · $${item.price.toFixed(2)} c/u</div>
              </div>
              <div class="text-xs text-cream font-semibold">$${(item.price * item.qty).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="flex justify-between items-baseline p-4 border-t border-border-custom bg-[#0f0f0f]/40">
        <span class="text-xs text-muted-custom uppercase tracking-wider">Total pagado</span>
        <strong class="font-display text-lg font-bold text-cream">$${total.toFixed(2)}</strong>
      </div>
    </div>

    <!-- Info -->
    <div class="bg-bg-card border border-border-custom rounded-md mb-6 overflow-hidden">
      <div class="flex items-center p-4 border-b border-border-custom text-xs font-semibold tracking-wider text-muted-custom uppercase">
        <span>Detalles del pedido</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-6 text-xs">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] tracking-widest uppercase text-gold-dim font-bold">Fecha</label>
          <p class="text-cream font-medium">${formatDate(order.date)}</p>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] tracking-widest uppercase text-gold-dim font-bold">Cliente</label>
          <p class="text-cream font-medium">${escHtml(order.customer.name)}</p>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] tracking-widest uppercase text-gold-dim font-bold">Correo</label>
          <p class="text-cream font-medium">${escHtml(order.customer.email)}</p>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] tracking-widest uppercase text-gold-dim font-bold">Dirección de envío</label>
          <p class="text-cream font-medium">${escHtml(order.customer.address)}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 justify-center mt-8">
      <a href="vault-orders.html" class="bg-transparent border border-border-custom text-cream rounded text-xs font-bold tracking-widest uppercase py-3.5 px-8 hover:border-cream hover:bg-white/5 transition-all duration-200 no-underline">Ver mis pedidos</a>
      <a href="index.html" class="bg-gold border border-gold text-black rounded text-xs font-bold tracking-widest uppercase py-3.5 px-8 hover:bg-[#d4b456] hover:border-[#d4b456] transition-all duration-200 no-underline">Seguir comprando</a>
    </div>
  `;
  refreshIcons();
}
