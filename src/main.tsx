
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Preconnect to origin for faster loading
const linkPreconnect = document.createElement('link');
linkPreconnect.rel = 'preconnect';
linkPreconnect.href = window.location.origin;
document.head.appendChild(linkPreconnect);

// Add Open Graph meta data for better sharing
const updateMetaTags = () => {
  // Update title tag if needed
  document.title = "EduPercentage Εκπαιδευτική Πλατφόρμα Προσομοιώσεων και Test";
  
  // Ensure Open Graph meta tags are updated
  const ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (ogTitleMeta) {
    ogTitleMeta.setAttribute('content', 'EduPercentage Εκπαιδευτική Πλατφόρμα Προσομοιώσεων και Test');
  }
  
  // Ensure Twitter meta tags are updated
  const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitleMeta) {
    twitterTitleMeta.setAttribute('content', 'EduPercentage Εκπαιδευτική Πλατφόρμα Προσομοιώσεων και Test');
  }
};

// Update meta tags on app initialization
updateMetaTags();

// Determine if we're in development mode - Βελτιωμένος έλεγχος
const isDevMode = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname.includes('lovableproject.com');
};

// Βελτιωμένο χειρισμό του service worker
const handleServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      if (isDevMode()) {
        // Unregister any existing service workers in development
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
          console.log('ServiceWorker unregistered for development');
        }
      } else {
        // Χειρισμός για παραγωγή - Καθυστερημένη εγγραφή
        window.addEventListener('load', () => {
          // Καθυστέρηση για να επιτρέψουμε στην εφαρμογή να φορτώσει πρώτα
          setTimeout(() => {
            navigator.serviceWorker.register('/service-worker.js', { 
              scope: '/' 
            })
            .then(registration => {
              console.log('ServiceWorker registered successfully:', registration.scope);
            })
            .catch(error => {
              console.error('ServiceWorker registration failed:', error);
            });
          }, 5000); // Καθυστέρηση 5 δευτερολέπτων
        });
      }
    } catch (error) {
      console.error('Error handling service worker:', error);
    }
  }
};

// Handle service worker based on environment
handleServiceWorker();

// Mount app with routing
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
