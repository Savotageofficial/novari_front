import type { StockFilter } from '../../hooks/useAdminProducts'

interface AdminFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  categories: string[]
  onCategoryChange: (value: string) => void
  stockFilter: StockFilter
  onStockChange: (value: StockFilter) => void
  resultCount: number
}

export function AdminFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  categories,
  onCategoryChange,
  stockFilter,
  onStockChange,
  resultCount,
}: AdminFiltersProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
        <div>
          <label
            htmlFor="search"
            className="block font-mono text-nav uppercase tracking-widest text-gold"
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Product name"
            className="mt-2 h-12 w-full border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold focus:outline-none sm:w-64"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block font-mono text-nav uppercase tracking-widest text-gold"
          >
            Category
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-2 h-12 w-full appearance-none border border-cream/30 bg-obsidian px-4 pr-10 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none sm:w-48"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="stock"
            className="block font-mono text-nav uppercase tracking-widest text-gold"
          >
            Stock
          </label>
          <select
            id="stock"
            value={stockFilter}
            onChange={(e) => onStockChange(e.target.value as StockFilter)}
            className="mt-2 h-12 w-full appearance-none border border-cream/30 bg-obsidian px-4 pr-10 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none sm:w-48"
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>
      <p className="font-mono text-sm text-cream/60">
        {resultCount} {resultCount === 1 ? 'product' : 'products'}
      </p>
    </section>
  )
}
