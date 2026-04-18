// Client-side kill-switch for any stranded service worker on this
// origin. See are-self-docs/src/clientModules/unregisterStaleSW.js for
// the full explanation. Short version: a previous deploy registered a
// SW at /sw.js that has outlived its deploy and intercepts /learn/
// navigations with a cached 404. This module unregisters it on every
// page load as a safety net.

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    })
    .catch(() => {});

  if ('caches' in window) {
    caches
      .keys()
      .then((keys) => {
        for (const key of keys) {
          caches.delete(key).catch(() => {});
        }
      })
      .catch(() => {});
  }
}
