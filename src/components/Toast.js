export function ToastHTML() {
  return `<div class="toast fixed bottom-6 left-1/2 -translate-x-1/2 translate-y-20 bg-bg-card border border-gold-dim rounded text-cream text-[13px] font-medium tracking-wide py-2.5 px-5 z-[100] transition-all duration-300 opacity-0 whitespace-nowrap shadow-[0_4px_24px_rgba(201,168,76,0.15)]" id="toast"></div>`;
}

export function initToast() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  container.innerHTML = ToastHTML();
}
