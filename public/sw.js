// Service Worker desactivado — desinstala-se automaticamente
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(self.registration.unregister());
});
});
