const V = 'recall-v1';
const SHELL = ['./', 'index.html', 'style.css', 'engine.js', 'app.js', 'manifest.json',
  'vendor/jszip.min.js', 'vendor/fzstd.js', 'vendor/sql-wasm.js', 'vendor/sql-wasm.wasm',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// stale-while-revalidate: instant/offline from cache, refresh in background for the next open
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
