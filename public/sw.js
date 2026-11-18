const CACHE_NAME = 'act-suite-v4.47';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css?v=4.47',
  './js/i18n.js?v=4.47',
  './js/state.js?v=4.47',
  './js/subapp-perfil.js?v=4.47',
  './js/subapp-paz-falsa.js?v=4.47',
  './js/subapp-espacio-act.js?v=4.47',
  './js/subapp-radar-patrones.js?v=4.47',
  './js/subapp-brujula-valores.js?v=4.47',
  './js/subapp-pildoras-anclajes.js?v=4.47',
  './js/subapp-insight.js?v=4.47',
  './js/app.js?v=4.47',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE.map((url) => new Request(url, { cache: 'reload' })));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = new URL(event.request.url);
  if (reqUrl.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
