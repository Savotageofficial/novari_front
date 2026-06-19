interface AdminSortHeaderProps {
  label: string
  active: boolean
  ascending: boolean
  onClick: () => void
}

export function AdminSortHeader({
  label,
  active,
  ascending,
  onClick,
}: AdminSortHeaderProps) {
  const sortLabel = active
    ? `${label}: sort ${ascending ? 'ascending' : 'descending'}`
    : `${label}: sort`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sortLabel}
      className="group flex w-full items-center gap-2 font-mono text-nav uppercase tracking-widest text-gold transition-colors duration-300 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <span>{label}</span>
      <span
        className={`inline-block transition-transform duration-300 ${
          active ? (ascending ? 'rotate-180' : 'rotate-0') : 'rotate-0 opacity-0 group-hover:opacity-40'
        }`}
        aria-hidden="true"
      >
        ↓
      </span>
    </button>
  )
}
