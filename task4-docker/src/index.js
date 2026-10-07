// REST API товаров: данные в PostgreSQL, список товаров кэшируется в Redis
const express = require('express');
const { pool, initDb } = require('./db');
const { redis, initCache, PRODUCTS_KEY, CACHE_TTL } = require('./cache');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Сбрасываем кэш после любого изменения данных, чтобы не отдавать устаревший список
async function clearProductsCache() {
  await redis.del(PRODUCTS_KEY);
  console.log('Кэш очищен');
}

// Получить список товаров (с кэшированием)
app.get('/api/products', async (req, res) => {
  // 1. Ищем данные в Redis
  const cached = await redis.get(PRODUCTS_KEY);
  if (cached) {
    console.log('GET /api/products -> из кэша Redis');
    res.set('X-Cache', 'HIT');
    return res.json(JSON.parse(cached));
  }

  // 2. В кэше нет — берём из PostgreSQL
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
  console.log('GET /api/products -> из PostgreSQL, сохраняем в Redis');

  // 3. Сохраняем в Redis со временем жизни CACHE_TTL секунд
  await redis.set(PRODUCTS_KEY, JSON.stringify(rows), { EX: CACHE_TTL });

  res.set('X-Cache', 'MISS');
  res.json(rows);
});

// Получить товар по id
app.get('/api/products/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Товар не найден' });
  res.json(rows[0]);
});

// Создать товар
app.post('/api/products', async (req, res) => {
  const { name, price, description = '' } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Укажите name и price' });
  }
  // $1, $2, $3 — параметры запроса (защита от SQL-инъекций)
  const { rows } = await pool.query(
    'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
    [name, price, description]
  );
  await clearProductsCache();
  res.status(201).json(rows[0]);
});

// Изменить товар (только переданные поля)
app.patch('/api/products/:id', async (req, res) => {
  const { name, price, description } = req.body;
  // COALESCE: если новое значение не передано (NULL), оставляем старое
  const { rows } = await pool.query(
    `UPDATE products
     SET name = COALESCE($1, name),
         price = COALESCE($2, price),
         description = COALESCE($3, description)
     WHERE id = $4
     RETURNING *`,
    [name ?? null, price ?? null, description ?? null, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Товар не найден' });
  await clearProductsCache();
  res.json(rows[0]);
});

// Удалить товар
app.delete('/api/products/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Товар не найден' });
  await clearProductsCache();
  res.status(204).send();
});

// Обработчик ошибок (например, неверный id)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск: сначала подключаемся к БД и Redis, потом слушаем порт
async function start() {
  await initDb();
  await initCache();
  app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
}

start().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
