import { useContext } from 'react'
import { ProductContext, NOT_PROVIDED } from '../context/productContext'

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === NOT_PROVIDED) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}
