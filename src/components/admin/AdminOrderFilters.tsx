import { ORDER_SEARCH_HINTS } from '../../hooks/useAdminOrders'

interface AdminOrderFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  resultCount: number
}

export function AdminOrderFilters({
  searchQuery,
  onSearchChange,
  resultCount,
}: AdminOrderFiltersProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <label
          htmlFor="order-search"
          className="block font-mono text-nav uppercase tracking-widest text-gold"
        >
          Search
        </label>
        <input
          id="order-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="#42 order · $05 product · or name, email, phone"
          className="mt-2 h-12 w-full border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold focus:outline-none sm:w-80"
        />
        <p className="mt-2 max-w-lg font-mono text-xs leading-relaxed text-cream/50">
          Use a prefix to search a specific field:{' '}
          {ORDER_SEARCH_HINTS.map((hint, index) => (
            <span key={hint.prefix}>
              {index > 0 ? ' · ' : ''}
              <span className="text-cream/70">{hint.prefix}</span>
              {hint.label}
            </span>
          ))}
          . Without a prefix, matches order ID, name, email, or phone.
        </p>
      </div>
      <p className="font-mono text-sm text-cream/60">
        {resultCount} {resultCount === 1 ? 'order' : 'orders'}
      </p>
    </section>
  )
}
