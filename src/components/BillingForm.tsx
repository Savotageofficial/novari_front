import { useState, type FormEvent } from 'react'
import { Button } from './primitives'
import { TextField } from './TextField'
import { PaymentMethodOption } from './PaymentMethodOption'
import { formatPrice } from '../data/products'
import type { CartItem } from '../context/cartContext'

export type PaymentMethod = 'cod' | 'card'

export interface BillingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: PaymentMethod
  notes: string
}

interface BillingFormProps {
  items: CartItem[]
  subtotal: number
  disabled?: boolean
  onSubmit: (data: BillingFormData) => void | Promise<void>
}

const PAYMENT_METHODS: Array<{
  value: PaymentMethod
  title: string
  description: string
  disabled: boolean
  unavailableLabel?: string
}> = [
  {
    value: 'cod',
    title: 'Cash on delivery',
    description: 'Pay in cash when your order arrives at your door.',
    disabled: false,
  },
  {
    value: 'card',
    title: 'Credit / debit card',
    description: 'Secure online payment via Visa, Mastercard, and Meeza.',
    disabled: true,
    unavailableLabel: 'Unavailable',
  },
]

function Fieldset({
  legend,
  children,
}: {
  legend: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="font-mono text-nav uppercase tracking-widest text-gold">
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}

export function BillingForm({ items, subtotal, disabled, onSubmit }: BillingFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (disabled) return
    const formData = new FormData(event.currentTarget)
    onSubmit({
      firstName: String(formData.get('firstName') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      address: String(formData.get('address') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      paymentMethod,
      notes: String(formData.get('notes') ?? '').trim(),
    })
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10"
      noValidate={false}
    >
      <Fieldset legend="Contact">
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+20 1X XXX XXXX"
          required
        />
      </Fieldset>

      <Fieldset legend="Shipping address">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            required
          />
          <TextField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            required
          />
        </div>
        <TextField
          label="Address"
          name="address"
          autoComplete="street-address"
          placeholder="Street, building, apartment"
          required
        />
        <TextField
          label="City"
          name="city"
          autoComplete="address-level2"
          required
        />
      </Fieldset>

      <Fieldset legend="Payment method">
        <div
          role="radiogroup"
          aria-label="Payment method"
          className="flex flex-col gap-3"
        >
          {PAYMENT_METHODS.map((method) => (
            <PaymentMethodOption
              key={method.value}
              name="payment-method"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={(value) => setPaymentMethod(value as PaymentMethod)}
              title={method.title}
              description={method.description}
              disabled={method.disabled}
              unavailableLabel={method.unavailableLabel}
            />
          ))}
        </div>
      </Fieldset>

      <Fieldset legend="Order notes">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm uppercase tracking-widest text-cream/80">
            Notes <span className="text-cream/45">(optional)</span>
          </span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Delivery preferences, gift message, etc."
            className="w-full resize-none border border-cream/30 bg-obsidian px-4 py-3 font-mono text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold focus:outline-none"
          />
        </label>
      </Fieldset>

      <div className="flex flex-col gap-3 border-t border-cream/20 pt-6">
        <div className="flex items-baseline justify-between font-mono text-sm text-cream/80">
          <span className="uppercase tracking-widest">Items</span>
          <span className="tabular-nums">{itemCount}</span>
        </div>
        <div className="flex items-baseline justify-between font-mono text-sm text-cream/80">
          <span className="uppercase tracking-widest">Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-baseline justify-between font-mono text-sm text-cream/60">
          <span className="uppercase tracking-widest">Shipping</span>
          <span>Calculated on delivery</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-cream/20 pt-4 font-mono text-base text-cream">
          <span className="uppercase tracking-widest">Total</span>
          <span className="tabular-nums text-lg">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={disabled}
        className="w-full disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cream disabled:hover:bg-transparent disabled:hover:text-cream"
      >
        Place order
      </Button>
    </form>
  )
}
