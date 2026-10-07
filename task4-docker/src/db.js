// Подключение к PostgreSQL. Параметры берём из переменных окружения
const { Pool, types } = require('pg');

// Тип NUMERIC (код 1700) pg по умолчанию отдаёт строкой — превращаем в число
types.setTypeParser(1700, (value) => parseFloat(value));

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'shop',
});

// Создаём таблицу, если её ещё нет.
// Повторяем попытки: при старте в Docker база может подняться позже приложения
async function initDb(retries = 10) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          price NUMERIC(10, 2) NOT NULL,
          description TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('PostgreSQL: подключено, таблица products готова');
      return;
    } catch (err) {
      console.log(`PostgreSQL недоступен (попытка ${i}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error('Не удалось подключиться к PostgreSQL');
}

module.exports = { pool, initDb };
