/* CyberLab Offline-First Service Worker */
const CACHE_NAME = 'cyberlab-v20-mobile-touch-glosario-fix-v10';
const ASSETS = [
  './','./index.html?v=10','./manifest.json','./icon.svg',
  './css/variables.css?v=10','./css/main.css?v=10','./css/components.css?v=10','./css/mobile.css?v=10','./css/mobile-polish.css?v=10',
  './js/accounts.js?v=10','./js/storage.js?v=10','./js/account_bootstrap.js?v=10','./js/gamification.js?v=10','./js/navigation.js?v=10','./js/dashboard.js?v=10','./js/knowledge_map.js?v=10','./js/learning_tree.js?v=10','./js/recorrido_engine.js?v=10','./js/cybertutor_assistant.js?v=10','./js/onboarding.js?v=10','./js/labs_engine.js?v=10','./js/quizzes_engine.js?v=10','./js/spaced_repetition.js?v=10','./js/notes_engine.js?v=10','./js/resources_engine.js?v=10','./js/cybertutor.js?v=10','./js/search.js?v=10','./js/app.js?v=10','./js/profile_accounts.js?v=10','./js/mobile_ui.js?v=10','./js/mobile_polish.js?v=10',
  './data/modules.json','./data/quizzes.json','./data/challenges.json','./data/labs.json','./data/resources.json','./data/glossary.json','./data/tools.json','./data/achievements.json','./data/projects.json','./data/roadmaps.json','./data/cases.json','./data/mitre.json'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const requestUrl=new URL(event.request.url);event.respondWith(fetch(event.request).then(response=>{if(response.ok&&requestUrl.origin===self.location.origin){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});}return response;}).catch(()=>caches.match(event.request).then(response=>response||new Response('Offline: recurso no disponible',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}}))));});
