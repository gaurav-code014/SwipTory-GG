self.addEventListener('install', (event) => {
    event.waitUntil(
       caches.open('my-app-cache').then((cache) => {
         return cache.addAll([
           '/',
           '/index.html',
           '/logo.jpeg',
           '/manifest.json',
         ]);
       })
    );
   });
   
   self.addEventListener('fetch', (event) => {
    event.respondWith(
       caches.match(event.request).then((response) => {
         return response || fetch(event.request);
       })
    );
   });
   