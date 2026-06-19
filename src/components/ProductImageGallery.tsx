import { useState } from 'react'
import { m } from 'framer-motion'
import { getPrimaryImage, PRODUCT_PLACEHOLDER_IMAGE } from '../data/products'
import type { Product } from '../data/products'

interface ProductImageGalleryProps {
  product: Product
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const images = product.images.length > 0 ? product.images : [PRODUCT_PLACEHOLDER_IMAGE]
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? getPrimaryImage(product)

  return (
    <section className="flex flex-col gap-4">
      <div className="relative overflow-hidden bg-charcoal">
        <m.img
          key={activeImage}
          src={activeImage}
          alt={`${product.name} view ${activeIndex + 1}`}
          className="aspect-square w-full object-cover object-center"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${product.name} image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative overflow-hidden bg-charcoal transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                activeIndex === index
                  ? 'ring-1 ring-cream'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt=""
                className="aspect-square w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
