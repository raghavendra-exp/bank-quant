// Minimal cache-first service worker so the app (and question bank) works offline after first load.
const CACHE = "bqm-cache-v1";
const ASSETS = [
  "./", "./index.html", "./manifest.json",
  "./css/style.css",
  "./js/app.js", "./js/storage.js",
  "./js/data/topics.js", "./js/data/shortcuts.js", "./js/data/generators.js",
  "./data/sources.json", "./data/resources.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => cached))
  );
});
