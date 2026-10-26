const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) ?? []; } catch { return []; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export const state = { cart: read('cart'), wishlist: read('wishlist') };

export function addToCart(id) {
  const item = state.cart.find((i) => i.id === id);
  item ? item.qty++ : state.cart.push({ id, qty: 1 });
  write('cart', state.cart);
}
export function changeQty(id, d) {
  const item = state.cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) state.cart = state.cart.filter((i) => i.id !== id);
  write('cart', state.cart);
}
export function toggleWish(id) {
  state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
  write('wishlist', state.wishlist);
}
