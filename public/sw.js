const CACHE_NAME = 'khora-v3.1.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css?v=3.1.0',
  './js/i18n.js?v=3.1.0',
  './js/state.js?v=3.1.0',
  './js/subapp-perfil.js?v=3.1.0',
  './js/subapp-paz-falsa.js?v=3.1.0',
  './js/subapp-espacio-act.js?v=3.1.0',
  './js/subapp-radar-patrones.js?v=3.1.0',
  './js/subapp-brujula-valores.js?v=3.1.0',
  './js/subapp-pildoras-anclajes.js?v=3.1.0',
  './js/subapp-insight.js?v=3.1.0',
  './js/app.js?v=3.1.0',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
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

function cacheResponse(request, response) {
  if (response && response.status === 200 && response.type === 'basic') {
    const cloned = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, cloned);
    });
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;
  if (reqUrl.pathname.startsWith('/api/')) return;

  // HTML navigations: network-first with offline fallback to cached shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => cacheResponse(event.request, networkResponse))
        .catch(async () => {
          const cached = (await caches.match(event.request)) || (await caches.match('./index.html'));
          return cached || Response.error();
        })
    );
    return;
  }

  // Versioned static assets (?v=3.1.0): cache-first (immutable per version)
  if (reqUrl.searchParams.has('v')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then((networkResponse) => cacheResponse(event.request, networkResponse))
          .catch(() => Response.error());
      })
    );
    return;
  }

  // Unversioned same-origin static assets (icons, manifest, etc.): stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => cacheResponse(event.request, networkResponse))
        .catch(() => cachedResponse || Response.error());

      return cachedResponse || networkFetch;
    })
  );
});
