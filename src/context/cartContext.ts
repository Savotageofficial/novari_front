import { createContext } from 'react'
import type { Product } from '../data/products'

export interface CartItem {
  id: string
  name: string
  numericPrice: number
  image: string
  color: string
  size: string
  quantity: number
}

export interface CartState {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
}

export interface AddItemOptions {
  product: Product
  color: string
  size: string
  quantity?: number
}

export interface CartActions {
  open: () => void
  close: () => void
  addItem: (options: AddItemOptions) => void
  updateQuantity: (id: string, color: string, size: string, quantity: number) => void
  removeItem: (id: string, color: string, size: string) => void
  clear: () => void
}

export const STORAGE_KEY = 'novari:cart:v2'

const NOT_PROVIDED = Symbol('CartContext not provided')
type NotProvided = typeof NOT_PROVIDED

export const CartStateContext = createContext<CartState | NotProvided>(NOT_PROVIDED)
export const CartActionsContext = createContext<CartActions | NotProvided>(NOT_PROVIDED)
export { NOT_PROVIDED }

export function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        !!item &&
        typeof (item as CartItem).id === 'string' &&
        typeof (item as CartItem).name === 'string' &&
        typeof (item as CartItem).numericPrice === 'number' &&
        typeof (item as CartItem).image === 'string' &&
        typeof (item as CartItem).color === 'string' &&
        typeof (item as CartItem).size === 'string' &&
        typeof (item as CartItem).quantity === 'number' &&
        (item as CartItem).quantity > 0
    )
  } catch {
    return []
  }
}

export function lineKey(id: string, color: string, size: string): string {
  return `${id}__${color}__${size}`
}
