import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { TripProvider } from './context/TripContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <FavoritesProvider>
        <TripProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TripProvider>
      </FavoritesProvider>
    </UserProvider>
  </StrictMode>,
)
