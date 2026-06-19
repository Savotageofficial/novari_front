import { useContext } from 'react'
import {
  CartActionsContext,
  CartStateContext,
  NOT_PROVIDED,
  type CartActions,
  type CartState,
} from '../context/cartContext'

export function useCartState(): CartState {
  const ctx = useContext(CartStateContext)
  if (ctx === NOT_PROVIDED) {
    throw new Error('useCartState must be used within CartProvider')
  }
  return ctx
}

export function useCartActions(): CartActions {
  const ctx = useContext(CartActionsContext)
  if (ctx === NOT_PROVIDED) {
    throw new Error('useCartActions must be used within CartProvider')
  }
  return ctx
}

export function useCart(): CartState & CartActions {
  return { ...useCartState(), ...useCartActions() }
}
