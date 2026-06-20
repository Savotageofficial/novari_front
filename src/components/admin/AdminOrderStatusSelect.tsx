import { ADMIN_ORDER_STATUSES, type AdminOrderStatus } from '../../api/types'

interface AdminOrderStatusSelectProps {
  orderId: number
  status: string
  disabled?: boolean
  onChange: (orderId: number, status: AdminOrderStatus) => void
}

function isAdminOrderStatus(status: string): status is AdminOrderStatus {
  return (ADMIN_ORDER_STATUSES as readonly string[]).includes(status)
}

export function AdminOrderStatusSelect({
  orderId,
  status,
  disabled = false,
  onChange,
}: AdminOrderStatusSelectProps) {
  const selectId = `order-status-${orderId}`

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <label htmlFor={selectId} className="sr-only">
        Order status
      </label>
      <select
        id={selectId}
        value={isAdminOrderStatus(status) ? status : ADMIN_ORDER_STATUSES[0]}
        disabled={disabled}
        onChange={(event) => onChange(orderId, event.target.value as AdminOrderStatus)}
        className="h-10 w-full min-w-[9.5rem] appearance-none border border-cream/30 bg-obsidian px-3 pr-8 font-mono text-sm text-cream transition-colors duration-300 focus:border-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {ADMIN_ORDER_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
