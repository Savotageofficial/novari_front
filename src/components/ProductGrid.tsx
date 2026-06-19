import type { Product } from '../data/products'
import { Button } from './primitives'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onClearFilters: () => void
  animate?: boolean
  columns?: 3 | 4
}

export function ProductGrid({
  products,
  onClearFilters,
  animate = false,
  columns = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-mono text-2xl uppercase tracking-wide text-cream">
          No products match
        </p>
        <p className="mt-2 max-w-xs font-mono text-sm text-cream/60">
          Try adjusting your filters to find what you are looking for.
        </p>
        <Button className="mt-6" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      </div>
    )
  }

  return (
    <div
      className={
        columns === 3
          ? 'grid grid-cols-1 gap-product sm:grid-cols-2 lg:grid-cols-3'
          : 'grid grid-cols-1 gap-product sm:grid-cols-2 lg:grid-cols-4'
      }
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          animate={animate}
        />
      ))}
    </div>
  )
}
