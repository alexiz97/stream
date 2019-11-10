var cacheName = 'bialpak-pwa';
var filesToCache = [
  '/',
  'login_client.html',
  'js/login_client.js',
  'js/bootstrap.min.js',
  'stylesheets/style.css',
  'stylesheets/bootstrap.min.css',
  'stylesheets/login.css',
  'images/logo.png',
  ''
];
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});