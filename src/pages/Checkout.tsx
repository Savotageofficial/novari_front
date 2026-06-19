import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { m } from 'framer-motion'
import { submitOrder } from '../api/orders'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { CheckoutItemRow } from '../components/CheckoutItemRow'
import { BillingForm, type BillingFormData } from '../components/BillingForm'
import { ErrorState } from '../components/ErrorState'
import { useCart, useCartActions } from '../hooks/useCart'
import { lineKey } from '../context/cartContext'
import { useProducts } from '../hooks/useProducts'

export default function Checkout() {
  const { items, count, subtotal } = useCart()
  const { updateQuantity, removeItem, clear } = useCartActions()
  const { getProductById } = useProducts()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const isEmpty = items.length === 0

  const productIndex = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getProductById>>()
    for (const item of items) {
      if (!map.has(item.id)) map.set(item.id, getProductById(item.id))
    }
    return map
  }, [items, getProductById])

  const handleSubmit = async (data: BillingFormData) => {
    if (isEmpty || isSubmitting) return

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const response = await submitOrder({
        email: data.email,
        phone: data.phone,
        firstname: data.firstName,
        lastname: data.lastName,
        address: data.address,
        city: data.city,
        payment_method: data.paymentMethod,
        Order_Notes: data.notes,
        items: items.map((item) => ({
          product_id: Number.parseInt(item.id, 10),
          name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.numericPrice,
        })),
      })
      setOrderSuccess(response.success)
      clear()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit order')
    } finally {
      setIsSubmitting(false)
    }
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
          <header className="mb-10 flex flex-col gap-2 border-b border-cream/20 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-6xl uppercase tracking-wide text-cream md:text-3xl">
                Checkout
              </h1>
              {!isEmpty && (
                <p className="mt-2 font-mono text-sm text-cream/60">
                  {count} {count === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
            {!isEmpty && (
              <Link
                to="/products"
                className="font-mono text-nav uppercase tracking-widest text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Continue shopping →
              </Link>
            )}
          </header>

          {orderSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 py-section text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-cream">
                {orderSuccess}
              </p>
              <Link
                to="/products"
                className="font-mono text-nav uppercase tracking-widest text-cream underline-offset-4 transition-colors duration-300 hover:text-gold hover:underline"
              >
                Continue shopping →
              </Link>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-6 py-section text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-cream/60">
                Your cart is empty
              </p>
              <Link
                to="/products"
                className="font-mono text-nav uppercase tracking-widest text-cream underline-offset-4 transition-colors duration-300 hover:text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Continue shopping →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-product-lg lg:grid-cols-12">
              <section aria-label="Order items" className="lg:col-span-7">
                <h2 className="mb-4 font-mono text-nav uppercase tracking-widest text-gold">
                  Your order
                </h2>
                <ul className="border-t border-cream/20">
                  {items.map((item) => {
                    const product = productIndex.get(item.id)
                    return (
                      <CheckoutItemRow
                        key={lineKey(item.id, item.color, item.size)}
                        item={item}
                        originalPrice={product?.numericPrice}
                        discountPercent={product?.discount}
                        onUpdateQuantity={(quantity) =>
                          updateQuantity(item.id, item.color, item.size, quantity)
                        }
                        onRemove={() => removeItem(item.id, item.color, item.size)}
                      />
                    )
                  })}
                </ul>
              </section>

              <aside aria-label="Billing and payment" className="lg:col-span-5">
                <h2 className="mb-4 font-mono text-nav uppercase tracking-widest text-gold">
                  Billing &amp; payment
                </h2>
                <div className="border border-cream/20 bg-charcoal p-6 md:p-8">
                  {submitError && (
                    <div className="mb-6">
                      <ErrorState message={submitError} />
                    </div>
                  )}
                  <BillingForm
                    items={items}
                    subtotal={subtotal}
                    disabled={isSubmitting}
                    onSubmit={handleSubmit}
                  />
                </div>
              </aside>
            </div>
          )}
        </div>
      </m.main>
      <Footer />
    </>
  )
}
