const API = 'https://fakestoreapi.com';

export let products = [];
export let categories = [];

const icons = { electronics: '💻', jewelery: '💍', "men's clothing": '👔', "women's clothing": '👗' };

export async function loadProducts() {
  if (products.length) return;
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  products = await res.json();
  categories = [...new Set(products.map((p) => p.category))].map((id) => ({ id, name: id, icon: icons[id] ?? '🛍️' }));
}
