self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open('sch-static-v2');
    await cache.addAll([
      '/',
      '/offline.html',
      '/manifest.webmanifest',
      '/icons/icon-192.png',
      '/icons/icon-512.png'
    ]);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set(['sch-static-v2', 'sch-assets-v2']);
    const names = await caches.keys();
    await Promise.all(names.map(n => keep.has(n) ? undefined : caches.delete(n)));
    await self.clients.claim();
  })());
});

function isHtmlRequest(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

function isImmutableAsset(url) {
  return /\.(?:css|js|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Network-first for documents (navigation)
  if (isHtmlRequest(req)) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open('sch-static-v2');
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || caches.match('/offline.html');
      }
    })());
    return;
  }

  // Cache-first or SWR for immutable static assets
  if (isImmutableAsset(url)) {
    event.respondWith((async () => {
      const cache = await caches.open('sch-assets-v2');
      const hit = await cache.match(req);
      if (hit) {
        // SWR: update in background
        event.waitUntil((async () => {
          try {
            const fresh = await fetch(req);
            await cache.put(req, fresh.clone());
          } catch {}
        })());
        return hit;
      }
      try {
        const net = await fetch(req);
        await cache.put(req, net.clone());
        return net;
      } catch {
        return Response.error();
      }
    })());
    return;
  }

  // Default: pass-through with small cache
  event.respondWith((async () => {
    try {
      return await fetch(req);
    } catch {
      return caches.match(req) || Response.error();
    }
  })());
});

// Warm caches after activation using prerender manifest
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'WARM_CACHE') {
    event.waitUntil((async () => {
      try {
        const res = await fetch('/prerender-manifest.json', { cache: 'no-cache' });
        const manifest = await res.json();
        const urls = (manifest && manifest.urls) || [];
        const cache = await caches.open('sch-static-v2');
        for (const u of urls) {
          try {
            const r = await fetch(u);
            await cache.put(u, r.clone());
          } catch {}
        }
      } catch {}
    })());
  }
});


