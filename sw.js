self.addEventListener('install', function (e) {
    console.log('Service Worker - Installing', e)
})

self.addEventListener('activate', function (e) {
    console.log('Service Worker - Activating', e)
    return self.clients.claim()
})

// This variable will save the event for later use.
