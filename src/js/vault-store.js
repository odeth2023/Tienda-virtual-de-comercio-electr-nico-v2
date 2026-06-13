/* =========================================================================
   VAULT — Tienda (index.html)
   ========================================================================= */

import { escHtml, getCart, saveCart, refreshIcons } from './vault-common.js';
import { initHeader } from '../components/Header.js';
import { initCartPanel, CartItemHTML, CartEmptyHTML } from '../components/CartPanel.js';
import { initProductModal } from '../components/ProductModal.js';
import { initToast } from '../components/Toast.js';
import { ProductCard, starsHTML } from '../components/ProductCard.js';

// Initialize components dynamically
initHeader('store');
initCartPanel();
initProductModal();
initToast();

let allProducts = [], filteredProducts = [], activeCategory = 'all', currentProduct = null;
let cart = getCart();

const grid = document.getElementById('productsGrid');
const countLabel = document.getElementById('productsCount');
const heroCount = document.getElementById('productCountHero');
const filterTabs = document.getElementById('filterTabs');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartItemsLbl = document.getElementById('cartItemsLabel');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const modalOverlay = document.getElementById('modalOverlay');
const toastEl = document.getElementById('toast');

async function loadProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    allProducts = data;
    heroCount.textContent = allProducts.length;
    buildCategories();
    applyFilters();
  } catch (err) {
    grid.innerHTML = `<p class="text-muted-custom py-8 text-center col-span-full">No se pudo cargar los productos. Verifica tu conexión.</p>`;
    countLabel.textContent = 'Error al cargar';
  }
}

function buildCategories() {
  const cats = [...new Set(allProducts.map(p => p.category))];
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab text-xs font-semibold tracking-widest uppercase text-muted-custom py-1.5 px-3.5 border border-transparent rounded hover:border-border-custom hover:text-cream transition-all duration-200 cursor-pointer'; 
    btn.dataset.cat = cat; 
    btn.textContent = cat;
    btn.addEventListener('click', () => setCategory(cat));
    filterTabs.appendChild(btn);
  });
  
  // Setup the "All" tab click listener
  const allBtn = filterTabs.querySelector('[data-cat="all"]');
  if (allBtn) {
    allBtn.className = 'filter-tab text-xs font-semibold tracking-widest uppercase text-gold py-1.5 px-3.5 border border-gold rounded cursor-pointer';
    allBtn.addEventListener('click', () => setCategory('all'));
  }
}

function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.filter-tab').forEach(b => {
    const isActive = b.dataset.cat === cat;
    if (isActive) {
      b.className = 'filter-tab text-xs font-semibold tracking-widest uppercase text-gold py-1.5 px-3.5 border border-gold rounded cursor-pointer';
    } else {
      b.className = 'filter-tab text-xs font-semibold tracking-widest uppercase text-muted-custom py-1.5 px-3.5 border border-transparent rounded hover:border-border-custom hover:text-cream transition-all duration-200 cursor-pointer';
    }
  });
  applyFilters();
}

function applyFilters() {
  const q = searchInput.value.toLowerCase().trim();
  let list = activeCategory === 'all' ? [...allProducts] : allProducts.filter(p => p.category === activeCategory);
  if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  const sort = sortSelect.value;
  if (sort === 'price-asc') list.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (sort === 'rating') list.sort((a,b) => b.rating.rate - a.rating.rate);
  filteredProducts = list; renderProducts();
}

sortSelect.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);

function renderProducts() {
  countLabel.textContent = `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''}`;
  if (!filteredProducts.length) { 
    grid.innerHTML = `<p class="text-muted-custom py-8 text-center col-span-full">Sin resultados para tu búsqueda.</p>`; 
    return; 
  }
  grid.innerHTML = filteredProducts.map((p, i) => ProductCard(p, i)).join('');
  
  grid.querySelectorAll('.product-card').forEach(c => c.addEventListener('click', e => { 
    if (!e.target.classList.contains('add-btn')) openModal(Number(c.dataset.id)); 
  }));
  grid.querySelectorAll('.add-btn').forEach(b => b.addEventListener('click', e => { 
    e.stopPropagation(); addToCart(Number(b.dataset.id)); 
  }));
  refreshIcons();
}

function addToCart(id) {
  const p = allProducts.find(x => x.id === id); if (!p) return;
  const ex = cart.find(i => i.id === id);
  if (ex) ex.qty++; else cart.push({ id, qty: 1, title: p.title, price: p.price, image: p.image });
  saveCart(cart); updateCartUI();
  showToast(`"${p.title.slice(0, 32)}…" añadido al carrito`);
  cartCountEl.classList.remove('pulse'); void cartCountEl.offsetWidth; cartCountEl.classList.add('pulse');
}

function removeFromCart(id) { cart = cart.filter(i => i.id !== id); saveCart(cart); updateCartUI(); renderCartItems(); }

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id); if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id); else { saveCart(cart); updateCartUI(); renderCartItems(); }
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  if (total > 0) { 
    cartCountEl.textContent = total > 9 ? '9+' : total; 
    cartCountEl.classList.remove('hidden'); 
  } else { 
    cartCountEl.classList.add('hidden'); 
  }
  cartItemsLbl.textContent = `${total} artículo${total !== 1 ? 's' : ''}`;
  cartTotalEl.textContent = `$${cart.reduce((s,i) => s + i.price * i.qty, 0).toFixed(2)}`;
  checkoutBtn.disabled = cart.length === 0;
}

function renderCartItems() {
  if (!cart.length) { 
    cartItemsEl.innerHTML = CartEmptyHTML(); 
    refreshIcons();
    return; 
  }
  cartItemsEl.innerHTML = cart.map(item => CartItemHTML(item)).join('');
  cartItemsEl.querySelectorAll('.qty-btn').forEach(b => b.addEventListener('click', () => changeQty(Number(b.dataset.id), Number(b.dataset.delta))));
  cartItemsEl.querySelectorAll('.remove-btn').forEach(b => b.addEventListener('click', () => removeFromCart(Number(b.dataset.id))));
  refreshIcons();
}

function openCart() { 
  cartPanel.classList.add('translate-x-0'); 
  cartPanel.classList.remove('translate-x-full');
  cartOverlay.classList.remove('opacity-0', 'pointer-events-none'); 
  renderCartItems(); 
  document.body.style.overflow = 'hidden'; 
}

function closeCart() { 
  cartPanel.classList.remove('translate-x-0'); 
  cartPanel.classList.add('translate-x-full');
  cartOverlay.classList.add('opacity-0', 'pointer-events-none'); 
  document.body.style.overflow = ''; 
}

document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => { closeCart(); window.location.href = 'vault-checkout.html'; });

function openModal(id) {
  const p = allProducts.find(x => x.id === id); if (!p) return; currentProduct = p;
  document.getElementById('modalImg').src = p.image; document.getElementById('modalImg').alt = p.title;
  document.getElementById('modalCategory').textContent = p.category;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalPrice').textContent = `$${p.price.toFixed(2)}`;
  document.getElementById('modalRating').innerHTML = starsHTML(p.rating.rate) + `<span class="text-xs text-muted-custom ml-1.5">${p.rating.rate} · ${p.rating.count} reseñas</span>`;
  
  modalOverlay.classList.remove('opacity-0', 'pointer-events-none'); 
  document.getElementById('modal').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
}

function closeModal() { 
  modalOverlay.classList.add('opacity-0', 'pointer-events-none'); 
  document.getElementById('modal').classList.add('scale-95');
  document.body.style.overflow = ''; 
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.getElementById('modalAddBtn').addEventListener('click', () => { if (currentProduct) { addToCart(currentProduct.id); closeModal(); } });

let toastTimer;
function showToast(msg) { 
  clearTimeout(toastTimer); 
  toastEl.textContent = msg; 
  toastEl.classList.remove('translate-y-20', 'opacity-0'); 
  toastTimer = setTimeout(() => {
    toastEl.classList.add('translate-y-20', 'opacity-0');
  }, 2800); 
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeModal(); } });

updateCartUI(); loadProducts();
