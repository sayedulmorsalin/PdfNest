import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx loaded - initializing React');

const container = document.getElementById('root');
if (!container) {
  console.error('Root container not found!');
} else {
  console.log('Root container found, creating React root');
  createRoot(container).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  );
  console.log('React app rendered successfully');
}
