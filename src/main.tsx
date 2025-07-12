import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryProvider } from './providers/query-provider'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <BrowserRouter>
      <AuthProvider>
    <App />
      </AuthProvider>
    </BrowserRouter>
  </QueryProvider>
);
