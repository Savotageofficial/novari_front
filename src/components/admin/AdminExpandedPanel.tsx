import { AdminColorPicker } from './AdminColorPicker'
import { AdminPricingFields } from './AdminPricingFields'
import { AdminInventoryFields } from './AdminInventoryFields'
import { AdminDetailsFields } from './AdminDetailsFields'
import type { AdminProduct } from '../../hooks/useAdminProducts'
import type { ColorOption } from '../../data/colors'

interface AdminExpandedPanelProps {
  product: AdminProduct
  onUpdate: (updates: Partial<AdminProduct>) => void
  onToggleColor: (color: ColorOption) => void
  onImageUploaded: () => void
  colorOptions: ColorOption[]
  onAddColor: (name: string, hex: string) => ColorOption | null
}

export function AdminExpandedPanel({
  product,
  onUpdate,
  onToggleColor,
  onImageUploaded,
  colorOptions,
  onAddColor,
}: AdminExpandedPanelProps) {
  function handleAddColor(name: string, hex: string): boolean {
    const color = onAddColor(name, hex)
    if (!color) return false
    if (!product.colors.includes(color.name)) {
      onToggleColor(color)
    }
    return true
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <AdminColorPicker
        availableColors={colorOptions}
        selectedColors={product.colors}
        onToggleColor={onToggleColor}
        onAddColor={handleAddColor}
      />

      <AdminPricingFields
        productId={product.id}
        numericPrice={product.numericPrice}
        discount={product.discount}
        onUpdate={onUpdate}
      />

      <AdminInventoryFields
        productId={product.id}
        inStock={product.inStock}
        stockCount={product.stockCount}
        onUpdate={onUpdate}
      />

      <AdminDetailsFields
        productId={product.id}
        category={product.category}
        images={product.images}
        description={product.description}
        onUpdate={onUpdate}
        onImageUploaded={onImageUploaded}
      />
    </div>
  )
}
