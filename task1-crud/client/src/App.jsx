import { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from './api';

const emptyForm = { title: '', author: '', year: '' };

export default function App() {
  const [books, setBooks] = useState([]);       // список книг с сервера
  const [form, setForm] = useState(emptyForm);  // значения полей формы
  const [editingId, setEditingId] = useState(null); // id книги, которую редактируем
  const [error, setError] = useState('');

  // Загружаем список книг с сервера (GET /api/books)
  async function loadBooks() {
    try {
      setBooks(await getBooks());
      setError('');
    } catch {
      setError('Не удалось загрузить данные. Сервер запущен?');
    }
  }

  // useEffect с пустым массивом — выполняется один раз при открытии страницы
  useEffect(() => {
    loadBooks();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Отправка формы: либо добавляем (POST), либо изменяем (PATCH)
  async function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, year: Number(form.year) };
    if (editingId) {
      await updateBook(editingId, data);
    } else {
      await createBook(data);
    }
    setForm(emptyForm);
    setEditingId(null);
    loadBooks();
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, year: book.year });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id) {
    if (!confirm('Удалить книгу?')) return;
    await deleteBook(id); // DELETE /api/books/:id
    loadBooks();
  }

  return (
    <div className="container">
      <h1>📚 Библиотека</h1>

      <form onSubmit={handleSubmit} className="form">
        <h2>{editingId ? 'Изменить книгу' : 'Добавить книгу'}</h2>
        <input name="title" placeholder="Название" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Автор" value={form.author} onChange={handleChange} required />
        <input name="year" type="number" placeholder="Год" value={form.year} onChange={handleChange} required />
        <div className="buttons">
          <button type="submit">{editingId ? 'Сохранить' : 'Добавить'}</button>
          {editingId && <button type="button" onClick={cancelEdit}>Отмена</button>}
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr><th>ID</th><th>Название</th><th>Автор</th><th>Год</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>
                <button onClick={() => startEdit(book)}>✏️ Изменить</button>
                <button onClick={() => handleDelete(book.id)}>🗑 Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
