import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/Auth.css'
import './styles/Global.css'
import './styles/Dashboard.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
          <AuthProvider>

      <App />

      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
