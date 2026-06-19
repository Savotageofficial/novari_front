import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { useSearchParams } from 'react-router'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ProductFilters } from '../components/ProductFilters'
import { ProductGrid } from '../components/ProductGrid'
import { ProductSort } from '../components/ProductSort'
import { ProductFilterSection } from '../components/ProductFilterSection'
import { LoadingBlock } from '../components/LoadingBlock'
import { ErrorState } from '../components/ErrorState'
import { useProductFilters } from '../hooks/useProductFilters'
import { useProducts } from '../hooks/useProducts'

export default function Products() {
  const logoRef = useRef<HTMLDivElement>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const { products, isLoading, error, reload } = useProducts()

  const {
    categories,
    colors,
    priceRange,
    priceBounds,
    isPriceActive,
    sort,
    filteredProducts,
    activeFilterCount,
    availableCategories,
    availableColors,
    toggleCategory,
    toggleColor,
    setPriceMin,
    setPriceMax,
    resetPrice,
    setSort,
    clearFilters,
  } = useProductFilters(products)

  useEffect(() => {
    const category = searchParams.get('category')
    if (
      category &&
      availableCategories.includes(category) &&
      !categories.includes(category)
    ) {
      toggleCategory(category)
    }
  }, [searchParams, availableCategories, categories, toggleCategory])

  return (
    <>
      <Navbar visible logoRef={logoRef} />

      <m.main
        className="min-h-[calc(100svh-4.5rem)] bg-obsidian px-6 py-section md:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-cream/20 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-6xl uppercase tracking-wide text-cream md:text-3xl">
                All Products
              </h1>
              <p className="mt-2 font-mono text-sm text-cream/60">
                {isLoading
                  ? 'Loading products…'
                  : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
              </p>
            </div>

            <ProductSort value={sort} onChange={setSort} />
          </div>

          {isLoading ? (
            <LoadingBlock label="Loading products" />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : (
            <div className="flex flex-col gap-product-lg lg:flex-row">
              <ProductFilterSection
                activeFilterCount={activeFilterCount}
                mobileFiltersOpen={mobileFiltersOpen}
                onMobileFiltersOpen={() => setMobileFiltersOpen(true)}
                onMobileFiltersClose={() => setMobileFiltersOpen(false)}
              >
                <ProductFilters
                  categories={categories}
                  availableCategories={availableCategories}
                  priceRange={priceRange}
                  priceBounds={priceBounds}
                  isPriceActive={isPriceActive}
                  colors={colors}
                  availableColors={availableColors}
                  onToggleCategory={toggleCategory}
                  onToggleColor={toggleColor}
                  onSetPriceMin={setPriceMin}
                  onSetPriceMax={setPriceMax}
                  onResetPrice={resetPrice}
                  onClear={clearFilters}
                />
              </ProductFilterSection>

              <section className="w-full lg:w-3/4">
                <ProductGrid
                  products={filteredProducts}
                  onClearFilters={clearFilters}
                  animate={false}
                  columns={3}
                />
              </section>
            </div>
          )}
        </div>
      </m.main>

      <Footer />
    </>
  )
}
