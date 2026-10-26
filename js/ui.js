import * as data from './data.js';
import { state } from './state.js';
import { icon } from './icons.js';

export const filters = { q: '', cat: '', open: false };

const money = (n) => `$${n.toFixed(2)}`;
const find = (id) => data.products.find((p) => p.id === id);

export const productCard = (p) => `
  <article class="card">
    <div class="card__img"><img src="${p.image}" alt="${p.title}" loading="lazy">
      <button class="wish ${state.wishlist.includes(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-label="Wishlist">${icon('heart', state.wishlist.includes(p.id))}</button>
    </div>
    <div class="card__body">
      <span class="card__cat">${p.category}</span>
      <h3 class="card__title">${p.title}</h3>
      <p class="card__desc">${p.description}</p>
      <span class="card__price">${money(p.price)}</span>
      <div class="card__foot"><button class="btn" data-add="${p.id}">Add to Cart</button></div>
    </div>
  </article>`;

const grid = (list) => list.length ? `<div class="grid">${list.map(productCard).join('')}</div>` : `<p class="empty">Nothing here yet.</p>`;

const match = () => data.products.filter((p) => (!filters.cat || p.category === filters.cat) && p.title.toLowerCase().includes(filters.q.toLowerCase()));
export const listHTML = () => grid(match());

const catalog = (title) => `
  <h1 class="page-title">${title}</h1>
  <div class="toolbar">
    <label class="search">${icon('search')}<input id="search" placeholder="Search products..." value="${filters.q}"></label>
    <button class="btn btn--outline" id="filterBtn">${icon('filter')}Filter</button>
  </div>
  ${filters.open ? `<div class="chips">${['', ...data.categories.map((c) => c.id)].map((c) => `<button class="chip ${filters.cat === c ? 'on' : ''}" data-cat="${c}">${c || 'all'}</button>`).join('')}</div>` : ''}
  <div id="list">${listHTML()}</div>`;

export const views = {
  home: () => catalog('Online Store'),
  products: ({ cat } = {}) => { if (cat !== undefined) filters.cat = cat; return catalog('Products'); },

  categories: () => `
    <h2 class="section-title">Categories</h2>
    <div class="cats">${data.categories.map((c) => `<a class="cat" href="#/products?cat=${encodeURIComponent(c.id)}"><span>${c.icon}</span>${c.name}</a>`).join('')}</div>`,

  wishlist: () => `<h2 class="section-title">Wishlist</h2>${grid(state.wishlist.map(find).filter(Boolean))}`,

  cart: () => {
    if (!state.cart.length) return `<h2 class="section-title">Cart</h2><p class="empty">Your cart is empty.</p>`;
    const total = state.cart.reduce((s, i) => s + (find(i.id)?.price ?? 0) * i.qty, 0);
    return `<h2 class="section-title">Cart</h2>
      ${state.cart.filter((i) => find(i.id)).map((i) => { const p = find(i.id); return `
        <div class="row"><span class="row__item"><img src="${p.image}" alt="">${p.title}</span>
          <div class="qty"><button class="btn btn--outline" data-qty="${p.id}" data-d="-1">−</button>${i.qty}
          <button class="btn btn--outline" data-qty="${p.id}" data-d="1">+</button></div>
          <strong>${money(p.price * i.qty)}</strong></div>`; }).join('')}
      <p class="total">Total: ${money(total)}</p>`;
  },

  login: () => `
    <form class="form" id="loginForm">
      <h2>Login</h2>
      <input type="email" placeholder="Email" required>
      <input type="password" placeholder="Password" required>
      <button class="btn">Sign in</button>
    </form>`
};

export function updateBadges() {
  const set = (id, n) => { const el = document.getElementById(id); el.textContent = n; el.dataset.n = n; };
  set('cartCount', state.cart.reduce((s, i) => s + i.qty, 0));
  set('wishCount', state.wishlist.length);
}
