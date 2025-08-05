const CACHE = 's2a-v1';
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(['/', 'assets/py2apk.sh']))
));
self.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
));