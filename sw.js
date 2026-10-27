const CACHE='line-school-v1';
const ARQUIVOS=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const url=e.request.url;
    if(resp.ok&&(url.startsWith(self.location.origin)||url.includes('fonts.googleapis.com')||url.includes('fonts.gstatic.com'))){
      const copia=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copia));
    }
    return resp;
  }).catch(()=>caches.match('index.html'))));
});
