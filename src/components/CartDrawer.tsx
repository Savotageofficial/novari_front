import { Link } from 'react-router'
import { useCart } from '../hooks/useCart'
import { lineKey } from '../context/cartContext'
import { formatPrice } from '../data/products'
import { Button } from './primitives'
import { CartEmptyState } from './CartEmptyState'
import { CartItemRow } from './CartItemRow'
import { SideDrawer } from './SideDrawer'

export function CartDrawer() {
  const { items, count, subtotal, isOpen, close, updateQuantity, removeItem } =
    useCart()

  const isEmpty = items.length === 0

  return (
    <SideDrawer
      open={isOpen}
      onClose={close}
      side="right"
      width="w-full max-w-md"
      className="flex flex-col border-l border-cream bg-obsidian shadow-[-12px_0_40px_rgba(0,0,0,0.5)]"
      duration={0.45}
      role="dialog"
      aria-modal
      aria-label="Shopping cart"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-cream px-6 py-3.5">
        <h2 className="font-mono text-nav uppercase tracking-widest text-gold">
          Your cart
          <span className="ml-2 text-cream/80">[{count}]</span>
        </h2>
        <button
          type="button"
          onClick={close}
          aria-label="Close cart"
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg
            width="22"
            height="22"
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
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isEmpty ? (
          <CartEmptyState onClose={close} />
        ) : (
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <CartItemRow
                key={lineKey(item.id, item.color, item.size)}
                item={item}
                onUpdateQuantity={(quantity) =>
                  updateQuantity(item.id, item.color, item.size, quantity)
                }
                onRemove={() => removeItem(item.id, item.color, item.size)}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="shrink-0 border-t border-cream px-6 py-6">
        <div className="flex items-baseline justify-between font-mono text-sm text-cream">
          <span className="uppercase tracking-widest">Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 font-mono text-xs text-cream/60">
          Shipping &amp; taxes calculated at checkout
        </p>
        {isEmpty ? (
          <Button
            type="button"
            disabled
            size="lg"
            className="mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cream disabled:hover:bg-transparent disabled:hover:text-cream"
          >
            Checkout
          </Button>
        ) : (
          <Link
            to="/checkout"
            onClick={close}
            className="mt-5 inline-flex w-full items-center justify-center border border-cream bg-transparent px-10 py-4 font-mono text-nav uppercase tracking-widest text-cream transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-obsidian focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Checkout
          </Link>
        )}
      </footer>
    </SideDrawer>
  )
}
