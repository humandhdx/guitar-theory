// 离线缓存 Service Worker（PWA 支持，手机添加到主屏幕后可脱机秒开）
const CACHE_NAME = "guitar-theory-pwa-v4";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/style.css",
  "./assets/data-resources.js",
  "./assets/data-modules.js",
  "./assets/data-questions.js",
  "./assets/data-songs.js",
  "./assets/data-method.js",
  "./assets/data-reading.js",
  "./assets/data-reading-ext.js",
  "./assets/data-week.js",
  "./assets/data-local-hub.js",
  "./lessons/manifest.js",
  "./assets/music.js",
  "./assets/core.js",
  "./assets/page-today.js",
  "./assets/page-week.js",
  "./assets/page-roadmap.js",
  "./assets/page-practice.js",
  "./assets/page-notes.js",
  "./assets/page-fretboard.js",
  "./assets/page-ear.js",
  "./assets/app.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const net = fetch(e.request).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
