import type { ColorOption } from '../data/colors'

interface BaseColorSwatchGridProps {
  colors: ColorOption[]
  onSelect: (color: ColorOption) => void
  getAriaLabel?: (color: ColorOption, selected: boolean) => string
  showCheckmark?: boolean
  className?: string
}

interface SingleColorSwatchGridProps extends BaseColorSwatchGridProps {
  mode: 'single'
  selected: string
}

interface MultiColorSwatchGridProps extends BaseColorSwatchGridProps {
  mode: 'multi'
  selected: string[]
}

export type ColorSwatchGridProps =
  | SingleColorSwatchGridProps
  | MultiColorSwatchGridProps

function getContrastColor(hex: string): string {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#070707' : '#BABABA'
}

function defaultAriaLabel(mode: 'single' | 'multi', color: ColorOption, selected: boolean): string {
  if (mode === 'single') return `Select ${color.name}`
  return `${selected ? 'Remove' : 'Add'} ${color.name}`
}

export function ColorSwatchGrid({
  colors,
  mode,
  selected,
  onSelect,
  getAriaLabel,
  showCheckmark = false,
  className = '',
}: ColorSwatchGridProps) {
  const isSelected = (color: ColorOption) =>
    mode === 'multi' ? selected.includes(color.name) : selected === color.name

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {colors.map((color) => {
        const selected = isSelected(color)
        const ariaLabel = getAriaLabel
          ? getAriaLabel(color, selected)
          : defaultAriaLabel(mode, color, selected)
        return (
          <button
            key={color.name}
            type="button"
            role={mode === 'single' ? 'radio' : undefined}
            aria-checked={mode === 'single' ? selected : undefined}
            aria-pressed={mode === 'multi' ? selected : undefined}
            aria-label={ariaLabel}
            onClick={() => onSelect(color)}
            className={`flex h-10 w-10 items-center justify-center border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              selected
                ? 'border-cream scale-110'
                : 'border-cream/30 hover:border-cream'
            }`}
            style={{ backgroundColor: color.hex }}
          >
            {showCheckmark && selected && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={getContrastColor(color.hex)}
                strokeWidth="2"
                strokeLinecap="square"
              >
                <polyline points="4 12 10 18 20 6" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
