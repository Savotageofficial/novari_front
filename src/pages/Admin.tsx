import { useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Button } from '../components/primitives'
import { AdminFilters } from '../components/admin/AdminFilters'
import { AdminOrderFilters } from '../components/admin/AdminOrderFilters'
import { AdminOrdersTable } from '../components/admin/AdminOrdersTable'
import { AdminProductTable } from '../components/admin/AdminProductTable'
import { AdminAddProductDrawer } from '../components/admin/AdminAddProductDrawer'
import { AdminTabs, type AdminTab } from '../components/admin/AdminTabs'
import { LoadingBlock } from '../components/LoadingBlock'
import { ErrorState } from '../components/ErrorState'
import {
  filterAdminProducts,
  useAdminProducts,
  type SortKey,
  type StockFilter,
} from '../hooks/useAdminProducts'
import {
  filterAdminOrders,
  useAdminOrders,
  type OrderSortDir,
  type OrderSortKey,
} from '../hooks/useAdminOrders'
import { useProducts } from '../hooks/useProducts'

export default function Admin() {
  const { reload: reloadCatalog } = useProducts()
  const [activeTab, setActiveTab] = useState<AdminTab>('products')

  const {
    adminProducts,
    colorOptions,
    isLoading: productsLoading,
    error: productsError,
    reload: reloadProducts,
    updateProduct,
    toggleColor,
    addColor,
    addProduct,
    removeProduct,
  } = useAdminProducts({ onCatalogChange: reloadCatalog })

  const {
    orders,
    orderCount,
    isLoading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
  } = useAdminOrders()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addProductOpen, setAddProductOpen] = useState(false)

  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [orderSortKey, setOrderSortKey] = useState<OrderSortKey>('date')
  const [orderSortDir, setOrderSortDir] = useState<OrderSortDir>('desc')
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  const categories = useMemo(() => {
    const set = new Set(adminProducts.map((product) => product.category))
    return ['all', ...Array.from(set).sort()]
  }, [adminProducts])

  const filteredProducts = useMemo(
    () =>
      filterAdminProducts(adminProducts, {
        searchQuery,
        categoryFilter,
        stockFilter,
        sortKey,
        sortDir,
      }),
    [adminProducts, searchQuery, categoryFilter, stockFilter, sortKey, sortDir]
  )

  const filteredOrders = useMemo(
    () => filterAdminOrders(orders, orderSearchQuery, orderSortKey, orderSortDir),
    [orders, orderSearchQuery, orderSortKey, orderSortDir]
  )

  const subtitle =
    activeTab === 'products'
      ? 'Manage inventory, pricing, and product details.'
      : 'Review customer orders and fulfillment details.'

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function handleOrderSort(key: OrderSortKey) {
    if (orderSortKey === key) {
      setOrderSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrderSortKey(key)
      setOrderSortDir(key === 'date' ? 'desc' : 'asc')
    }
  }

  function handleToggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function handleToggleOrderRow(id: number) {
    setExpandedOrderId((prev) => (prev === id ? null : id))
  }

  function handleClearFilters() {
    setSearchQuery('')
    setCategoryFilter('all')
    setStockFilter('all')
  }

  function handleDeleteProduct(id: string) {
    void removeProduct(id).then(() => {
      setExpandedId((prev) => (prev === id ? null : prev))
    })
  }

  function handleProductCreated(id: string) {
    setExpandedId(id)
    setSearchQuery('')
    setCategoryFilter('all')
    setStockFilter('all')
  }

  return (
    <>
      <Navbar visible />

      <m.main
        className="min-h-[calc(100svh-4.5rem)] bg-obsidian px-6 py-section md:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 border-b border-cream/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-6xl uppercase tracking-wide text-cream md:text-3xl">
                Admin Panel
              </h1>
              <p className="mt-2 font-mono text-sm text-cream/60">{subtitle}</p>
            </div>
            {activeTab === 'products' && (
              <Button onClick={() => setAddProductOpen(true)}>Add product</Button>
            )}
          </div>

          <AdminTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            orderCount={orderCount}
          />

          {activeTab === 'products' ? (
            productsLoading ? (
              <LoadingBlock label="Loading admin products" />
            ) : productsError ? (
              <ErrorState message={productsError} onRetry={reloadProducts} />
            ) : (
              <>
                <AdminFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categoryFilter={categoryFilter}
                  categories={categories}
                  onCategoryChange={setCategoryFilter}
                  stockFilter={stockFilter}
                  onStockChange={setStockFilter}
                  resultCount={filteredProducts.length}
                />

                <AdminProductTable
                  products={filteredProducts}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={handleSort}
                  expandedId={expandedId}
                  onToggleRow={handleToggleRow}
                  onUpdateProduct={updateProduct}
                  onToggleColor={toggleColor}
                  onDeleteProduct={handleDeleteProduct}
                  onClearFilters={handleClearFilters}
                  colorOptions={colorOptions}
                  onAddColor={addColor}
                />
              </>
            )
          ) : ordersLoading ? (
            <LoadingBlock label="Loading orders" />
          ) : ordersError ? (
            <ErrorState message={ordersError} onRetry={reloadOrders} />
          ) : (
            <>
              <AdminOrderFilters
                searchQuery={orderSearchQuery}
                onSearchChange={setOrderSearchQuery}
                resultCount={filteredOrders.length}
              />

              <AdminOrdersTable
                orders={filteredOrders}
                sortKey={orderSortKey}
                sortDir={orderSortDir}
                onSort={handleOrderSort}
                expandedId={expandedOrderId}
                onToggleRow={handleToggleOrderRow}
              />
            </>
          )}
        </div>
      </m.main>

      <AdminAddProductDrawer
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        colorOptions={colorOptions}
        onAddColor={addColor}
        onAddProduct={addProduct}
        onCreated={handleProductCreated}
      />

      <Footer />
    </>
  )
}
