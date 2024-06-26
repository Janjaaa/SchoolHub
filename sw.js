self.addEventListener('install', function (e) {
    console.log('Service Worker - Installing', e)
})

self.addEventListener('activate', function (e) {
    console.log('Service Worker - Activating', e)
    return self.clients.claim()
})

caches.open('pwa-assets').then(cache => {
    cache.addAll(['./assets/css/offline.css', 'offline.html'])
})
