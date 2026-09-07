// Network-first service worker. Correctness matters more than offline support while this app
// is under active development — a cache-first strategy here previously caused returning visitors
// to see permanently stale JS/data even after the site was updated and redeployed.
//
// IMPORTANT: bump CACHE_VERSION any time you ship a real update. Changing this string is what makes
// browsers detect a new service worker, install it, and evict the old cache via the activate handler
// below — without a version bump, a browser that visited once keeps the OLD sw.js (and whatever
// caching behavior it had) indefinitely, regardless of what files you deploy afterward.
const CACHE_VERSION = "bqm-cache-v2";
const ASSETS = [
  "./", "./index.html", "./manifest.json",
  "./css/style.css",
  "./js/app.js", "./js/storage.js",
  "./js/data/topics.js", "./js/data/shortcuts.js", "./js/data/generators.js", "./js/data/mindtricks.js",
  "./data/sources.json", "./data/resources.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    // Network-first: always try to get the freshest copy when online. Only fall back to the
    // cached copy if the network request fails (i.e. genuinely offline).
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then((cache) => cache.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
