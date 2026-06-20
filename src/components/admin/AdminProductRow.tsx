import { AnimatePresence, m } from 'framer-motion'
import { AdminExpandedPanel } from './AdminExpandedPanel'
import { formatPrice, getPrimaryImage } from '../../data/products'
import type { AdminProduct } from '../../hooks/useAdminProducts'
import type { ColorOption } from '../../data/colors'

interface AdminProductRowProps {
  product: AdminProduct
  expanded: boolean
  onToggle: () => void
  onUpdate: (updates: Partial<AdminProduct>) => void
  onToggleColor: (color: ColorOption) => void
  onImageUploaded: () => void
  onDelete: () => void
  colorOptions: ColorOption[]
  onAddColor: (name: string, hex: string) => ColorOption | null
}

const chevron = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export function AdminProductRow({
  product,
  expanded,
  onToggle,
  onUpdate,
  onToggleColor,
  onImageUploaded,
  onDelete,
  colorOptions,
  onAddColor,
}: AdminProductRowProps) {
  const lowStock = product.inStock && product.stockCount < 10

  return (
    <>
      <tr
        key={`${product.id}-main`}
        className="border-b border-cream/10 bg-obsidian transition-colors duration-300 last:border-b-0 hover:bg-charcoal/50"
      >
        <td className="px-6 py-4">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse row' : 'Expand row'}
            className="flex w-full items-center gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <img
              src={getPrimaryImage(product)}
              alt=""
              className="h-12 w-12 object-cover"
            />
            <div className="flex-1">
              <p className="font-mono text-sm uppercase tracking-wide text-cream">
                {product.name}
              </p>
              <p className="font-mono text-xs text-cream/60">{product.category}</p>
            </div>
            <span
              className={`text-cream/60 transition-transform duration-300 ${
                expanded ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            >
              {chevron}
            </span>
          </button>
        </td>

        <td className="px-6 py-4 align-middle">
          <p className="font-mono text-sm text-cream/80">
            {formatPrice(product.numericPrice)}
          </p>
        </td>
        <td className="px-6 py-4 align-middle">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block h-2 w-2 ${
                product.inStock ? 'bg-cream' : 'bg-gold'
              }`}
            />
            <span
              className={`font-mono text-sm ${
                lowStock ? 'text-gold' : 'text-cream/80'
              }`}
            >
              {product.inStock
                ? `${product.stockCount} in stock`
                : 'Out of stock'}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 align-middle">
          <span className="font-mono text-sm text-cream/80">
            {product.discount > 0 ? `${product.discount}%` : '—'}
          </span>
        </td>
        <td className="px-6 py-4 align-middle">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              if (
                window.confirm(
                  `Delete "${product.name}"? This cannot be undone.`
                )
              ) {
                onDelete()
              }
            }}
            className="font-mono text-nav uppercase tracking-widest text-cream/60 transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Delete
          </button>
        </td>
      </tr>

      <AnimatePresence initial={false}>
        {expanded && (
          <m.tr
            key={`${product.id}-expanded`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-cream/10 bg-charcoal/30"
          >
            <td colSpan={5} className="p-0">
              <div className="px-6 py-8 md:px-10">
                <AdminExpandedPanel
                  product={product}
                  onUpdate={onUpdate}
                  onToggleColor={onToggleColor}
                  onImageUploaded={onImageUploaded}
                  colorOptions={colorOptions}
                  onAddColor={onAddColor}
                />
              </div>
            </td>
          </m.tr>
        )}
      </AnimatePresence>
    </>
  )
}
