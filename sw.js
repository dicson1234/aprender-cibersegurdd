/* CyberLab Network-First Service Worker */

const CACHE_NAME = 'cyberlab-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css?v=3',
  './css/main.css?v=3',
  './css/components.css?v=3',
  './js/storage.js',
  './js/gamification.js',
  './js/navigation.js?v=3',
  './js/dashboard.js',
  './js/knowledge_map.js',
  './js/learning_tree.js',
  './js/labs_engine.js',
  './js/quizzes_engine.js',
  './js/spaced_repetition.js',
  './js/notes_engine.js',
  './js/resources_engine.js',
  './js/cybertutor.js',
  './js/search.js',
  './js/app.js'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Purging old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First Strategy: always fetch fresh version online, fallback to cache offline
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
