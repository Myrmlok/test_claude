// Сервер на Express: REST API для сущности "Книга" (Book)
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const app = express();
const PORT = 3000;

app.use(cors());          // разрешаем запросы с клиента React (другой порт)
app.use(express.json());  // разбираем JSON из тела запроса в req.body

// "База данных" — обычный массив в памяти сервера
let books = [
  { id: 1, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', year: 1967 },
  { id: 2, title: 'Преступление и наказание', author: 'Фёдор Достоевский', year: 1866 },
  { id: 3, title: 'Пикник на обочине', author: 'Аркадий и Борис Стругацкие', year: 1972 },
];
let nextId = 4;

// Документация API: http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 1. Получить список всех книг
app.get('/api/books', (req, res) => {
  res.json(books);
});

// 2. Получить одну книгу по id
app.get('/api/books/:id', (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Книга не найдена' });
  res.json(book);
});

// 3. Добавить книгу
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Нужно указать title, author и year' });
  }
  const book = { id: nextId++, title, author, year: Number(year) };
  books.push(book);
  res.status(201).json(book); // 201 Created
});

// 4. Изменить книгу (меняем только переданные поля)
app.patch('/api/books/:id', (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: 'Книга не найдена' });
  const { title, author, year } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (year !== undefined) book.year = Number(year);
  res.json(book);
});

// 5. Удалить книгу
app.delete('/api/books/:id', (req, res) => {
  const exists = books.some((b) => b.id === Number(req.params.id));
  if (!exists) return res.status(404).json({ error: 'Книга не найдена' });
  books = books.filter((b) => b.id !== Number(req.params.id));
  res.status(204).send(); // 204 No Content — удалено, тело ответа пустое
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Swagger UI:     http://localhost:${PORT}/api-docs`);
});
