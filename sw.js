/* CyberLab Offline Cache Service Worker */

const CACHE_NAME = 'cyberlab-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css',
  './css/main.css',
  './css/components.css',
  './js/storage.js',
  './js/gamification.js',
  './js/navigation.js',
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
  './js/app.js',
  './data/modules.json',
  './data/quizzes.json',
  './data/challenges.json',
  './data/labs.json',
  './data/resources.json',
  './data/glossary.json',
  './data/tools.json',
  './data/achievements.json',
  './data/projects.json',
  './data/roadmaps.json',
  './data/cases.json',
  './data/mitre.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
