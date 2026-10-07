// Резолверы — функции, которые возвращают данные для каждого поля схемы
const { GraphQLError } = require('graphql');
const { authors, books } = require('./data');
const { publishMessage } = require('./rabbit');

let nextBookId = books.length + 1;

const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args) => books.find((b) => b.id === args.id),
    authors: () => authors,
    author: (parent, args) => authors.find((a) => a.id === args.id),
  },

  Mutation: {
    addBook: async (parent, { title, year, authorId }) => {
      if (!authors.find((a) => a.id === authorId)) {
        throw new GraphQLError(`Автор с id ${authorId} не найден`);
      }
      const book = { id: String(nextBookId++), title, year, authorId };
      books.push(book);

      // Producer: отправляем сообщение о новой книге в очередь RabbitMQ
      await publishMessage({ event: 'BOOK_CREATED', book });

      return book;
    },
  },

  // Резолверы связей между типами.
  // parent — объект, для которого GraphQL запрашивает поле
  Book: {
    author: (parent) => authors.find((a) => a.id === parent.authorId),
  },
  Author: {
    books: (parent) => books.filter((b) => b.authorId === parent.id),
  },
};

module.exports = resolvers;
