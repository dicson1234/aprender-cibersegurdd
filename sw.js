/* CyberLab Offline-First Service Worker v13 */
const CACHE_NAME = 'cyberlab-v25-resilient-v13';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './css/variables.css',
  './css/main.css',
  './css/components.css',
  './css/mobile.css',
  './css/mobile-polish.css',
  './js/accounts.js',
  './js/storage.js',
  './js/account_bootstrap.js',
  './js/gamification.js',
  './js/navigation.js',
  './js/dashboard.js',
  './js/knowledge_map.js',
  './js/learning_tree.js',
  './js/recorrido_engine.js',
  './js/cybertutor_assistant.js',
  './js/onboarding.js',
  './js/labs_engine.js',
  './js/quizzes_engine.js',
  './js/spaced_repetition.js',
  './js/notes_engine.js',
  './js/resources_engine.js',
  './js/cybertutor.js',
  './js/search.js',
  './js/app.js',
  './js/profile_accounts.js',
  './js/mobile_ui.js',
  './js/mobile_polish.js',
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

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(url.pathname, copy).catch(() => {});
          });
        }
        return response;
      })
      .catch(async () => {
        // Match ignoring query parameters so ?v=X always resolves correctly
        const match = await caches.match(event.request, { ignoreSearch: true });
        if (match) return match;

        const cleanMatch = await caches.match(url.pathname, { ignoreSearch: true });
        if (cleanMatch) return cleanMatch;

        if (event.request.headers.get('accept')?.includes('text/html')) {
          return (await caches.match('./index.html', { ignoreSearch: true })) || (await caches.match('./', { ignoreSearch: true }));
        }

        // Avoid returning plain text for JS/CSS files to prevent SyntaxError
        if (url.pathname.endsWith('.js')) {
          return new Response('/* offline fallback */', { headers: { 'Content-Type': 'application/javascript' } });
        }
        if (url.pathname.endsWith('.css')) {
          return new Response('/* offline fallback */', { headers: { 'Content-Type': 'text/css' } });
        }

        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      })
  );
});
