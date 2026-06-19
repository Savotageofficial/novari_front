import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchProducts } from '../api/products'
import type { Product } from '../data/products'
import { ProductContext } from './productContext'

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reloadToken = useRef(0)

  useEffect(() => {
    let cancelled = false
    const token = ++reloadToken.current

    void fetchProducts()
      .then((data) => {
        if (!cancelled && token === reloadToken.current) {
          setProducts(data)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled && token === reloadToken.current) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
          setProducts([])
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const loadProducts = useCallback(() => {
    const token = ++reloadToken.current
    setIsLoading(true)
    setError(null)

    void fetchProducts()
      .then((data) => {
        if (token === reloadToken.current) {
          setProducts(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (token === reloadToken.current) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
          setProducts([])
          setIsLoading(false)
        }
      })
  }, [])

  const getProductById = useCallback(
    (id: string | undefined) => {
      if (!id) return undefined
      const normalized = id.padStart(2, '0')
      return products.find(
        (product) => product.id === id || product.id === normalized
      )
    },
    [products]
  )

  const value = useMemo(
    () => ({
      products,
      isLoading,
      error,
      reload: loadProducts,
      getProductById,
    }),
    [products, isLoading, error, loadProducts, getProductById]
  )

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}
