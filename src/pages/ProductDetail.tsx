import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router'
import { m } from 'framer-motion'
import { fetchProductById } from '../api/products'
import { ApiError } from '../lib/apiClient'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ProductImageGallery } from '../components/ProductImageGallery'
import { ColorSelector } from '../components/ColorSelector'
import { SizeSelector } from '../components/SizeSelector'
import { ProductPrice } from '../components/ProductPrice'
import { Button } from '../components/primitives'
import { LoadingBlock } from '../components/LoadingBlock'
import { ErrorState } from '../components/ErrorState'
import { useCartActions } from '../hooks/useCart'
import { useProductOptions } from '../hooks/useProductOptions'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../data/products'

function ProductNotFound() {
  return (
    <main className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-obsidian px-6">
      <div className="text-center">
        <h1 className="font-mono text-3xl uppercase tracking-wide text-cream">
          Product not found
        </h1>
        <Link
          to="/"
          className="mt-4 inline-block font-mono text-nav uppercase tracking-widest text-cream hover:text-gold"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const logoRef = useRef<HTMLDivElement>(null)
  const { addItem, open: openCart } = useCartActions()
  const { getProductById, isLoading: catalogLoading } = useProducts()
  const cachedProduct = getProductById(id)
  const [remoteProduct, setRemoteProduct] = useState<Product | undefined>()
  const [isLoading, setIsLoading] = useState(!cachedProduct)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const product = cachedProduct ?? remoteProduct

  const {
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    availableColors,
  } = useProductOptions(product)

  useEffect(() => {
    if (cachedProduct || !id) return

    let cancelled = false

    void (async () => {
      await Promise.resolve()
      if (cancelled) return

      setIsLoading(true)
      setError(null)
      setNotFound(false)

      try {
        const data = await fetchProductById(id)
        if (!cancelled) {
          setRemoteProduct(data)
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setNotFound(true)
          } else {
            setError(err instanceof Error ? err.message : 'Failed to load product')
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [id, cachedProduct])

  if ((isLoading && !product) || catalogLoading) {
    return (
      <>
        <Navbar visible logoRef={logoRef} />
        <LoadingBlock label="Loading product" />
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar visible logoRef={logoRef} />
        <ErrorState message={error} />
        <Footer />
      </>
    )
  }

  if (notFound || !product) {
    return (
      <>
        <Navbar visible logoRef={logoRef} />
        <ProductNotFound />
        <Footer />
      </>
    )
  }

  const handleAddToCart = () => {
    addItem({ product, color: selectedColor.name, size: selectedSize.value })
    openCart()
  }

  return (
    <>
      <Navbar visible logoRef={logoRef} />

      <m.main
        className="min-h-[calc(100svh-4.5rem)] bg-obsidian px-6 py-section md:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto grid max-w-7xl gap-product-lg lg:grid-cols-2">
          <ProductImageGallery product={product} />

          <section className="flex flex-col justify-center lg:pl-10">
            <Link
              to="/products"
              className="mb-6 inline-flex font-mono text-nav uppercase tracking-widest text-cream/80 transition-colors duration-300 hover:text-gold"
            >
              ← Back to products
            </Link>

            <h1 className="font-mono text-3xl uppercase tracking-wide text-cream">
              {product.name}
            </h1>

            <div className="mt-4">
              <ProductPrice product={product} size="lg" showDiscountBadge />
            </div>

            <ColorSelector
              colors={availableColors}
              value={selectedColor}
              onChange={setSelectedColor}
            />

            <SizeSelector value={selectedSize} onChange={setSelectedSize} />

            <p className="mt-8 max-w-md font-mono text-base leading-relaxed text-cream/80">
              {product.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" onClick={handleAddToCart}>
                Add to cart
              </Button>
            </div>
          </section>
        </div>
      </m.main>
      <Footer />
    </>
  )
}
