importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

const staticAssets = [
  './',
  './styles.css',
  './app.js',
  './images/fetch-dog.jpg',
  './fallback.json'
]

workbox.precaching.precacheAndRoute(staticAssets)

workbox.routing.registerRoute(
  new RegExp('^' + 'https://newsapi.org/', 'i'),
  new workbox.strategies.NetworkFirst()
)

workbox.routing.registerRoute(
  /.*\.(png|gif|jpg|jpeg|svg)/,
  new workbox.strategies.CacheFirst({
    cacheName: 'news-images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60 // 1 Day
      })
    ]
  })
)

workbox.routing.setCatchHandler(() => {
  return caches.match('./fallback.json')
})
