const staticAssets = [
  '/',
  '/styles.css',
  '/app.js',
  '/images/fetch-dog.jpg',
  '/fallback.json'
]

console.log('test')

self.addEventListener('install', async event => {
  const cache = await caches.open('news-static')
  cache.addAll(staticAssets)
})

self.addEventListener('fetch', event => {
  const req = event.request
  const url = new URL(req.url)
  console.log(url.origin)
  console.log(location.origin)

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req))
  } else {
    event.respondWith(networkFirst(req))
  }
})

async function cacheFirst(req) {
  try {
    return await caches.match(req)
  } catch (error) {
    return fetch(req)
  }
}

async function networkFirst(req) {
  const cache = await caches.open('news-dynamic')

  try {
    const networkResponse = await fetch(req)
    cache.put(req, networkResponse.clone())
    return networkResponse
  } catch (error) {
    const cacheResponse = await cache.match(req)
    return cacheResponse || (await caches.match('./fallback.json'))
  }
}
