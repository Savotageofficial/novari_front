import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MotionProvider } from './components/MotionProvider.tsx'
import { CartProvider } from './context/CartProvider.tsx'
import { AdminAuthProvider } from './context/AdminAuthProvider.tsx'
import { ProductProvider } from './context/ProductProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <ProductProvider>
        <CartProvider>
          <AdminAuthProvider>
            <App />
          </AdminAuthProvider>
        </CartProvider>
      </ProductProvider>
    </MotionProvider>
  </StrictMode>,
)
