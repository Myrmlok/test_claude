// Middleware — функции, которые выполняются ДО обработчика маршрута
const jwt = require('jsonwebtoken');

// Секретный ключ для подписи токенов (в реальном проекте хранится в .env)
const JWT_SECRET = 'my_super_secret_key';

// 1. Проверяем, что пользователь вошёл в систему (есть правильный токен)
function authMiddleware(req, res, next) {
  // Клиент присылает заголовок: Authorization: Bearer <токен>
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Нет токена. Выполните вход' });
  }

  try {
    // jwt.verify проверяет подпись и срок действия токена
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, role } — дальше доступно в маршруте
    next();             // всё хорошо — передаём управление дальше
  } catch {
    return res.status(401).json({ error: 'Токен недействителен или истёк' });
  }
}

// 2. Проверяем роль пользователя. Пример: roleMiddleware('employee')
function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      // 403 — пользователь известен, но прав не хватает
      return res.status(403).json({ error: 'Недостаточно прав для этой операции' });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware, JWT_SECRET };
