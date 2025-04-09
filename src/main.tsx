
import { createRoot } from 'react-dom/client'
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

// Disable service worker registration in development mode
const disableServiceWorkerInDev = () => {
  if (window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovableproject.com')) {
    // Unregister any existing service workers in development
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
          console.log('ServiceWorker unregistered for development');
        }
      });
    }
    return true;
  }
  return false;
};

// Only run service worker in production
const isDevMode = disableServiceWorkerInDev();

// Mount app with optimized rendering
createRoot(document.getElementById("root")!).render(<App />);
