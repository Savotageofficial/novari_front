import type { SortOption } from '../hooks/useProductFilters'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

interface ProductSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="sr-only" htmlFor="sort">
        Sort by
      </label>
      <div className="relative">
        <select
          id="sort"
          value={value}
          onChange={(event) => onChange(event.target.value as SortOption)}
          className="appearance-none border border-cream/60 bg-transparent py-3 pl-4 pr-10 font-mono text-sm uppercase tracking-wide text-cream transition-colors duration-300 focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-cream"
          aria-hidden="true"
        >
          ▼
        </span>
      </div>
    </div>
  )
}
