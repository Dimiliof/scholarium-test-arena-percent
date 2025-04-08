
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preconnect to origin for faster loading
const linkPreconnect = document.createElement('link');
linkPreconnect.rel = 'preconnect';
linkPreconnect.href = window.location.origin;
document.head.appendChild(linkPreconnect);

// Mount app with optimized rendering
createRoot(document.getElementById("root")!).render(<App />);
