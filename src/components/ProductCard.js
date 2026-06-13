import { escHtml } from '../js/vault-common.js';

export function starsHTML(rate) {
  let html = '<div class="flex gap-0.5">';
  for (let i = 1; i <= 5; i++) {
    const isEmpty = i > Math.round(rate);
    html += `
      <svg class="w-2.5 h-2.5 ${isEmpty ? 'fill-border-custom' : 'fill-gold'}" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`;
  }
  return html + '</div>';
}

export function ProductCard(p, index = 0) {
  const isTopRated = p.rating.rate >= 4.5;
  return `
    <article class="product-card group flex flex-col bg-bg-card border border-border-custom rounded-md overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(201,168,76,0.15)] hover:border-neutral-700 transition-all duration-200" data-id="${p.id}" style="animation: slideUp 0.35s ease forwards; animation-delay: ${index * 40}ms; opacity: 0;">
      <div class="relative aspect-square bg-[#1c1c1c] overflow-hidden flex items-center justify-center p-6">
        ${isTopRated ? '<span class="absolute top-2.5 left-2.5 bg-gold text-black text-[10px] font-bold tracking-wider uppercase py-0.5 px-2 rounded-sm z-10">Top</span>' : ''}
        <img class="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" src="${p.image}" alt="${escHtml(p.title)}" loading="lazy" />
      </div>
      <div class="p-4 flex flex-col gap-1.5 flex-1">
        <span class="text-[10px] tracking-widest uppercase text-gold-dim">${escHtml(p.category)}</span>
        <h3 class="text-sm font-medium text-cream line-clamp-2 leading-snug">${escHtml(p.title)}</h3>
        <div class="flex items-center gap-1.5 mt-0.5">
          ${starsHTML(p.rating.rate)}
          <span class="text-[10px] text-muted-custom">(${p.rating.count})</span>
        </div>
        <div class="flex items-center justify-between mt-auto pt-2.5 border-t border-border-custom">
          <span class="font-display text-lg font-semibold text-cream">$${p.price.toFixed(2)}</span>
          <button class="add-btn bg-transparent border border-gold-dim rounded-sm text-gold cursor-pointer text-[11px] font-bold tracking-wider uppercase py-1 px-3.5 hover:bg-gold hover:text-black flex items-center gap-1 transition-colors duration-200" data-id="${p.id}">
            <i data-lucide="plus" class="w-3 h-3"></i>
            Añadir
          </button>
        </div>
      </div>
    </article>
  `;
}
