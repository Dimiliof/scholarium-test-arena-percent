
// Service worker για την εφαρμογή EduPercentage PWA

const CACHE_NAME = 'eduPercentage-v8';
const OFFLINE_URL = '/index.html';

// Βελτιωμένη λίστα αρχείων προς αποθήκευση στην cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/favicon.ico',
  '/src/index.css'
];

// Install event handler with improved error handling
self.addEventListener('install', event => {
  console.log('Εγκατάσταση του Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Άνοιγμα cache');
        // Αποθήκευση μόνο των βασικών αρχείων για offline λειτουργία
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Βασικά αρχεία αποθηκεύτηκαν στην cache');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service worker installation failed:', error);
      })
  );
});

// Άμεση ενεργοποίηση του service worker
self.addEventListener('activate', event => {
  console.log('Ενεργοποίηση του νέου service worker');
  
  // Διαγραφή παλαιών caches για να αποφύγουμε προβλήματα χώρου
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Διαγραφή παλιού cache:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log('Ο service worker ανέλαβε τον έλεγχο');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service worker activation failed:', error);
      })
  );
});

// Απλουστευμένος χειρισμός αιτημάτων - "network-first" στρατηγική
self.addEventListener('fetch', event => {
  // Παράκαμψη αιτημάτων που δεν πρέπει να διαχειριστεί ο service worker
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('/api/') || 
    event.request.url.includes('/admin/') ||
    event.request.url.startsWith('chrome-extension://') ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // Διαχείριση περιηγητικών αιτημάτων
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Σε περίπτωση αποτυχίας επιστροφή του offline σελίδας
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Για τα στατικά περιουσιακά στοιχεία, χρησιμοποιούμε στρατηγική "network first"
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Αποθήκευση στην cache για μελλοντική χρήση
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Σε περίπτωση αποτυχίας, προσπάθησε να επιστρέψεις από την cache
        return caches.match(event.request);
      })
  );
});

// Διαχείριση push notifications
self.addEventListener('push', event => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'Νέα ειδοποίηση',
        icon: '/logo.png',
        badge: '/logo.png',
        data: {
          url: data.url || '/'
        }
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'EduPercentage', options)
      );
    } catch (error) {
      console.error('Σφάλμα στη διαχείριση push notification:', error);
    }
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

// Απλός έλεγχος ζωτικότητας του service worker
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PING') {
    event.ports[0].postMessage({
      type: 'PONG',
      status: 'Service worker is running',
      version: CACHE_NAME
    });
  }
});
