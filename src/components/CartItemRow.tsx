import { formatPrice } from '../data/products'
import type { CartItem } from '../context/cartContext'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const lineTotal = item.numericPrice * item.quantity

  return (
    <li className="flex gap-4 border-b border-cream/20 pb-6 last:border-b-0 last:pb-0">
      <img
        src={item.image}
        alt={`${item.name} thumbnail`}
        className="h-20 w-20 shrink-0 object-cover"
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-mono text-sm uppercase tracking-wide text-cream">
              {item.name}
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cream/60">
              {item.color} / {item.size}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center text-cream/60 transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
              aria-hidden="true"
            >
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center border border-cream">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              aria-label="Decrease quantity"
              className="h-8 w-8 cursor-pointer font-mono text-base leading-none text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              −
            </button>
            <span
              aria-live="polite"
              aria-label={`Quantity of ${item.name}`}
              className="flex h-8 w-8 items-center justify-center border-x border-cream font-mono text-sm tabular-nums text-cream"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              aria-label="Increase quantity"
              className="h-8 w-8 cursor-pointer font-mono text-base leading-none text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              +
            </button>
          </div>
          <span className="font-mono text-sm tabular-nums text-cream/80">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </li>
  )
}
