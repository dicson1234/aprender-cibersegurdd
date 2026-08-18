/* CyberLab Offline-First Service Worker */
const CACHE_NAME = 'cyberlab-v14-reward-hardening';
const ASSETS = [
  './','./index.html','./manifest.json','./icon.svg',
  './css/variables.css?v=5','./css/main.css?v=5','./css/components.css?v=5','./css/mobile.css?v=5','./css/mobile-polish.css?v=2',
  './js/accounts.js','./js/storage.js','./js/account_bootstrap.js','./js/gamification.js','./js/navigation.js?v=5','./js/dashboard.js','./js/knowledge_map.js','./js/learning_tree.js','./js/recorrido_engine.js','./js/cybertutor_assistant.js','./js/onboarding.js','./js/labs_engine.js','./js/quizzes_engine.js','./js/spaced_repetition.js','./js/notes_engine.js','./js/resources_engine.js','./js/cybertutor.js','./js/search.js','./js/app.js','./js/profile_accounts.js','./js/mobile_ui.js?v=3','./js/mobile_polish.js?v=2',
  './data/modules.json','./data/quizzes.json','./data/challenges.json','./data/labs.json','./data/resources.json','./data/glossary.json','./data/tools.json','./data/achievements.json','./data/projects.json','./data/roadmaps.json','./data/cases.json','./data/mitre.json'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const requestUrl=new URL(event.request.url);event.respondWith(fetch(event.request).then(response=>{if(response.ok&&requestUrl.origin===self.location.origin){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});}return response;}).catch(()=>caches.match(event.request).then(response=>response||new Response('Offline: recurso no disponible',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}}))));});
