import type { ReactNode } from 'react'
import { Button } from './primitives'
import { MobileFilterDrawer } from './MobileFilterDrawer'

interface ProductFilterSectionProps {
  activeFilterCount: number
  mobileFiltersOpen: boolean
  onMobileFiltersOpen: () => void
  onMobileFiltersClose: () => void
  children: ReactNode
}

export function ProductFilterSection({
  activeFilterCount,
  mobileFiltersOpen,
  onMobileFiltersOpen,
  onMobileFiltersClose,
  children,
}: ProductFilterSectionProps) {
  return (
    <>
      <div className="flex items-center justify-between lg:hidden">
        <Button onClick={onMobileFiltersOpen}>
          Filter
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center bg-cream font-mono text-xs text-obsidian">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <aside className="hidden lg:block lg:w-1/4">
        <div className="sticky top-nav max-h-[calc(100svh-4.5rem)] overflow-y-auto py-2 pr-8">
          {children}
        </div>
      </aside>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={onMobileFiltersClose}
      >
        {children}
      </MobileFilterDrawer>
    </>
  )
}
