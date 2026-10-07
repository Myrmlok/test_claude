// Запросы к серверу. Токен берём из localStorage и кладём в заголовок Authorization
const API_URL = 'http://localhost:3000/api';

export function getToken() {
  return localStorage.getItem('accessToken');
}

export function setToken(token) {
  if (token) localStorage.setItem('accessToken', token);
  else localStorage.removeItem('accessToken');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(data?.error || `Ошибка ${res.status}`);
  return data;
}

export const register = (email, password, role) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, role }) });

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getMe = () => request('/auth/me');

export const getProducts = () => request('/products');
export const createProduct = (product) =>
  request('/products', { method: 'POST', body: JSON.stringify(product) });
export const updateProduct = (id, product) =>
  request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(product) });
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });
