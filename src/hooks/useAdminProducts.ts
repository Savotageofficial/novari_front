import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from '../api/admin'
import type { AdminProduct } from '../api/products'
import {
  COLOR_OPTIONS,
  mergeColorOptions,
  normalizeHexColor,
  type ColorOption,
} from '../data/colors'
import { useAdminAuth } from './useAdminAuth'

export type { AdminProduct } from '../api/products'

export type SortKey = 'name' | 'numericPrice' | 'inStock' | 'discount'
export type SortDir = 'asc' | 'desc'
export type StockFilter = 'all' | 'in' | 'out'

export type NewAdminProduct = Omit<AdminProduct, 'id' | 'sales'>

function compareProducts(a: AdminProduct, b: AdminProduct, sortKey: SortKey): number {
  switch (sortKey) {
    case 'name':
      return a.name.localeCompare(b.name)
    case 'numericPrice':
      return a.numericPrice - b.numericPrice
    case 'inStock':
      return Number(a.inStock) - Number(b.inStock)
    case 'discount':
      return a.discount - b.discount
    default:
      return 0
  }
}

export interface AdminFilters {
  searchQuery: string
  categoryFilter: string
  stockFilter: StockFilter
  sortKey: SortKey
  sortDir: SortDir
}

export function filterAdminProducts(
  products: AdminProduct[],
  filters: AdminFilters
): AdminProduct[] {
  const { searchQuery, categoryFilter, stockFilter, sortKey, sortDir } = filters
  let result = [...products]

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    result = result.filter((product) => product.name.toLowerCase().includes(query))
  }

  if (categoryFilter !== 'all') {
    result = result.filter((product) => product.category === categoryFilter)
  }

  if (stockFilter !== 'all') {
    result = result.filter((product) =>
      stockFilter === 'in' ? product.inStock : !product.inStock
    )
  }

  result.sort((a, b) => {
    const comparison = compareProducts(a, b, sortKey)
    return sortDir === 'asc' ? comparison : -comparison
  })

  return result
}

export interface UseAdminProductsOptions {
  onCatalogChange?: () => void
}

export function useAdminProducts(options: UseAdminProductsOptions = {}) {
  const { onCatalogChange } = options
  const { token } = useAdminAuth()
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([])
  const [customColors, setCustomColors] = useState<ColorOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())

  const colorOptions = useMemo(
    () => mergeColorOptions(COLOR_OPTIONS, customColors),
    [customColors]
  )

  useEffect(() => {
    if (!token) {
      return
    }

    let cancelled = false

    void fetchAdminProducts(token)
      .then((data) => {
        if (!cancelled) {
          setAdminProducts(data)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load admin products')
          setAdminProducts([])
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const loadProducts = useCallback(() => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    void fetchAdminProducts(token)
      .then((data) => {
        setAdminProducts(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load admin products')
        setAdminProducts([])
        setIsLoading(false)
      })
  }, [token])

  const withSaving = useCallback(
    async (id: string, action: () => Promise<AdminProduct | void>) => {
      setSavingIds((prev) => new Set(prev).add(id))
      try {
        const updated = await action()
        if (updated) {
          setAdminProducts((prev) =>
            prev.map((product) => (product.id === id ? updated : product))
          )
          onCatalogChange?.()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save product')
        throw err
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    },
    [onCatalogChange]
  )

  const updateProduct = useCallback(
    (id: string, updates: Partial<AdminProduct>) => {
      if (!token) return

      setAdminProducts((prev) =>
        prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
      )

      void withSaving(id, () => updateAdminProduct(token, id, updates))
    },
    [token, withSaving]
  )

  const toggleColor = useCallback(
    (id: string, color: ColorOption) => {
      const product = adminProducts.find((entry) => entry.id === id)
      if (!product || !token) return

      const hasColor = product.colors.includes(color.name)
      const colors = hasColor
        ? product.colors.filter((name) => name !== color.name)
        : [...product.colors, color.name]

      updateProduct(id, { colors })
    },
    [adminProducts, token, updateProduct]
  )

  const addColor = useCallback((name: string, hex: string): ColorOption | null => {
    const trimmedName = name.trim()
    const normalizedHex = normalizeHexColor(hex)
    if (!trimmedName || !normalizedHex) return null

    const color: ColorOption = { name: trimmedName, hex: normalizedHex }
    let added: ColorOption | null = null

    setCustomColors((prev) => {
      const existing = mergeColorOptions(COLOR_OPTIONS, prev)
      if (existing.some((entry) => entry.name.toLowerCase() === trimmedName.toLowerCase())) {
        return prev
      }
      added = color
      return [...prev, color]
    })

    return added
  }, [])

  const addProduct = useCallback(
    async (product: NewAdminProduct): Promise<string> => {
      if (!token) throw new Error('Not authenticated')

      const created = await createAdminProduct(token, product)
      setAdminProducts((prev) => [...prev, created])
      onCatalogChange?.()
      return created.id
    },
    [token, onCatalogChange]
  )

  const removeProduct = useCallback(
    async (id: string) => {
      if (!token) return

      await deleteAdminProduct(token, id)
      setAdminProducts((prev) => prev.filter((product) => product.id !== id))
      onCatalogChange?.()
    },
    [token, onCatalogChange]
  )

  const refreshProduct = useCallback(
    async (id: string) => {
      if (!token) return

      try {
        const data = await fetchAdminProducts(token)
        const updated = data.find((product) => product.id === id)
        if (updated) {
          setAdminProducts((prev) =>
            prev.map((product) => (product.id === id ? updated : product))
          )
          onCatalogChange?.()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh product')
      }
    },
    [token, onCatalogChange]
  )

  return {
    adminProducts,
    colorOptions,
    isLoading,
    error,
    savingIds,
    reload: loadProducts,
    updateProduct,
    refreshProduct,
    toggleColor,
    addColor,
    addProduct,
    removeProduct,
  }
}
