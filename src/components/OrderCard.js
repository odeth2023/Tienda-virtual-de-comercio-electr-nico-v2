import { escHtml, formatDate, calculateTotals } from '../js/vault-common.js';

const statusConfig = {
  created:   { label: 'Creado',    step: 0, badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', dotClass: 'bg-yellow-500' },
  preparing: { label: 'Preparando', step: 1, badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', dotClass: 'bg-yellow-500' },
  shipped:   { label: 'En camino', step: 2, badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dotClass: 'bg-blue-500' },
  delivered: { label: 'Entregado', step: 3, badgeClass: 'bg-green-500/10 text-green-500 border-green-500/20', dotClass: 'bg-green-500' },
  cancelled: { label: 'Cancelado', step: -1, badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20', dotClass: 'bg-red-500' },
};

const trackSteps = [
  { id: 'created',   label: 'Creado',
    icon: `<i data-lucide="check" class="w-3 h-3 stroke-[2.5]"></i>` },
  { id: 'preparing', label: 'Prep.',
    icon: `<i data-lucide="package" class="w-3 h-3 stroke-[2.5]"></i>` },
  { id: 'shipped',   label: 'Camino',
    icon: `<i data-lucide="truck" class="w-3 h-3 stroke-[2.5]"></i>` },
  { id: 'delivered', label: 'Listo',
    icon: `<i data-lucide="home" class="w-3 h-3 stroke-[2.5]"></i>` },
];

export function OrderCard(order) {
  const cfg = statusConfig[order.status] || statusConfig.created;
  const { total } = calculateTotals(order.items);
  const previewImgs = order.items.slice(0, 4);
  const extra = order.items.length - 4;

  const miniTrack = order.status !== 'cancelled' ? `
    <div class="flex items-center justify-between w-full max-w-[320px] gap-1" style="max-width:320px;">
      ${trackSteps.map((step, i) => {
        const isDone = i < cfg.step;
        const isActive = i === cfg.step;
        
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
          <div class="flex flex-col items-center flex-1 relative">
            <div class="w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 ${dotStyle}">
              ${step.icon}
            </div>
            <div class="text-[9px] tracking-wider uppercase font-semibold mt-1.5 ${labelStyle}">${step.label}</div>
          </div>`;
      }).join('')}
    </div>` : `<span class="text-xs text-red-500 font-medium tracking-wider uppercase">Pedido cancelado</span>`;

  return `
    <div class="bg-bg-card border border-border-custom rounded-md overflow-hidden mb-6 flex flex-col" id="card-${escHtml(order.id)}">
      <div class="flex items-center justify-between p-4 md:p-5 border-b border-border-custom flex-wrap gap-3">
        <div>
          <div class="font-display text-base font-semibold text-cream tracking-wide">${escHtml(order.id)}</div>
          <div class="text-[11px] text-muted-custom mt-0.5">${formatDate(order.date, { day:'2-digit', month:'short', year:'numeric' })}</div>
        </div>
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5 text-[10px] tracking-wider uppercase py-1 px-2.5 rounded-full border ${cfg.badgeClass}">
            <span class="w-1.5 h-1.5 rounded-full ${cfg.dotClass}"></span>
            ${cfg.label}
          </span>
          <span class="font-display text-lg font-bold text-cream">$${total.toFixed(2)}</span>
        </div>
      </div>
      <div class="p-4 md:p-5 flex items-center justify-between flex-wrap gap-5 border-b border-border-custom">
        <div class="flex items-center -space-x-2.5">
          ${previewImgs.map(item => `<img class="w-11 h-11 object-contain bg-[#1c1c1c] border border-border-custom rounded-full p-1.5 flex-shrink-0 z-0" src="${item.image}" alt="${escHtml(item.title)}" title="${escHtml(item.title)}" />`).join('')}
          ${extra > 0 ? `<div class="w-11 h-11 bg-border-custom text-cream text-xs font-semibold rounded-full flex items-center justify-center border border-[#1c1c1c] flex-shrink-0 z-10">+${extra}</div>` : ''}
        </div>
        ${miniTrack}
      </div>
      <!-- Expanded detail -->
      <div class="max-h-0 overflow-hidden transition-all duration-300 ease-out bg-[#0f0f0f]" id="detail-${escHtml(order.id)}">
        <div class="p-4 md:p-5 flex flex-col gap-3 border-b border-border-custom/50">
          ${order.items.map(item => `
            <div class="flex items-center gap-4">
              <img class="w-10 h-10 object-contain bg-[#1c1c1c] rounded p-1" src="${item.image}" alt="${escHtml(item.title)}" />
              <div class="flex-1 text-[13px] text-cream">
                <div>${escHtml(item.title)}</div>
                <div class="text-[10px] text-muted-custom mt-0.5">Cant. ${item.qty}</div>
              </div>
              <div class="text-xs text-cream font-medium">$${(item.price * item.qty).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
        <div class="p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label class="text-[10px] tracking-widest uppercase text-gold-dim">Cliente</label>
            <p class="text-cream font-medium mt-1">${escHtml(order.customer.name)}</p>
          </div>
          <div>
            <label class="text-[10px] tracking-widest uppercase text-gold-dim">Correo</label>
            <p class="text-cream font-medium mt-1">${escHtml(order.customer.email)}</p>
          </div>
          <div>
            <label class="text-[10px] tracking-widest uppercase text-gold-dim">Dirección</label>
            <p class="text-cream font-medium mt-1">${escHtml(order.customer.address)}</p>
          </div>
        </div>
      </div>
      <div class="p-4 flex gap-3">
        <button class="bg-transparent border border-border-custom rounded-sm text-cream cursor-pointer text-[11px] font-bold tracking-wider uppercase py-1.5 px-3 hover:border-cream hover:bg-white/5 flex items-center gap-1.5 transition-all duration-200" onclick="toggleDetail('${escHtml(order.id)}', this)">
          <i data-lucide="chevron-down" class="w-3 h-3"></i>
          Ver detalle
        </button>
        <a href="vault-confirmation.html?order=${encodeURIComponent(order.id)}" class="bg-gold border border-gold text-black hover:bg-[#d4b456] hover:border-[#d4b456] rounded-sm text-[11px] font-bold tracking-wider uppercase py-1.5 px-3 flex items-center gap-1.5 transition-all duration-200">Ver seguimiento</a>
      </div>
    </div>`;
}
