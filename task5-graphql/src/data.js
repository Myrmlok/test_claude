// Данные хранятся в памяти. Два связанных типа: Автор (Author) и Книга (Book)
// Связь: у книги есть authorId — это id её автора (один автор -> много книг)

const authors = [
  { id: '1', name: 'Михаил Булгаков', country: 'Россия' },
  { id: '2', name: 'Джордж Оруэлл', country: 'Великобритания' },
];

const books = [
  { id: '1', title: 'Мастер и Маргарита', year: 1967, authorId: '1' },
  { id: '2', title: 'Собачье сердце', year: 1925, authorId: '1' },
  { id: '3', title: '1984', year: 1949, authorId: '2' },
];

module.exports = { authors, books };
