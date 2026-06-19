import type { ReactNode } from 'react'
import { SideDrawer } from './SideDrawer'

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function MobileFilterDrawer({
  open,
  onClose,
  children,
}: MobileFilterDrawerProps) {
  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      side="left"
      width="w-80 max-w-[85vw]"
      className="overflow-y-auto bg-obsidian p-6"
      duration={0.3}
    >
      <div className="mb-6 flex items-center justify-between border-b border-cream/20 pb-4">
        <h2 id="mobile-filter-title" className="font-display text-2xl uppercase tracking-wide text-cream">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-lg text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Close filters"
        >
          ✕
        </button>
      </div>
      {children}
    </SideDrawer>
  )
}
