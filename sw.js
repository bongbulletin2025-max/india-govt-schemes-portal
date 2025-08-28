const CACHE = 'schemes-cache-v1';
const ASSETS = [
  './', './index.html', './style.css', './script.js', './manifest.webmanifest',
  './data/states.json', './data/schemes.json',
  './images/leaders/president.jpg', './images/leaders/pm.jpg', './images/cm/default_cm.jpg'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); });
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});const CACHE = 'schemes-cache-v1';
const ASSETS = [
  './', './index.html', './style.css', './script.js', './manifest.webmanifest',
  './data/states.json', './data/schemes.json',
  './images/leaders/president.jpg', './images/leaders/pm.jpg', './images/cm/default_cm.jpg'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); });
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});
