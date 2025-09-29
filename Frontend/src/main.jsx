import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AppProvider from './context/AppProvider.jsx'
import ThemeProvider from './context/ThemeContext.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import 'quill/dist/quill.snow.css'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <AppProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  </ClerkProvider>
  ,
)
