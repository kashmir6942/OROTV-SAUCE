const CACHE_NAME = 'lantaw-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/home.css',
  '/js/home.js',
  '/lantaw.png',
  '/manifest.json'
];

// Install - cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests and API calls
  if (event.request.method !== 'GET') return;

  // For API calls (TMDB, embeds) - network only, don't cache
  const url = new URL(event.request.url);
  if (
    url.hostname.includes('themoviedb.org') ||
    url.hostname.includes('tmdb.org') ||
    url.hostname.includes('vidsrc') ||
    url.hostname.includes('videasy') ||
    url.hostname.includes('2embed') ||
    url.hostname.includes('autoembed') ||
    url.hostname.includes('smashy') ||
    url.hostname.includes('multiembed')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});
