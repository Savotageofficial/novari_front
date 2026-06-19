import { useCallback, useMemo, useState } from 'react'
import {
  applyFilters,
  getAvailableCategories,
  getAvailableColors,
  getPriceBounds,
} from '../lib/productFilters'
import type { Product } from '../data/products'
import type { FilterCriteria, SortOption } from '../lib/productFilters'

export type { SortOption } from '../lib/productFilters'

export function useProductFilters(allProducts: Product[]) {
  const priceBounds = useMemo(() => getPriceBounds(allProducts), [allProducts])

  const [categories, setCategories] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<[number, number]>(() => priceBounds)
  const [sort, setSort] = useState<SortOption>('featured')

  const priceRange: [number, number] = useMemo(() => {
    const [min, max] = priceBounds
    const [low, high] = selectedPriceRange
    return [Math.min(Math.max(low, min), max), Math.min(Math.max(high, min), max)]
  }, [priceBounds, selectedPriceRange])

  const isPriceActive =
    priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1]

  const toggleCategory = useCallback((category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }, [])

  const toggleColor = useCallback((color: string) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    )
  }, [])

  const setPriceMin = useCallback(
    (min: number) => {
      setSelectedPriceRange((prev) => {
        const [, high] = prev
        const nextLow = Math.max(min, priceBounds[0])
        return [nextLow, Math.max(high, nextLow)]
      })
    },
    [priceBounds]
  )

  const setPriceMax = useCallback(
    (max: number) => {
      setSelectedPriceRange((prev) => {
        const [low] = prev
        const nextHigh = Math.min(max, priceBounds[1])
        return [Math.min(low, nextHigh), nextHigh]
      })
    },
    [priceBounds]
  )

  const resetPrice = useCallback(() => {
    setSelectedPriceRange(priceBounds)
  }, [priceBounds])

  const clearFilters = useCallback(() => {
    setCategories([])
    setColors([])
    setSelectedPriceRange(priceBounds)
    setSort('featured')
  }, [priceBounds])

  const criteria: FilterCriteria = useMemo(
    () => ({
      categories,
      colors,
      priceRange,
      isPriceActive,
      sort,
    }),
    [categories, colors, priceRange, isPriceActive, sort]
  )

  const filteredProducts = useMemo(
    () => applyFilters(allProducts, criteria),
    [allProducts, criteria]
  )

  const activeFilterCount =
    categories.length + colors.length + (isPriceActive ? 1 : 0)

  const availableCategories = useMemo(
    () => getAvailableCategories(allProducts),
    [allProducts]
  )

  const availableColors = useMemo(
    () => getAvailableColors(allProducts),
    [allProducts]
  )

  return {
    categories,
    colors,
    priceRange,
    priceBounds,
    isPriceActive,
    sort,
    filteredProducts,
    activeFilterCount,
    availableCategories,
    availableColors,
    toggleCategory,
    toggleColor,
    setPriceMin,
    setPriceMax,
    resetPrice,
    setSort,
    clearFilters,
  }
}
