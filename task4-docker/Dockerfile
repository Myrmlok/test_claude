# Образ для backend-приложения
# 1. Берём готовый образ с Node.js
FROM node:22-alpine

# 2. Рабочая папка внутри контейнера
WORKDIR /app

# 3. Сначала копируем только package.json и ставим зависимости
#    (Docker закэширует этот слой и не будет переустанавливать пакеты, если они не менялись)
COPY package*.json ./
RUN npm install --omit=dev

# 4. Копируем исходный код
COPY src ./src

# 5. Приложение слушает порт 3000
EXPOSE 3000

# 6. Команда запуска
CMD ["node", "src/index.js"]
