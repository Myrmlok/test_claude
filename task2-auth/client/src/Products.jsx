import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from './api';

const emptyForm = { name: '', price: '' };

// Список товаров. Кнопки управления видит только сотрудник
export default function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const isEmployee = user.role === 'employee';

  async function load() {
    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = { name: form.name, price: Number(form.price) };
      if (editingId) await updateProduct(editingId, data);
      else await createProduct(data);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message); // например, 403 "Недостаточно прав"
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({ name: p.name, price: p.price });
  }

  return (
    <div>
      {isEmployee && (
        <form onSubmit={handleSubmit} className="form">
          <h2>{editingId ? 'Изменить товар' : 'Добавить товар'}</h2>
          <input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="number" placeholder="Цена" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <div className="buttons">
            <button type="submit">{editingId ? 'Сохранить' : 'Добавить'}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Отмена</button>
            )}
          </div>
        </form>
      )}

      {/* Для демонстрации: обычный пользователь пытается создать товар — сервер ответит 403 */}
      {!isEmployee && (
        <button
          onClick={async () => {
            setError('');
            try {
              await createProduct({ name: 'Тест', price: 1 });
            } catch (err) {
              setError(`Сервер отказал: ${err.message}`);
            }
          }}
        >
          Попробовать добавить товар (проверка прав)
        </button>
      )}

      {error && <p className="error">{error}</p>}

      <h2>Товары</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Название</th><th>Цена, ₽</th>{isEmployee && <th>Действия</th>}</tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              {isEmployee && (
                <td>
                  <button onClick={() => startEdit(p)}>✏️ Изменить</button>
                  <button onClick={() => handleDelete(p.id)}>🗑 Удалить</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
