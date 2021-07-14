'use strict'

console.log('Say hello to your service-worker')

const STATIC_CACHE = "static-cache-v2";
const DATA_CACHE = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "index.html",
    "index.js",
    "db.js",
    "style.css",
    "manifest.webmanifest",
    "icons/icon-192x192.png",
    "icons/icon-512x512.png"
];
  
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});
  
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DATA_CACHE) {
            console.log("Goodbye old cache data", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.cleints.claim())
  );
});
  

self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE).then(cache => {
        return fetch(event.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          }).catch(err => {
            return cache.match(event.request);
          });
        }).catch(err => console.log(err))
      ); return;
    }

  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch (event.request)
    })
  );
});

window.addEventListener('online', checkDatabase);