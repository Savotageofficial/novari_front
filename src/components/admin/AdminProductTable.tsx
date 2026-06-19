import { AdminProductRow } from './AdminProductRow'
import { AdminSortHeader } from './AdminSortHeader'
import { Button } from '../primitives'
import type { AdminProduct, SortKey, SortDir } from '../../hooks/useAdminProducts'
import type { ColorOption } from '../../data/colors'

interface AdminProductTableProps {
  products: AdminProduct[]
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  expandedId: string | null
  onToggleRow: (id: string) => void
  onUpdateProduct: (id: string, updates: Partial<AdminProduct>) => void
  onToggleColor: (id: string, color: ColorOption) => void
  onDeleteProduct: (id: string) => void
  onClearFilters: () => void
  colorOptions: ColorOption[]
  onAddColor: (name: string, hex: string) => ColorOption | null
}

function ariaSortValue(
  columnKey: SortKey,
  activeKey: SortKey,
  dir: SortDir
): 'ascending' | 'descending' | 'none' {
  if (columnKey !== activeKey) return 'none'
  return dir === 'asc' ? 'ascending' : 'descending'
}

export function AdminProductTable({
  products,
  sortKey,
  sortDir,
  onSort,
  expandedId,
  onToggleRow,
  onUpdateProduct,
  onToggleColor,
  onDeleteProduct,
  onClearFilters,
  colorOptions,
  onAddColor,
}: AdminProductTableProps) {
  return (
    <section className="overflow-x-auto border border-cream/20">
      <table className="w-full min-w-[44rem] border-collapse">
        <thead>
          <tr className="border-b border-cream/20 bg-charcoal">
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('name', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Product"
                active={sortKey === 'name'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('name')}
              />
            </th>
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('numericPrice', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Price"
                active={sortKey === 'numericPrice'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('numericPrice')}
              />
            </th>
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('inStock', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Stock"
                active={sortKey === 'inStock'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('inStock')}
              />
            </th>
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('discount', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Discount"
                active={sortKey === 'discount'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('discount')}
              />
            </th>
            <th className="px-6 py-4 text-left">
              <span className="font-mono text-nav uppercase tracking-widest text-cream/60">
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <AdminProductRow
              key={product.id}
              product={product}
              expanded={expandedId === product.id}
              onToggle={() => onToggleRow(product.id)}
              onUpdate={(updates) => onUpdateProduct(product.id, updates)}
              onToggleColor={(color) => onToggleColor(product.id, color)}
              onDelete={() => onDeleteProduct(product.id)}
              colorOptions={colorOptions}
              onAddColor={onAddColor}
            />
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="px-6 py-16 text-center">
          <p className="font-mono text-sm text-cream/60">
            No products match your filters.
          </p>
          <Button
            className="mt-6"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </section>
  )
}
