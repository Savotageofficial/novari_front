import { Link } from 'react-router'
import { formatPrice } from '../data/products'
import type { CartItem } from '../context/cartContext'

interface CheckoutItemRowProps {
  item: CartItem
  originalPrice?: number
  discountPercent?: number
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CheckoutItemRow({
  item,
  originalPrice,
  discountPercent,
  onUpdateQuantity,
  onRemove,
}: CheckoutItemRowProps) {
  const lineTotal = item.numericPrice * item.quantity
  const showDiscount =
    typeof originalPrice === 'number' &&
    typeof discountPercent === 'number' &&
    discountPercent > 0 &&
    originalPrice > item.numericPrice
  const detailHref = `/products/${item.id}`

  return (
    <li className="flex flex-col gap-5 border-b border-cream/20 py-6 last:border-b-0 sm:flex-row sm:items-center sm:gap-6">
      <Link
        to={detailHref}
        className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`View ${item.name}`}
      >
        <img
          src={item.image}
          alt={`${item.name} thumbnail`}
          className="h-28 w-28 object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              to={detailHref}
              className="flex flex-wrap items-center gap-2 truncate font-mono text-sm uppercase tracking-wide text-cream transition-colors duration-300 hover:text-gold"
            >
              {showDiscount && (
                <span className="bg-gold px-1.5 py-0.5 font-mono text-xs text-obsidian">
                  -{discountPercent}%
                </span>
              )}
              <span className="truncate">{item.name}</span>
            </Link>
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

        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex flex-col items-end gap-1 text-right">
            <span className="font-mono text-sm tabular-nums text-cream/80">
              {formatPrice(lineTotal)}
            </span>
            {showDiscount ? (
              <span className="font-mono text-xs tabular-nums text-cream/40 line-through">
                {formatPrice((originalPrice ?? 0) * item.quantity)}
              </span>
            ) : item.quantity > 1 ? (
              <span className="font-mono text-xs tabular-nums text-cream/45">
                {formatPrice(item.numericPrice)} each
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  )
}

