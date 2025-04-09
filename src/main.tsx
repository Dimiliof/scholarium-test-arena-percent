
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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

// Mount app with optimized rendering
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Render with proper StrictMode wrapping
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
