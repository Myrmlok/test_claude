// Producer — часть приложения, которая ОТПРАВЛЯЕТ сообщения в очередь RabbitMQ
const amqp = require('amqplib');

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672';
const QUEUE = 'book_created';

let channel = null;

// Подключаемся к RabbitMQ и создаём очередь (если её нет)
async function connectRabbit() {
  const connection = await amqp.connect(RABBIT_URL);
  channel = await connection.createChannel();
  // durable: true — очередь сохранится после перезапуска RabbitMQ
  await channel.assertQueue(QUEUE, { durable: true });
  console.log(`RabbitMQ: подключено, очередь "${QUEUE}"`);
}

// Отправляем объект в очередь (в виде JSON-строки)
async function publishMessage(message) {
  if (!channel) {
    console.warn('RabbitMQ не подключён, сообщение не отправлено');
    return;
  }
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log('Отправлено в очередь:', message);
}

module.exports = { connectRabbit, publishMessage, QUEUE, RABBIT_URL };
