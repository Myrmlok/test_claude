import { useEffect, useState } from 'react';
import { getMe, getToken, setToken } from './api';
import AuthForm from './AuthForm';
import Products from './Products';

export default function App() {
  const [user, setUser] = useState(null); // текущий пользователь { id, email, role }

  // Узнаём, кто вошёл: GET /api/auth/me (защищённый маршрут)
  async function loadUser() {
    if (!getToken()) return;
    try {
      setUser(await getMe());
    } catch {
      setToken(null); // токен недействителен — выходим
      setUser(null);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🛒 Магазин</h1>
        {user && (
          <div>
            <span className="badge">
              {user.email} — {user.role === 'employee' ? 'сотрудник' : 'пользователь'}
            </span>{' '}
            <button onClick={logout}>Выйти</button>
          </div>
        )}
      </div>

      {user ? <Products user={user} /> : <AuthForm onLogin={loadUser} />}
    </div>
  );
}
