const C='trainingslog-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(fetch(e.request).then(r=>{if(same&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||(same&&e.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
