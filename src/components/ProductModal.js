export function ProductModalHTML() {
  return `
    <div class="modal-overlay fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-300" id="modalOverlay">
      <div class="relative bg-bg-card border border-border-custom rounded-lg max-w-[680px] w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-0 scale-95 transition-transform duration-300" id="modal">
        <button class="absolute top-4 right-4 bg-transparent border-none text-muted-custom cursor-pointer p-1 hover:text-cream flex items-center justify-center transition-colors duration-200 z-10" id="modalClose">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <div class="w-full md:w-[45%] aspect-square bg-[#1c1c1c] flex items-center justify-center p-8 flex-shrink-0">
          <img id="modalImg" class="w-full h-full object-contain" src="" alt="" />
        </div>
        <div class="p-6 md:p-8 flex flex-col justify-center gap-4 flex-1">
          <span class="text-[10px] tracking-widest uppercase text-gold-dim" id="modalCategory"></span>
          <h2 class="font-display text-xl md:text-2xl font-medium text-cream leading-tight" id="modalTitle"></h2>
          <div class="flex items-center gap-2 text-xs" id="modalRating"></div>
          <p class="text-[13px] text-muted-custom leading-relaxed" id="modalDesc"></p>
          <span class="font-display text-2xl font-semibold text-cream" id="modalPrice"></span>
          <button class="w-full bg-gold border-none rounded text-black cursor-pointer text-[13px] font-bold tracking-widest uppercase py-3 hover:bg-[#d4b456] flex items-center justify-center gap-2 transition-colors duration-200" id="modalAddBtn">
            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initProductModal() {
  let container = document.getElementById('modalContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modalContainer';
    document.body.appendChild(container);
  }
  container.innerHTML = ProductModalHTML();
}
