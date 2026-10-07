// Consumer — отдельная программа, которая ПОЛУЧАЕТ сообщения из очереди
// Запуск: npm run consumer
const amqp = require('amqplib');
const { QUEUE, RABBIT_URL } = require('./rabbit');

async function startConsumer() {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  console.log(`Consumer ждёт сообщения из очереди "${QUEUE}"...`);

  // Подписываемся на очередь: функция вызывается для каждого сообщения
  channel.consume(QUEUE, (msg) => {
    if (!msg) return;
    const data = JSON.parse(msg.content.toString());
    console.log('📩 Получено сообщение:', data.event);
    console.log(`   Новая книга: "${data.book.title}" (${data.book.year}), id=${data.book.id}, authorId=${data.book.authorId}`);

    // ack — подтверждаем, что сообщение обработано; RabbitMQ удалит его из очереди
    channel.ack(msg);
  });
}

startConsumer().catch((err) => {
  console.error('Ошибка Consumer:', err.message);
  process.exit(1);
});
