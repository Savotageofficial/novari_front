import { formatPrice, getEffectivePrice, type Product } from '../data/products'

interface ProductPriceProps {
  product: Product
  size?: 'sm' | 'lg'
  showDiscountBadge?: boolean
}

export function ProductPrice({
  product,
  size = 'sm',
  showDiscountBadge = false,
}: ProductPriceProps) {
  const isLarge = size === 'lg'
  const gapClass = isLarge ? 'gap-3' : 'gap-2'

  if (product.discount > 0) {
    return (
      <div className={`flex flex-wrap items-center ${gapClass}`}>
        <span
          className={`font-mono text-cream/80 ${isLarge ? 'text-2xl' : 'text-sm'}`}
        >
          {formatPrice(getEffectivePrice(product))}
        </span>
        <span
          className={`font-mono text-cream/40 line-through ${
            isLarge ? 'text-lg' : 'text-sm'
          }`}
        >
          {formatPrice(product.numericPrice)}
        </span>
        {showDiscountBadge && (
          <span className="bg-gold px-1.5 py-0.5 font-mono text-xs text-obsidian">
            -{product.discount}%
          </span>
        )}
      </div>
    )
  }

  return (
    <span
      className={`font-mono text-cream/80 ${isLarge ? 'text-2xl' : 'text-sm'}`}
    >
      {formatPrice(product.numericPrice)}
    </span>
  )
}
