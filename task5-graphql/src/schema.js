// GraphQL-схема: описывает, какие данные есть и какие операции можно выполнить
const typeDefs = `#graphql
  # Тип "Автор"
  type Author {
    id: ID!
    name: String!
    country: String
    books: [Book!]!     # связь: все книги автора
  }

  # Тип "Книга"
  type Book {
    id: ID!
    title: String!
    year: Int
    author: Author!     # связь: автор книги
  }

  # Query — операции чтения
  type Query {
    books: [Book!]!               # список книг
    book(id: ID!): Book           # одна книга по id
    authors: [Author!]!           # список авторов
    author(id: ID!): Author       # один автор по id
  }

  # Mutation — операции изменения данных
  type Mutation {
    addBook(title: String!, year: Int, authorId: ID!): Book!
  }
`;

module.exports = typeDefs;
