# Задание №5 — GraphQL (Apollo Server) + RabbitMQ

GraphQL API на **Apollo Server** с двумя связанными типами — **Author** (автор) и **Book** (книга).
При создании книги через `Mutation` сервер (**Producer**) отправляет сообщение в очередь **RabbitMQ**, а отдельная программа (**Consumer**) читает его и выводит в консоль.

## Структура

```
task5-graphql/
├── src/
│   ├── schema.js     — GraphQL-схема: типы, Query, Mutation
│   ├── resolvers.js  — резолверы (откуда брать данные), включая связи
│   ├── data.js       — данные в памяти: авторы и книги
│   ├── rabbit.js     — Producer: подключение к RabbitMQ и отправка сообщений
│   ├── index.js      — запуск Apollo Server
│   └── consumer.js   — Consumer: получает сообщения из очереди
├── docker-compose.yml — RabbitMQ
└── package.json
```

## Запуск

Нужно **три терминала** и запущенный **Docker Desktop**.

**Терминал 1 — RabbitMQ:**
```bash
cd task5-graphql
docker compose up -d
```
Подождите ~15 секунд, пока RabbitMQ стартует. Панель управления: http://localhost:15672 (логин `guest`, пароль `guest`).

**Терминал 2 — GraphQL API:**
```bash
cd task5-graphql
npm install
npm start
```
Открыть http://localhost:4000 — откроется **Apollo Sandbox**.

**Терминал 3 — Consumer:**
```bash
cd task5-graphql
npm run consumer
```

## Что показать на защите

Запросы вставлять в Apollo Sandbox (http://localhost:4000) и нажимать **Run**.

**1. Query — список книг вместе с авторами (работа резолвера связи):**
```graphql
query {
  books {
    id
    title
    year
    author {
      name
      country
    }
  }
}
```

**2. Query — одна книга по id:**
```graphql
query {
  book(id: "3") {
    title
    year
    author {
      name
    }
  }
}
```

**3. Связь в обратную сторону — авторы и их книги:**
```graphql
query {
  authors {
    name
    books {
      title
    }
  }
}
```

**4. Mutation — создать книгу:**
```graphql
mutation {
  addBook(title: "Белая гвардия", year: 1925, authorId: "1") {
    id
    title
    author {
      name
    }
  }
}
```

**5. Сообщение в RabbitMQ:** в терминале 2 (API) появится «Отправлено в очередь». Чтобы показать сообщение именно в очереди RabbitMQ:
- остановите Consumer (`Ctrl+C` в терминале 3);
- выполните Mutation ещё раз;
- откройте http://localhost:15672 → вкладка **Queues** → очередь `book_created`, в колонке **Ready** — 1 сообщение (там же кнопка **Get messages** показывает его содержимое).

**6. Consumer получает сообщение:** снова запустите `npm run consumer` → в консоли появится «📩 Получено сообщение... Новая книга: "Белая гвардия"», а в панели RabbitMQ счётчик **Ready** станет 0.

Остановка: `Ctrl+C` в терминалах 2 и 3, затем `docker compose down`.
