import { useId } from 'react'
import { formatPrice } from '../../data/products'
import type { AdminProduct } from '../../hooks/useAdminProducts'

interface AdminPricingFieldsProps {
  productId: string
  numericPrice: number
  discount: number
  onUpdate: (updates: Partial<AdminProduct>) => void
}

export function AdminPricingFields({
  productId,
  numericPrice,
  discount,
  onUpdate,
}: AdminPricingFieldsProps) {
  const baseId = useId()
  const priceId = `price-${productId}-${baseId}`
  const discountId = `discount-${productId}-${baseId}`
  const discountedPrice = Math.round(numericPrice * (1 - discount / 100))

  return (
    <fieldset className="space-y-4">
      <legend className="font-mono text-nav uppercase tracking-widest text-gold">
        Pricing
      </legend>
      <div className="space-y-4">
        <div>
          <label
            htmlFor={priceId}
            className="block font-mono text-sm text-cream/80"
          >
            Price (EGP)
          </label>
          <input
            id={priceId}
            type="number"
            min={0}
            step={10}
            value={numericPrice}
            onChange={(e) =>
              onUpdate({ numericPrice: Math.max(0, Number(e.target.value)) })
            }
            className="mt-2 h-12 w-full border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor={discountId}
            className="block font-mono text-sm text-cream/80"
          >
            Discount (%)
          </label>
          <input
            id={discountId}
            type="number"
            min={0}
            max={100}
            step={5}
            value={discount}
            onChange={(e) =>
              onUpdate({
                discount: Math.min(100, Math.max(0, Number(e.target.value))),
              })
            }
            className="mt-2 h-12 w-full border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none"
          />
          {discount > 0 && (
            <p className="mt-2 font-mono text-sm text-gold">
              Sale price: {formatPrice(discountedPrice)}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  )
}
