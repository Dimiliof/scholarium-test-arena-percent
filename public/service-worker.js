
// Service worker για την εφαρμογή EduPercentage PWA

const CACHE_NAME = 'eduPercentage-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/src/index.css',
  '/src/main.tsx'
];

// Εγκατάσταση Service Worker
self.addEventListener('install', event => {
  console.log('Εγκατάσταση του Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Άνοιγμα cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Διασφαλίζει ότι ο νέος worker παίρνει τον έλεγχο αμέσως
  );
});

// Φόρτωση από την cache ή το δίκτυο
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - επιστροφή απάντησης
        if (response) {
          return response;
        }
        
        // Αντιγραφή του αιτήματος επειδή είναι μιας χρήσης
        return fetch(event.request).then(
          response => {
            // Έλεγχος αν λάβαμε έγκυρη απάντηση
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Αντιγραφή της απάντησης για να την αποθηκεύσουμε στην cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Ενεργοποίηση και εκκαθάριση παλαιών caches
self.addEventListener('activate', event => {
  console.log('Ενεργοποίηση του νέου service worker');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Διαγραφή παλιού cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Παίρνει τον έλεγχο αμέσως σε όλα τα ανοιχτά παράθυρα
  );
});
