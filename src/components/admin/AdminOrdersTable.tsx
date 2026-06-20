import { AdminOrderRow } from './AdminOrderRow'
import { AdminSortHeader } from './AdminSortHeader'
import type { AdminOrderStatus, ApiOrder } from '../../api/types'
import type { OrderSortDir, OrderSortKey } from '../../hooks/useAdminOrders'

interface AdminOrdersTableProps {
  orders: ApiOrder[]
  sortKey: OrderSortKey
  sortDir: OrderSortDir
  onSort: (key: OrderSortKey) => void
  expandedId: number | null
  onToggleRow: (id: number) => void
  savingIds: Set<number>
  onStatusChange: (orderId: number, status: AdminOrderStatus) => void
}

function ariaSortValue(
  columnKey: OrderSortKey,
  activeKey: OrderSortKey,
  dir: OrderSortDir
): 'ascending' | 'descending' | 'none' {
  if (columnKey !== activeKey) return 'none'
  return dir === 'asc' ? 'ascending' : 'descending'
}

export function AdminOrdersTable({
  orders,
  sortKey,
  sortDir,
  onSort,
  expandedId,
  onToggleRow,
  savingIds,
  onStatusChange,
}: AdminOrdersTableProps) {
  return (
    <section className="overflow-x-auto border border-cream/20">
      <table className="w-full min-w-[52rem] border-collapse">
        <thead>
          <tr className="border-b border-cream/20 bg-charcoal">
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('id', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Order"
                active={sortKey === 'id'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('id')}
              />
            </th>
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('customer', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Customer"
                active={sortKey === 'customer'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('customer')}
              />
            </th>
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('date', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Date"
                active={sortKey === 'date'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('date')}
              />
            </th>
            <th className="px-6 py-4 text-left">
              <span className="font-mono text-nav uppercase tracking-widest text-cream/60">
                Items
              </span>
            </th>
            <th
              className="px-6 py-4 text-left"
              aria-sort={ariaSortValue('total', sortKey, sortDir)}
            >
              <AdminSortHeader
                label="Total"
                active={sortKey === 'total'}
                ascending={sortDir === 'asc'}
                onClick={() => onSort('total')}
              />
            </th>
            <th className="px-6 py-4 text-left">
              <span className="font-mono text-nav uppercase tracking-widest text-cream/60">
                Status
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <AdminOrderRow
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              saving={savingIds.has(order.id)}
              onToggle={() => onToggleRow(order.id)}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="px-6 py-16 text-center">
          <p className="font-mono text-sm text-cream/60">No orders match your search.</p>
        </div>
      )}
    </section>
  )
}
