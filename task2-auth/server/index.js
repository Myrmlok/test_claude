// Сервер: регистрация, вход (JWT), роли и товары
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authMiddleware, roleMiddleware, JWT_SECRET } = require('./middleware');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Роли: 'user' — обычный пользователь, 'employee' — сотрудник
const ROLES = ['user', 'employee'];

// Данные хранятся в памяти
const users = []; // { id, email, passwordHash, role }
let products = [
  { id: 1, name: 'Ноутбук', price: 75000 },
  { id: 2, name: 'Мышь', price: 1500 },
  { id: 3, name: 'Клавиатура', price: 3500 },
];
let nextUserId = 1;
let nextProductId = 4;

// ---------- АУТЕНТИФИКАЦИЯ ----------

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Укажите email и пароль' });
  }
  if (!ROLES.includes(role)) {
    return res.status(400).json({ error: 'Неизвестная роль' });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'Пользователь уже существует' });
  }

  // Хешируем пароль: 10 — "соль-раунды" (сложность хеширования)
  // В базе хранится только хеш, сам пароль — никогда
  const passwordHash = await bcrypt.hash(password, 10);

  const user = { id: nextUserId++, email, passwordHash, role };
  users.push(user);

  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  // bcrypt.compare хеширует введённый пароль и сравнивает с хешем из базы
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  // Создаём JWT access-токен: внутри id, email и роль; живёт 1 час
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ accessToken });
});

// Текущий пользователь — защищённый маршрут (нужен токен)
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json({ id: user.id, email: user.email, role: user.role });
});

// ---------- ТОВАРЫ ----------

// Просматривать могут все вошедшие пользователи (user и employee)
app.get('/api/products', authMiddleware, (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', authMiddleware, (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  res.json(product);
});

// Создавать, изменять и удалять — только сотрудник (employee)
app.post('/api/products', authMiddleware, roleMiddleware('employee'), (req, res) => {
  const { name, price } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Укажите name и price' });
  }
  const product = { id: nextProductId++, name, price: Number(price) };
  products.push(product);
  res.status(201).json(product);
});

app.patch('/api/products/:id', authMiddleware, roleMiddleware('employee'), (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  const { name, price } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = Number(price);
  res.json(product);
});

app.delete('/api/products/:id', authMiddleware, roleMiddleware('employee'), (req, res) => {
  const exists = products.some((p) => p.id === Number(req.params.id));
  if (!exists) return res.status(404).json({ error: 'Товар не найден' });
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
