// Service Worker — скрипт, который браузер запускает в фоне, отдельно от страницы.
// Он перехватывает запросы страницы и может отдавать ответы из кэша.

const CACHE_NAME = 'notes-cache-v1';

// Статические файлы, которые нужны для работы приложения без сети
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// install — срабатывает при первой установке SW: кладём файлы в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // сразу активируем новую версию
});

// activate — удаляем старые версии кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim(); // начинаем управлять открытыми страницами
});

// fetch — перехватываем каждый запрос страницы.
// Стратегия "сначала кэш": если файл есть в кэше — отдаём его, иначе идём в сеть.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
