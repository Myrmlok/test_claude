// Запуск GraphQL API на Apollo Server
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { connectRabbit } = require('./rabbit');

async function start() {
  await connectRabbit();

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

  console.log(`GraphQL API запущен: ${url}`);
  console.log('Откройте этот адрес в браузере — появится Apollo Sandbox');
}

start().catch((err) => {
  console.error('Ошибка запуска:', err.message);
  process.exit(1);
});
