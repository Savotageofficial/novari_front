import { useId } from 'react'
import type { AdminProduct } from '../../hooks/useAdminProducts'

interface AdminInventoryFieldsProps {
  productId: string
  inStock: boolean
  stockCount: number
  onUpdate: (updates: Partial<AdminProduct>) => void
}

export function AdminInventoryFields({
  productId,
  inStock,
  stockCount,
  onUpdate,
}: AdminInventoryFieldsProps) {
  const baseId = useId()
  const statusId = `stock-status-${productId}-${baseId}`
  const countId = `stock-${productId}-${baseId}`

  return (
    <fieldset className="space-y-4">
      <legend className="font-mono text-nav uppercase tracking-widest text-gold">
        Inventory
      </legend>
      <div className="space-y-4">
        <div>
          <label
            htmlFor={statusId}
            className="block font-mono text-sm text-cream/80"
          >
            Stock Status
          </label>
          <label
            htmlFor={statusId}
            className="mt-2 flex h-12 cursor-pointer items-center justify-between border border-cream/20 bg-obsidian px-4 transition-colors duration-300 focus-within:ring-2 focus-within:ring-gold"
          >
            <span className="font-mono text-sm text-cream/80">
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span
              className={`relative inline-flex h-6 w-11 border transition-colors duration-300 ${
                inStock ? 'border-gold bg-gold' : 'border-cream/40 bg-obsidian'
              }`}
            >
              <input
                id={statusId}
                type="checkbox"
                className="sr-only"
                checked={inStock}
                onChange={(e) => onUpdate({ inStock: e.target.checked })}
              />
              <span
                className={`absolute top-0.5 h-4 w-5 bg-cream transition-transform duration-300 ${
                  inStock ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </span>
          </label>
        </div>
        <div>
          <label
            htmlFor={countId}
            className="block font-mono text-sm text-cream/80"
          >
            Stock Count
          </label>
          <input
            id={countId}
            type="number"
            min={0}
            value={stockCount}
            onChange={(e) =>
              onUpdate({ stockCount: Math.max(0, Number(e.target.value)) })
            }
            className="mt-2 h-12 w-full border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none"
          />
        </div>
      </div>
      <p className="font-mono text-sm text-cream/60">
        Status:{" "}
        <span className={inStock ? 'text-cream' : 'text-gold'}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </p>
    </fieldset>
  )
}
