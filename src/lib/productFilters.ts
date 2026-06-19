import type { Product } from '../data/products'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export interface FilterCriteria {
  categories: string[]
  colors: string[]
  priceRange: [number, number]
  isPriceActive: boolean
  sort: SortOption
}

export function getPriceBounds(products: Product[]): [number, number] {
  if (products.length === 0) return [0, 0]
  const prices = products.map((product) => product.numericPrice)
  return [Math.min(...prices), Math.max(...prices)]
}

export function getAvailableCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((product) => product.category))).sort()
}

export function getAvailableColors(products: Product[]): string[] {
  return Array.from(new Set(products.flatMap((product) => product.colors))).sort()
}

function matchesFilters(product: Product, criteria: FilterCriteria): boolean {
  if (
    criteria.categories.length > 0 &&
    !criteria.categories.includes(product.category)
  ) {
    return false
  }

  if (
    criteria.colors.length > 0 &&
    !product.colors.some((color) => criteria.colors.includes(color))
  ) {
    return false
  }

  if (
    criteria.isPriceActive &&
    (product.numericPrice < criteria.priceRange[0] ||
      product.numericPrice > criteria.priceRange[1])
  ) {
    return false
  }

  return true
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const result = [...products]

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.numericPrice - b.numericPrice)
      break
    case 'price-desc':
      result.sort((a, b) => b.numericPrice - a.numericPrice)
      break
    case 'newest':
      result.sort((a, b) => Number(b.id) - Number(a.id))
      break
    default:
      break
  }

  return result
}

export function applyFilters(
  products: Product[],
  criteria: FilterCriteria
): Product[] {
  const filtered = products.filter((product) => matchesFilters(product, criteria))
  return sortProducts(filtered, criteria.sort)
}
