import { useState } from 'react';
import { register, login, setToken } from './api';

// Форма входа и регистрации
export default function AuthForm({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' или 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (mode === 'register') {
        await register(email, password, role);
        setMessage('Регистрация успешна! Теперь войдите.');
        setMode('login');
      } else {
        const { accessToken } = await login(email, password);
        setToken(accessToken); // сохраняем токен в браузере
        onLogin();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="tabs">
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
          Вход
        </button>
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
          Регистрация
        </button>
      </div>

      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />

      {mode === 'register' && (
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Обычный пользователь</option>
          <option value="employee">Сотрудник</option>
        </select>
      )}

      <button type="submit">{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
