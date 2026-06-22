import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchAdminOrders, updateAdminOrderStatus } from '../api/admin'
import type { AdminOrderStatus, ApiOrder } from '../api/types'
import { useAdminAuth } from './useAdminAuth'

export type OrderSortKey = 'id' | 'date' | 'customer' | 'total'
export type OrderSortDir = 'asc' | 'desc'

export const ORDER_SEARCH_HINTS = [
  { prefix: '#', label: 'order ID' },
  { prefix: '$', label: 'product ID' },
  { prefix: '@', label: 'email' },
  { prefix: '!', label: 'phone' },
  { prefix: '~', label: 'customer name' },
] as const

type OrderSearchField = 'all' | 'orderId' | 'productId' | 'email' | 'phone' | 'customer'

function parseOrderSearchQuery(raw: string): { field: OrderSearchField; value: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { field: 'all', value: '' }

  const prefixToField: Record<string, OrderSearchField> = {
    '#': 'orderId',
    '$': 'productId',
    '@': 'email',
    '!': 'phone',
    '~': 'customer',
  }

  const prefix = trimmed[0]
  if (prefix && prefixToField[prefix] && trimmed.length > 1) {
    return { field: prefixToField[prefix], value: trimmed.slice(1).trim() }
  }

  return { field: 'all', value: trimmed }
}

function orderMatchesSearch(order: ApiOrder, field: OrderSearchField, value: string): boolean {
  if (!value) return true

  const query = value.toLowerCase()
  const customer = `${order.firstname} ${order.lastname}`.toLowerCase()

  switch (field) {
    case 'orderId':
      return String(order.id).includes(value)
    case 'productId':
      return order.items.some((item) => {
        const id = String(item.product_id)
        return id.includes(value) || id.padStart(2, '0').includes(value)
      })
    case 'email':
      return order.email.toLowerCase().includes(query)
    case 'phone':
      return order.phone.includes(value)
    case 'customer':
      return customer.includes(query)
    case 'all':
      return (
        String(order.id).includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        customer.includes(query)
      )
  }
}

function compareOrders(a: ApiOrder, b: ApiOrder, sortKey: OrderSortKey): number {
  switch (sortKey) {
    case 'id':
      return a.id - b.id
    case 'date':
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    case 'customer': {
      const nameA = `${a.firstname} ${a.lastname}`.trim().toLowerCase()
      const nameB = `${b.firstname} ${b.lastname}`.trim().toLowerCase()
      return nameA.localeCompare(nameB)
    }
    case 'total':
      return a.total - b.total
    default:
      return 0
  }
}

export function filterAdminOrders(
  orders: ApiOrder[],
  searchQuery: string,
  sortKey: OrderSortKey,
  sortDir: OrderSortDir
): ApiOrder[] {
  let result = [...orders]

  const { field, value } = parseOrderSearchQuery(searchQuery)
  if (value) {
    result = result.filter((order) => orderMatchesSearch(order, field, value))
  }

  result.sort((a, b) => {
    const comparison = compareOrders(a, b, sortKey)
    return sortDir === 'asc' ? comparison : -comparison
  })

  return result
}

export function useAdminOrders() {
  const { token } = useAdminAuth()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set())

  const loadOrders = useCallback(() => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    void fetchAdminOrders(token)
      .then((data) => {
        setOrders(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load orders')
        setOrders([])
        setIsLoading(false)
      })
  }, [token])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    void fetchAdminOrders(token)
      .then((data) => {
        if (!cancelled) {
          setOrders(data)
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load orders')
          setOrders([])
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const orderCount = useMemo(() => orders.length, [orders])

  const updateOrderStatus = useCallback(
    (orderId: number, status: AdminOrderStatus) => {
      if (!token) return

      let previousStatus: string | undefined

      setOrders((prev) => {
        previousStatus = prev.find((order) => order.id === orderId)?.status
        return prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      })

      setSavingIds((prev) => new Set(prev).add(orderId))

      void updateAdminOrderStatus(token, orderId, status)
        .catch((err) => {
          if (previousStatus !== undefined) {
            const rollbackStatus = previousStatus
            setOrders((prev) =>
              prev.map((order) =>
                order.id === orderId ? { ...order, status: rollbackStatus } : order
              )
            )
          }
          setError(err instanceof Error ? err.message : 'Failed to update order status')
        })
        .finally(() => {
          setSavingIds((prev) => {
            const next = new Set(prev)
            next.delete(orderId)
            return next
          })
        })
    },
    [token]
  )

  return {
    orders,
    orderCount,
    isLoading,
    error,
    savingIds,
    reload: loadOrders,
    updateOrderStatus,
  }
}
