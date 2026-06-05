const CACHE = 'tortiapp-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  // Borra caches viejos
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const url = e.request.url
  // No cachear llamadas a Supabase ni peticiones externas
  if (!url.startsWith(self.location.origin) || url.includes('supabase')) return

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        // Refresca en background; sirve caché inmediatamente si existe
        const fresh = fetch(e.request).then(resp => {
          if (resp.ok && e.request.method === 'GET') cache.put(e.request, resp.clone())
          return resp
        }).catch(() => cached) // sin red → usar caché
        return cached || fresh
      })
    )
  )
})
