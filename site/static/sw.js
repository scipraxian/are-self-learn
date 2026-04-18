// Kill-switch service worker. See are-self-docs/static/sw.js for the
// full explanation. Short version: a previous deploy registered a SW
// at this path; this one unregisters it and clears caches so
// navigations stop being intercepted.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
    try {
      const clientList = await self.clients.matchAll({ type: 'window' });
      for (const client of clientList) {
        client.navigate(client.url).catch(() => {});
      }
    } catch (_) {}
  })());
});
