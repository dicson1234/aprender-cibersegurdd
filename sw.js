/* CyberLab Offline-First Service Worker */
const CACHE_NAME='cyberlab-v6';
const ASSETS=[
 './','./index.html','./manifest.json',
 './css/variables.css?v=4','./css/main.css?v=4','./css/components.css?v=4',
 './js/storage.js','./js/gamification.js','./js/navigation.js?v=3','./js/dashboard.js','./js/knowledge_map.js','./js/learning_tree.js','./js/labs_engine.js','./js/quizzes_engine.js','./js/spaced_repetition.js','./js/notes_engine.js','./js/resources_engine.js','./js/cybertutor.js','./js/search.js','./js/app.js',
 './data/modules.json','./data/quizzes.json','./data/challenges.json','./data/labs.json','./data/resources.json','./data/glossary.json','./data/tools.json','./data/achievements.json','./data/projects.json','./data/roadmaps.json','./data/cases.json','./data/mitre.json'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));}return r;}).catch(()=>caches.match(e.request).then(r=>r||new Response('Offline: recurso no disponible',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}}))));});
