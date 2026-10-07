// Простой статический сервер без зависимостей: node server.js
// Service Worker работает только по https или на localhost, поэтому открываем через сервер, а не двойным кликом по файлу
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403);
      return res.end();
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not found');
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`Приложение: http://localhost:${PORT}`));
