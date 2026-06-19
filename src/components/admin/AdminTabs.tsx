export type AdminTab = 'products' | 'orders'

interface AdminTabsProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
  orderCount?: number
}

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
]

export function AdminTabs({ activeTab, onTabChange, orderCount }: AdminTabsProps) {
  return (
    <nav
      aria-label="Admin sections"
      className="mb-8 flex gap-0 border-b border-cream/20"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const countLabel =
          tab.id === 'orders' && orderCount !== undefined ? ` (${orderCount})` : ''

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-4 font-mono text-nav uppercase tracking-widest transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              isActive ? 'text-cream' : 'text-cream/60 hover:text-cream'
            }`}
          >
            {tab.label}
            {countLabel}
            {isActive && (
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-gold"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
