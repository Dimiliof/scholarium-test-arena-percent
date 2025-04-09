// Service worker για την εφαρμογή EduPercentage PWA

const CACHE_NAME = 'eduPercentage-v7';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/src/index.css',
  '/src/main.tsx',
  '/lovable-uploads/c9f693b7-586d-4d3d-b6c2-c494a723965d.png',
  'https://edupercentage.s3.eu-central-1.amazonaws.com/releases/eduPercentage-latest.apk'
];

// Install event handler with improved error handling
self.addEventListener('install', event => {
  console.log('Εγκατάσταση του Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Άνοιγμα cache');
        // Cache assets one by one to prevent total failure if one asset fails
        return Promise.all(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.error(`Failed to cache ${url}:`, error);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Service worker installation failed:', error);
      })
  );
});

// Activate event with better cleanup logic
self.addEventListener('activate', event => {
  console.log('Ενεργοποίηση του νέου service worker');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Διαγραφή παλιού cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        );
      }),
      self.clients.claim()
    ]).catch(error => {
      console.error('Service worker activation failed:', error);
    })
  );
});

// Improved fetch event handler with better fallback strategy
self.addEventListener('fetch', event => {
  // For navigation requests, try network first, then fall back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              // If there's no cache match, return the offline page
              return caches.match('/');
            })
            .catch(error => {
              console.error('Error serving navigation request:', error);
              // Final fallback
              return new Response('Network and cache both failed. Please try again later.', {
                status: 503,
                headers: {'Content-Type': 'text/plain'}
              });
            });
        })
    );
    return;
  }
  
  // For non-navigation requests (assets, API calls), use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to store it in cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('Failed to cache response:', error);
              });
            
            return response;
          })
          .catch(error => {
            console.error('Network fetch failed:', error);
            // We don't have a fallback for non-navigation requests
          });
      })
  );
});

// Διαχείριση push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Διαχείριση κλικ στις ειδοποιήσεις
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Προσθήκη λειτουργικότητας για περιοδική συγχρονισμό δεδομένων
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(
      // Εδώ θα προσθέταμε κώδικα για συγχρονισμό περιεχομένου
      console.log('Εκτέλεση περιοδικού συγχρονισμού')
    );
  }
});
