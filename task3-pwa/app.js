// ---------- 1. Заметки в localStorage ----------
const STORAGE_KEY = 'notes';

const form = document.getElementById('note-form');
const textInput = document.getElementById('note-text');
const list = document.getElementById('notes-list');

// Читаем заметки из localStorage (там хранится строка JSON)
function loadNotes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Сохраняем массив заметок в localStorage
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Отрисовываем список заметок на странице
function renderNotes() {
  const notes = loadNotes();
  list.innerHTML = '';
  if (notes.length === 0) {
    list.innerHTML = '<li>Заметок пока нет</li>';
    return;
  }
  notes.forEach((note) => {
    const li = document.createElement('li');
    const content = document.createElement('div');
    content.textContent = note.text;
    const date = document.createElement('small');
    date.textContent = new Date(note.createdAt).toLocaleString('ru-RU');
    content.appendChild(date);

    const del = document.createElement('button');
    del.textContent = 'Удалить';
    del.onclick = () => {
      saveNotes(loadNotes().filter((n) => n.id !== note.id));
      renderNotes();
    };

    li.append(content, del);
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  if (!text) return;
  const notes = loadNotes();
  notes.unshift({ id: Date.now(), text, createdAt: new Date().toISOString() });
  saveNotes(notes);
  textInput.value = '';
  renderNotes();
});

renderNotes();

// ---------- 2. Индикатор сети ----------
const statusEl = document.getElementById('status');
function updateStatus() {
  statusEl.textContent = navigator.onLine ? 'Онлайн' : 'Офлайн';
  statusEl.classList.toggle('offline', !navigator.onLine);
}
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus();

// ---------- 3. Регистрация Service Worker ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => console.log('Service Worker зарегистрирован:', reg.scope))
      .catch((err) => console.error('Ошибка регистрации Service Worker:', err));
  });
}
