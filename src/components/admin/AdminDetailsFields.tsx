import { useId } from 'react'
import { AdminImageUpload } from './AdminImageUpload'
import { PRODUCT_PLACEHOLDER_IMAGE } from '../../data/products'
import type { AdminProduct } from '../../hooks/useAdminProducts'

interface AdminDetailsFieldsProps {
  productId: string
  category: string
  images: string[]
  description: string
  onUpdate: (updates: Partial<AdminProduct>) => void
  onImageUploaded: () => void
}

export function AdminDetailsFields({
  productId,
  category,
  images,
  description,
  onUpdate,
  onImageUploaded,
}: AdminDetailsFieldsProps) {
  const baseId = useId()
  const categoryId = `category-${productId}-${baseId}`
  const descriptionId = `description-${productId}-${baseId}`

  return (
    <fieldset className="space-y-4 md:col-span-2 lg:col-span-3">
      <legend className="font-mono text-nav uppercase tracking-widest text-gold">
        Details
      </legend>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor={categoryId}
            className="block font-mono text-sm text-cream/80"
          >
            Category
          </label>
          <input
            id={categoryId}
            type="text"
            value={category}
            onChange={(e) => onUpdate({ category: e.target.value })}
            className="mt-2 h-12 w-full border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <p className="font-mono text-sm text-cream/80">Images</p>
          {images.some(Boolean) ? (
            <ul className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image, index) => {
                if (!image) return null

                return (
                  <li
                    key={`${productId}-image-${index}`}
                    className="relative border border-cream/30 bg-obsidian"
                  >
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="aspect-square w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onUpdate({
                          images: images.filter((_, i) => i !== index),
                        })
                      }
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center border border-cream/30 bg-obsidian/90 font-mono text-sm text-cream transition-colors duration-300 hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      ×
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-2 font-mono text-sm text-cream/40">
              No images yet. Upload one below.
            </p>
          )}
          <div className="mt-4">
            <AdminImageUpload
              productId={productId}
              label="Upload photo"
              onUploaded={() => onImageUploaded()}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={descriptionId}
            className="block font-mono text-sm text-cream/80"
          >
            Description
          </label>
          <textarea
            id={descriptionId}
            rows={3}
            value={description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="mt-2 w-full resize-none border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none"
          />
        </div>
      </div>
    </fieldset>
  )
}
