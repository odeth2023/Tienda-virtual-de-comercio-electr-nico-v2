/* =========================================================================
   VAULT — Mis Pedidos (vault-orders.html)
   ========================================================================= */

import { escHtml, getOrders, saveOrders, refreshIcons } from './vault-common.js';
import { initHeader } from '../components/Header.js';
import { OrderCard } from '../components/OrderCard.js';

// Initialize header component dynamically
initHeader('orders');

let orders = getOrders();
let activeFilter = 'all';

const statusConfig = {
  created:   { label: 'Creado',    step: 0, class: 'created' },
  preparing: { label: 'Preparando', step: 1, class: 'created' },
  shipped:   { label: 'En camino', step: 2, class: 'shipped' },
  delivered: { label: 'Entregado', step: 3, class: 'delivered' },
  cancelled: { label: 'Cancelado', step: -1, class: 'cancelled' },
};

function renderOrders() {
  const container = document.getElementById('ordersContainer');
  const filtered = activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter);

  document.getElementById('ordersCount').textContent = `${filtered.length} pedido${filtered.length !== 1 ? 's' : ''}`;

  if (!orders.length) {
    document.getElementById('demoBanner').style.display = 'none';
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <i data-lucide="package-open" class="w-16 h-16 opacity-55 text-muted-custom mb-2"></i>
        <h3 class="font-display text-xl font-medium text-cream">Sin pedidos aún</h3>
        <p class="text-xs text-muted-custom tracking-wider">Tus compras aparecerán aquí una vez realizadas.</p>
        <a href="index.html" class="inline-block bg-gold text-black rounded text-[11px] font-bold tracking-widest uppercase py-3 px-8 hover:bg-[#d4b456] transition-colors duration-200 no-underline mt-2">Ir a la tienda</a>
      </div>`;
    return;
  }

  if (!filtered.length) {
    container.innerHTML = `<p class="text-xs text-muted-custom py-8 text-center tracking-wider uppercase">Sin pedidos con ese estado.</p>`;
    return;
  }

  container.innerHTML = filtered.map(order => OrderCard(order)).join('');

  // Demo controls
  buildDemoControls();
  refreshIcons();
}

function toggleDetail(orderId, btn) {
  const detail = document.getElementById('detail-' + orderId);
  const isOpen = detail.classList.toggle('max-h-[500px]');
  detail.classList.toggle('max-h-0', !isOpen);
  detail.classList.toggle('border-b', isOpen);
  detail.classList.toggle('border-border-custom', isOpen);
  btn.innerHTML = isOpen
    ? `<i data-lucide="chevron-up" class="w-3 h-3 inline-block align-middle mr-1.5"></i> Ocultar`
    : `<i data-lucide="chevron-down" class="w-3 h-3 inline-block align-middle mr-1.5"></i> Ver detalle`;
  refreshIcons();
}

function buildDemoControls() {
  const ctrl = document.getElementById('demoControls');
  if (!orders.length) { ctrl.innerHTML = ''; return; }

  // Pick first non-delivered order to demo
  const demoOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || orders[0];
  if (!demoOrder) return;

  const nextMap = { created: 'shipped', shipped: 'delivered' };
  const next = nextMap[demoOrder.status];

  ctrl.innerHTML = `
    <span class="text-[10px] tracking-wider uppercase text-muted-custom">${escHtml(demoOrder.id)}:</span>
    ${next ? `<button class="bg-gold/10 border border-gold/30 rounded text-gold text-[10px] font-bold tracking-wider uppercase py-1 px-3.5 hover:bg-gold hover:text-black transition-all duration-200 cursor-pointer" onclick="advanceStatus('${escHtml(demoOrder.id)}')">→ ${statusConfig[next].label}</button>` : ''}
    <button class="bg-red-500/10 border border-red-500/30 rounded text-red-500 text-[10px] font-bold tracking-wider uppercase py-1 px-3.5 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer" onclick="resetOrders()">Limpiar pedidos</button>
  `;
}

function advanceStatus(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  const nextMap = { created: 'shipped', shipped: 'delivered' };
  const next = nextMap[order.status];
  if (next) {
    order.status = next;
    saveOrders(orders);
    renderOrders();
  }
}

function resetOrders() {
  if (confirm('¿Limpiar todos los pedidos? (solo para demo)')) {
    saveOrders([]);
    orders = [];
    renderOrders();
  }
}

// Filter tabs
document.querySelectorAll('.status-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.status-tab').forEach(t => {
      t.className = 'status-tab text-xs font-semibold tracking-wider text-muted-custom py-1.5 px-3 border border-transparent rounded hover:border-border-custom hover:text-cream transition-all duration-200 cursor-pointer';
    });
    tab.className = 'status-tab text-xs font-bold tracking-wider text-gold py-1.5 px-3 border border-gold rounded cursor-pointer active';
    activeFilter = tab.dataset.filter;
    renderOrders();
  });
});

renderOrders();

window.toggleDetail = toggleDetail;
window.advanceStatus = advanceStatus;
window.resetOrders = resetOrders;
