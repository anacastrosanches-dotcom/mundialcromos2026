// Service Worker v3 — sem cache, sempre fresco
// Resolve o problema de ficheiros JS antigos em cache após deploy

const SW_VERSION = 'v3';

self.addEventListener('install', e => {
  console.log('[SW] Installing', SW_VERSION);
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating', SW_VERSION);
  // Apaga TODOS os caches anteriores
  e.waitUntil(
    caches.keys().then(keys => {
      console.log('[SW] Clearing caches:', keys);
      return Promise.all(keys.map(k => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

// Não faz cache de nada — passa tudo directamente para a rede
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(() => {
      return fetch(e.request);
    })
  );
});
