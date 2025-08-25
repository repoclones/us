/* Full-offline PWA service worker (Cloudflare Pages-ready) */
const VERSION = 'v1.0.0-bbe3a313';
const APP_CACHE = `full-offline-cache-${VERSION}`;

// All files precached (generated at build time)
const PRECACHE_URLS = [
  "intro.png",
  "luck-1.png",
  "luck-2.png",
  "luck-3.png",
  "luck-4.png",
  "luck-5.png",
  "luck-6.png",
  "speed.gif", 
  "index.html",
  "manifest.json",
  "android/android-launchericon-512-512.png",
  "android/android-launchericon-192-192.png",
  "styles.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);
      for (const url of PRECACHE_URLS) {
        try {
          await cache.add(url);
          console.log("Cached:", url);
        } catch (err) {
          console.error("❌ Failed to cache:", url, err);
        }
      }
    })()
  );
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
        return caches.match('index.html');
      }
      throw err;
    }
  })());
});
