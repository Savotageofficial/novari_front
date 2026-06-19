import { Link } from 'react-router'
import { m } from 'framer-motion'
import { Button } from './primitives'
import { ProductPrice } from './ProductPrice'
import { DEFAULT_SIZE } from '../data/sizes'
import { getPrimaryImage } from '../data/products'
import { useCartActions } from '../hooks/useCart'
import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
  index: number
  animate?: boolean
}

function ProductCardContent({ product }: { product: Product }) {
  const { addItem } = useCartActions()
  const hasColors = product.colors.length > 0
  const defaultColor = product.colors[0] ?? ''
  const defaultSize = DEFAULT_SIZE.value
  return <>
      <Link
        to={`/products/${product.id}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`View ${product.name}`}
      />

      <div className="relative overflow-hidden">
        <img
          src={getPrimaryImage(product)}
          alt={product.name}
          loading="lazy"
          className="aspect-square w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-102"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-obsidian/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-mono text-nav uppercase tracking-widest text-cream">
            View Product →
          </span>
        </div>
      </div>

      <div className="relative z-20 flex items-end justify-between gap-4 p-4">
        <div className="font-mono text-sm text-cream">
          <p className="uppercase tracking-wide">
            {product.discount > 0 ?
              <span className="bg-gold px-1.5 py-0.5 font-mono text-xs text-obsidian mr-2">
                -{product.discount}%
              </span> : null}
            {product.name}
          </p>
          <div className="mt-1">
            <ProductPrice product={product} />
          </div>
        </div>

        <Button
          size="icon"
          aria-label={hasColors ? `Quick add ${product.name}` : `Quick add unavailable for ${product.name}`}
          className="shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasColors}
          onClick={() => {
            if (hasColors) {
              addItem({ product, color: defaultColor, size: defaultSize })
            }
          }}
        >
          +
        </Button>
      </div>
  </>
}

export function ProductCard({ product, index, animate = true }: ProductCardProps) {
  return animate ? (
    <m.article
      className="group relative flex flex-col bg-charcoal"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProductCardContent product={product} />
    </m.article>
  ) : (
    <div className="group relative flex flex-col bg-charcoal">
      <ProductCardContent product={product} />
    </div>
  )
}
