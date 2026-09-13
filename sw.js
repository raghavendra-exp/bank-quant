// Network-first service worker with full offline asset caching
const CACHE_VERSION = "bqm-cache-v4";
const ASSETS = [
  "./", "./index.html", "./manifest.json", "./icon.svg",
  "./css/style.css", "./css/calculator.css",
  "./js/app.js", "./js/storage.js", "./js/calculator.js",
  "./js/data/topics.js", "./js/data/shortcuts.js", "./js/data/generators.js", "./js/data/mindtricks.js",
  "./data/sources.json", "./data/resources.json",
  "./data/exams/sbi-clerk.json", "./data/exams/ibps-clerk.json", "./data/exams/rrb-office-assistant.json"
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
