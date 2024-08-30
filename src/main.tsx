import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={'788410865551-2fvjl8mruse91varv32umahhvsr77ort.apps.googleusercontent.com'}>
    <App />
  </GoogleOAuthProvider>,
)
