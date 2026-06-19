import { createContext } from 'react'
import type { Product } from '../data/products'

export interface ProductContextValue {
  products: Product[]
  isLoading: boolean
  error: string | null
  reload: () => void
  getProductById: (id: string | undefined) => Product | undefined
}

const NOT_PROVIDED = Symbol('ProductContext not provided')
type NotProvided = typeof NOT_PROVIDED

export const ProductContext = createContext<ProductContextValue | NotProvided>(
  NOT_PROVIDED
)
export { NOT_PROVIDED }
