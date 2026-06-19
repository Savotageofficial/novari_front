import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CartActionsContext,
  CartStateContext,
  STORAGE_KEY,
  lineKey,
  readStorage,
  type AddItemOptions,
  type CartActions,
  type CartItem,
  type CartState,
} from './cartContext'
import { getEffectivePrice, getPrimaryImage } from '../data/products'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* ignore quota / privacy errors */
    }
  }, [items])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback(
    ({
      product,
      color,
      size,
      quantity = 1,
    }: AddItemOptions) => {
      setItems((current) => {
        const key = lineKey(product.id, color, size)
        const existing = current.find(
          (item) => lineKey(item.id, item.color, item.size) === key
        )
        if (existing) {
          return current.map((item) =>
            lineKey(item.id, item.color, item.size) === key
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            numericPrice: getEffectivePrice(product),
            image: getPrimaryImage(product),
            color,
            size,
            quantity,
          },
        ]
      })
    },
    []
  )

  const updateQuantity = useCallback(
    (id: string, color: string, size: string, quantity: number) => {
      setItems((current) => {
        if (quantity <= 0) {
          return current.filter(
            (item) => lineKey(item.id, item.color, item.size) !== lineKey(id, color, size)
          )
        }
        return current.map((item) =>
          lineKey(item.id, item.color, item.size) === lineKey(id, color, size)
            ? { ...item, quantity }
            : item
        )
      })
    },
    []
  )

  const removeItem = useCallback((id: string, color: string, size: string) => {
    setItems((current) =>
      current.filter(
        (item) => lineKey(item.id, item.color, item.size) !== lineKey(id, color, size)
      )
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0),
    [items]
  )

  const state: CartState = useMemo(
    () => ({ items, count, subtotal, isOpen }),
    [items, count, subtotal, isOpen]
  )

  const actions: CartActions = useMemo(
    () => ({ open, close, addItem, updateQuantity, removeItem, clear }),
    [open, close, addItem, updateQuantity, removeItem, clear]
  )

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartActionsContext.Provider>
  )
}
