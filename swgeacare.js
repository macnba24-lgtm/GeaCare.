const V='geacare-v4';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Rete prima (arrivano gli aggiornamenti); se la rete manca o il sito non esiste più (risposta non valida) si usa la copia salvata sul telefono
const fromCache=r=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):Response.error()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}return fromCache(r).then(m=>m.type==='error'?res:m)}).catch(()=>fromCache(r)))});
