import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_AUTH}>
    <App />
  </GoogleOAuthProvider>,
)
