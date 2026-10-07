# Задание №4 — Товары: PostgreSQL + Redis + Docker

REST API для товаров на **Express**. Данные хранятся в **PostgreSQL**, список товаров кэшируется в **Redis**. Всё запускается через **Docker Compose**.

Сущность **Product**: `id`, `name`, `price`, `description`, `created_at`.

## Структура

```
task4-docker/
├── src/
│   ├── index.js   — маршруты API и логика кэширования
│   ├── db.js      — подключение к PostgreSQL и создание таблицы
│   └── cache.js   — подключение к Redis, ключ и время жизни кэша
├── Dockerfile          — как собрать образ backend
├── docker-compose.yml  — три сервиса: backend, postgres, redis + сеть + volume
└── package.json
```

## Запуск

Запустите **Docker Desktop** и дождитесь, пока он загрузится. Затем:

```bash
cd task4-docker
docker compose up --build
```

Готово, когда в логах появится `Сервер запущен на порту 3000`. API: http://localhost:3000/api/products

Остановка: `Ctrl+C`, затем `docker compose down`.

## API

| Метод | Адрес | Что делает |
|---|---|---|
| POST | `/api/products` | создать товар |
| GET | `/api/products` | список (с кэшем Redis) |
| GET | `/api/products/:id` | товар по id |
| PATCH | `/api/products/:id` | изменить товар |
| DELETE | `/api/products/:id` | удалить товар |

## Что показать на защите

Удобнее всего через **Postman**. Ниже те же запросы через терминал. В Windows пишите `curl.exe` (не `curl`) и запускайте команды из **cmd**, а не из PowerShell, чтобы не ломались кавычки.

Откройте **второй терминал** (в первом идут логи `docker compose up`).

**1. Все контейнеры запущены:**
```bash
docker compose ps
```

**2. Создать товары (CRUD):**
```bash
curl.exe -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\":\"Laptop\",\"price\":75000,\"description\":\"Gaming\"}"
curl.exe -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\":\"Mouse\",\"price\":1500,\"description\":\"Wireless\"}"
```

**3. Кэш — первый запрос из БД, второй из Redis:**
```bash
curl.exe -i http://localhost:3000/api/products
curl.exe -i http://localhost:3000/api/products
```
В заголовках ответа: первый раз `X-Cache: MISS`, второй — `X-Cache: HIT`. В логах сервера — «из PostgreSQL» и «из кэша Redis».

**4. Данные лежат в Redis:**
```bash
docker compose exec redis redis-cli GET products:all
docker compose exec redis redis-cli TTL products:all
```
TTL — сколько секунд кэшу осталось жить (не больше 60).

**5. Изменение очищает кэш:**
```bash
curl.exe -X PATCH http://localhost:3000/api/products/1 -H "Content-Type: application/json" -d "{\"price\":70000}"
docker compose exec redis redis-cli GET products:all
```
→ пусто (`nil`): кэш очищен. Следующий GET снова будет `MISS`.

**6. Остальные операции:**
```bash
curl.exe http://localhost:3000/api/products/1
curl.exe -X DELETE http://localhost:3000/api/products/2
```

**7. Данные действительно в PostgreSQL:**
```bash
docker compose exec postgres psql -U postgres -d shop -c "SELECT * FROM products;"
```

**8. Данные сохраняются после перезапуска:**
```bash
docker compose down
docker compose up
```
Затем снова `curl.exe http://localhost:3000/api/products` — товары на месте, потому что они в volume `postgres-data`.

> `docker compose down -v` удаляет и volume — тогда данные пропадут. На защите используйте `down` без `-v`.
