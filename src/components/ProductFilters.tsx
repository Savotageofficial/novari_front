import { COLOR_SWATCHES } from '../data/colors'
import { Button } from './primitives'
import { Checkbox } from './Checkbox'
import { FilterSection } from './FilterSection'
import { PriceRangeSlider } from './PriceRangeSlider'

interface ProductFiltersProps {
  categories: string[]
  availableCategories: string[]
  priceRange: [number, number]
  priceBounds: [number, number]
  isPriceActive: boolean
  colors: string[]
  availableColors: string[]
  onToggleCategory: (category: string) => void
  onToggleColor: (color: string) => void
  onSetPriceMin: (min: number) => void
  onSetPriceMax: (max: number) => void
  onResetPrice: () => void
  onClear: () => void
  showClearButton?: boolean
}

export function ProductFilters({
  categories,
  availableCategories,
  priceRange,
  priceBounds,
  isPriceActive,
  colors,
  availableColors,
  onToggleCategory,
  onToggleColor,
  onSetPriceMin,
  onSetPriceMax,
  onResetPrice,
  onClear,
  showClearButton = true,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col">
      {showClearButton && (
        <div className="pb-5">
          <Button
            className="w-full"
            onClick={onClear}
            disabled={
              categories.length === 0 &&
              colors.length === 0 &&
              !isPriceActive
            }
          >
            Clear All Filters
          </Button>
        </div>
      )}

      <FilterSection title="Category">
        {availableCategories.map((category) => (
          <Checkbox
            key={category}
            label={category}
            checked={categories.includes(category)}
            onChange={() => onToggleCategory(category)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeSlider
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={priceRange}
          onChange={([min, max]) => {
            onSetPriceMin(min)
            onSetPriceMax(max)
          }}
        />
        {isPriceActive && (
          <button
            type="button"
            onClick={onResetPrice}
            className="mt-2 self-start font-mono text-xs uppercase tracking-widest text-cream/60 underline underline-offset-4 transition-colors duration-300 hover:text-gold"
          >
            Reset price
          </button>
        )}
      </FilterSection>

      <FilterSection title="Color">
        {availableColors.map((color) => (
          <Checkbox
            key={color}
            label={
              <span className="inline-flex items-center gap-3">
                <span
                  className="h-4 w-4 border border-cream/40"
                  style={{ backgroundColor: COLOR_SWATCHES[color] ?? '#BABABA' }}
                  aria-hidden="true"
                />
                {color}
              </span>
            }
            checked={colors.includes(color)}
            onChange={() => onToggleColor(color)}
          />
        ))}
      </FilterSection>
    </div>
  )
}
