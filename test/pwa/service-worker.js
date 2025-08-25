/* Full-offline PWA service worker (Cloudflare Pages-ready) */
const VERSION = 'v1.0.0-bbe3a313';
const APP_CACHE = `full-offline-cache-${VERSION}`;

// All files precached (generated at build time)
const PRECACHE_URLS = [
  "/README.md",
  "/_headers",
  "/about.html",
  "/assets/css/styles.css",
  "/assets/images/logo.png",
  "/assets/js/app.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/index.html",
  "/manifest.json",
  "/offline.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== APP_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Cache-first for everything (full offline), with network fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      const cache = await caches.open(APP_CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      if (req.mode === 'navigate') {
        return caches.match('/offline.html');
      }
      throw err;
    }
  })());
});
