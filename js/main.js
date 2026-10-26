import { addToCart, changeQty, toggleWish } from './state.js';
import { views, updateBadges, filters, listHTML } from './ui.js';
import { icon } from './icons.js';
import { loadProducts } from './data.js';

const app = document.getElementById('app');

function render() {
  const [path, query = ''] = (location.hash.slice(1) || '/').split('?');
  const name = path.replace('/', '') || 'home';
  const params = Object.fromEntries(new URLSearchParams(query));
  app.dataset.ready = '1';
  app.innerHTML = (views[name] ?? views.home)(params);
  document.querySelectorAll('[data-link]').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${path}`));
  updateBadges();
}

function paintIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)));
}
paintIcons();

function setThemeIcon() {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.getElementById('theme').innerHTML = icon(dark ? 'moon' : 'sun');
}

app.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.id === 'filterBtn') { filters.open = !filters.open; return render(); }
  if (t.dataset.cat !== undefined) { filters.cat = t.dataset.cat; return render(); }
  if (t.dataset.add) addToCart(+t.dataset.add);
  else if (t.dataset.wish) toggleWish(+t.dataset.wish);
  else if (t.dataset.qty) changeQty(+t.dataset.qty, +t.dataset.d);
  else return;
  render();
});

app.addEventListener('input', (e) => {
  if (e.target.id !== 'search') return;
  filters.q = e.target.value;
  document.getElementById('list').innerHTML = listHTML();
});

app.addEventListener('submit', (e) => {
  if (e.target.id === 'loginForm') { e.preventDefault(); location.hash = '#/'; }
});

document.getElementById('theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  setThemeIcon();
});
try { const t = localStorage.getItem('theme'); if (t) document.documentElement.dataset.theme = t; } catch {}

setThemeIcon();
window.addEventListener('hashchange', render);

async function init() {
  app.innerHTML = '<p class="empty">Loading products…</p>';
  try {
    await loadProducts();
    render();
  } catch (err) {
    app.innerHTML = `<p class="empty">Could not load products. <button class="btn" id="retry">Retry</button></p>`;
    document.getElementById('retry').addEventListener('click', init);
  }
}
init();
