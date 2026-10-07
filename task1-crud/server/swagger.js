// Описание API в формате OpenAPI 3.0 — его показывает Swagger UI
const bookSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    title: { type: 'string', example: 'Мастер и Маргарита', description: 'Название книги' },
    author: { type: 'string', example: 'Михаил Булгаков', description: 'Автор' },
    year: { type: 'integer', example: 1967, description: 'Год издания' },
  },
};

const bookInput = {
  type: 'object',
  required: ['title', 'author', 'year'],
  properties: {
    title: { type: 'string', example: 'Война и мир' },
    author: { type: 'string', example: 'Лев Толстой' },
    year: { type: 'integer', example: 1869 },
  },
};

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Идентификатор книги',
  schema: { type: 'integer' },
};

const notFound = { description: 'Книга не найдена' };

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Books API',
    version: '1.0.0',
    description: 'REST API для управления списком книг (CRUD)',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    schemas: { Book: bookSchema, BookInput: bookInput },
  },
  paths: {
    '/api/books': {
      get: {
        summary: 'Получить список книг',
        tags: ['Books'],
        responses: {
          200: {
            description: 'Список книг',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Добавить книгу',
        tags: ['Books'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BookInput' } } },
        },
        responses: {
          201: {
            description: 'Книга создана',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
          },
          400: { description: 'Не заполнены обязательные поля' },
        },
      },
    },
    '/api/books/{id}': {
      get: {
        summary: 'Получить книгу по id',
        tags: ['Books'],
        parameters: [idParam],
        responses: {
          200: {
            description: 'Книга',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
          },
          404: notFound,
        },
      },
      patch: {
        summary: 'Изменить книгу',
        tags: ['Books'],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BookInput' } } },
        },
        responses: {
          200: {
            description: 'Обновлённая книга',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
          },
          404: notFound,
        },
      },
      delete: {
        summary: 'Удалить книгу',
        tags: ['Books'],
        parameters: [idParam],
        responses: {
          204: { description: 'Книга удалена' },
          404: notFound,
        },
      },
    },
  },
};
