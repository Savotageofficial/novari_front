import type { Product } from '../data/products'
import { ProductCard } from './ProductCard'
import { RouterLink } from './primitives'

interface LatestDropsProps {
  products: Product[]
}

export function LatestDrops({ products }: LatestDropsProps) {
  return (
    <section id="collections" className="pt-section lg:pt-section-lg">
      <div className="flex flex-col items-start justify-between gap-2 px-6 pb-6 md:flex-row md:items-center md:px-10">
        <h2 className="font-display text-6xl uppercase tracking-wide text-cream md:text-3xl">
          Latest Drops
        </h2>
        <RouterLink to="/products">View All →</RouterLink>
      </div>

      <div className="grid grid-cols-1 gap-product sm:grid-cols-2 md:gap-product-lg md:px-10 lg:grid-cols-4">
        {products.slice(-4).map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} animate={true} />
        ))}
      </div>
    </section>
  )
}
