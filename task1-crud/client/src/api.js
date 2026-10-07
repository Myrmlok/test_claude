// Все запросы к серверу собраны в одном месте
const API_URL = 'http://localhost:3000/api/books';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export const getBooks = () => request(API_URL);
export const getBook = (id) => request(`${API_URL}/${id}`);
export const createBook = (book) =>
  request(API_URL, { method: 'POST', body: JSON.stringify(book) });
export const updateBook = (id, book) =>
  request(`${API_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(book) });
export const deleteBook = (id) => request(`${API_URL}/${id}`, { method: 'DELETE' });
