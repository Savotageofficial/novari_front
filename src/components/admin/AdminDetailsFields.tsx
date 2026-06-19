import { useId } from 'react'
import { Button } from '../primitives'
import { AdminImageUpload } from './AdminImageUpload'
import type { AdminProduct } from '../../hooks/useAdminProducts'

interface AdminDetailsFieldsProps {
  productId: string
  category: string
  images: string[]
  description: string
  onUpdate: (updates: Partial<AdminProduct>) => void
}

export function AdminDetailsFields({
  productId,
  category,
  images,
  description,
  onUpdate,
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
          <label className="block font-mono text-sm text-cream/80">
            Images
          </label>
          <div className="mt-2 space-y-2">
            {images.map((image, index) => (
              <div
                key={`${productId}-image-${index}`}
                className="flex gap-2"
              >
                <input
                  id={`image-${productId}-${index}`}
                  type="text"
                  value={image}
                  onChange={(e) => {
                    const next = [...images]
                    next[index] = e.target.value
                    onUpdate({ images: next })
                  }}
                  placeholder="/assets/image.webp"
                  aria-label={`Image URL ${index + 1}`}
                  className="h-12 flex-1 border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream transition-colors duration-300 placeholder:text-cream/30 focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      images: images.filter((_, i) => i !== index),
                    })
                  }
                  aria-label={`Remove image ${index + 1}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center border border-cream/30 bg-obsidian font-mono text-sm text-cream transition-colors duration-300 hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  -
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <AdminImageUpload
              label="Upload photo"
              onUploaded={(url) => onUpdate({ images: [...images, url] })}
            />
          </div>
          <Button
            size="default"
            className="mt-4"
            onClick={() => onUpdate({ images: [...images, ''] })}
          >
            Add image
          </Button>
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
