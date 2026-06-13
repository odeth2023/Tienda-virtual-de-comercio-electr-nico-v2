/* =========================================================================
   VAULT — Utilidades compartidas
   =========================================================================
   Funciones y helpers usados por más de una página. Debe cargarse
   ANTES del script específico de cada página:

     <script src="vault-common.js"></script>
     <script src="vault-store.js"></script>
   ========================================================================= */

export const CART_KEY = 'vault_cart';
export const ORDERS_KEY = 'vault_orders';

/* ── Escapar HTML (usado al insertar texto dinámico con innerHTML) ── */
export function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Formatear fecha ISO a formato legible en español ──
   options sigue el formato de Intl.DateTimeFormat / toLocaleDateString.
   Por defecto: "12 de junio de 2026" (usado en confirmación).
   Pasar { day:'2-digit', month:'short', year:'numeric' } para "12 jun. 2026" (pedidos). */
export function formatDate(iso, options = { day: '2-digit', month: 'long', year: 'numeric' }) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', options);
}

/* ── Cálculo de totales (subtotal, envío, impuestos, total) ──
   Regla de envío: gratis si el subtotal supera $50, si no $9.99.
   Impuestos: 8% del subtotal. Usado en checkout, pedidos y confirmación. */
export function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

/* ── Acceso al carrito en localStorage ── */
export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ── Acceso a los pedidos en localStorage ── */
export function getOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/* ── Inicializar iconos de Lucide ── */
import { 
  createIcons, 
  ShoppingBag, 
  Search, 
  Trash2, 
  ArrowLeft, 
  Check, 
  Plus, 
  Minus, 
  Package, 
  Home, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Landmark, 
  ClipboardList, 
  X,
  ShoppingCart,
  PackageOpen
} from 'lucide';

export function refreshIcons() {
  createIcons({
    icons: {
      ShoppingBag,
      Search,
      Trash2,
      ArrowLeft,
      Check,
      Plus,
      Minus,
      Package,
      Home,
      Truck,
      ChevronDown,
      ChevronUp,
      Lock,
      ShieldCheck,
      CreditCard,
      Wallet,
      Landmark,
      ClipboardList,
      X,
      ShoppingCart,
      PackageOpen
    }
  });
}
