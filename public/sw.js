const CACHE_NAME = 'khora-v1.2.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/tokens.css?v=1.2.0',
  './css/styles.css?v=1.2.0',
  './css/surfaces.css?v=1.2.0',
  './js/utils.js?v=1.2.0',
  './js/i18n-dict.js?v=1.2.0',
  './js/i18n.js?v=1.2.0',
  './js/state-vault.js?v=1.2.0',
  './js/state.js?v=1.2.0',
  './js/subapp-profile.js?v=1.2.0',
  './js/subapp-false-peace.js?v=1.2.0',
  './js/subapp-act-space.js?v=1.2.0',
  './js/subapp-pattern-radar.js?v=1.2.0',
  './js/subapp-values-compass.js?v=1.2.0',
  './js/subapp-pills-anchors.js?v=1.2.0',
  './js/subapp-insight.js?v=1.2.0',
  './js/app-settings.js?v=1.2.0',
  './js/app-help.js?v=1.2.0',
  './js/app.js?v=1.2.0',
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
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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

  // Versioned static assets (?v=1.2.0): cache-first (immutable per version)
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
