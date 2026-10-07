# Задание №3 — Заметки (PWA)

Веб-приложение для заметок, которое работает **без интернета** и **устанавливается** как приложение.
Без фреймворков: HTML, CSS, JavaScript.

## Структура

```
task3-pwa/
├── index.html     — страница; подключает manifest.json, style.css, app.js
├── style.css      — стили
├── app.js         — заметки в localStorage + регистрация Service Worker
├── sw.js          — Service Worker: кэширование и работа офлайн
├── manifest.json  — Web App Manifest (название, иконки, цвета)
├── icons/         — иконки 192×192 и 512×512
└── server.js      — простой сервер для запуска (без зависимостей)
```

## Запуск

```bash
cd task3-pwa
node server.js
```
Открыть http://localhost:8080 в **Chrome** или **Edge**.

> Нельзя открывать `index.html` двойным кликом: Service Worker работает только через `http://localhost` или `https`.

## Что показать на защите

1. **Работа с сетью:** добавить пару заметок, обновить страницу — они остались (хранятся в `localStorage`).
2. **Service Worker:** F12 → **Application** → **Service Workers** → виден `sw.js`, статус *activated and is running*.
3. **Кэш:** F12 → **Application** → **Cache Storage** → `notes-cache-v1` → список файлов (`index.html`, `app.js`, `style.css`, иконки...).
4. **Manifest:** F12 → **Application** → **Manifest** → видны name, short_name, start_url, display, цвета и иконки.
5. **Установка:** значок установки ⊕ справа в адресной строке (или меню ⋮ → «Установить приложение») → приложение открывается в отдельном окне.
6. **Офлайн:** F12 → **Network** → в списке *No throttling* выбрать **Offline** (или галочка Offline во вкладке Service Workers) → обновить страницу:
   - страница открылась, в шапке — «Офлайн»;
   - старые заметки на месте;
   - новая заметка добавляется.

> Если после изменения кода видна старая версия: Application → Service Workers → **Unregister**, затем Application → Storage → **Clear site data** и обновить страницу.
