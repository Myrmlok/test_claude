// Подключение к Redis — быстрому хранилищу "ключ-значение" в оперативной памяти
const { createClient } = require('redis');

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Ошибка Redis:', err.message));

// Ключ, под которым хранится список товаров, и время жизни кэша (секунды)
const PRODUCTS_KEY = 'products:all';
const CACHE_TTL = Number(process.env.CACHE_TTL) || 60;

async function initCache() {
  await redis.connect();
  console.log('Redis: подключено');
}

module.exports = { redis, initCache, PRODUCTS_KEY, CACHE_TTL };
