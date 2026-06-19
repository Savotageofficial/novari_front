import { ColorSwatchGrid } from './ColorSwatchGrid'
import type { ColorOption } from '../data/colors'

interface ColorSelectorProps {
  colors: ColorOption[]
  value: ColorOption
  onChange: (color: ColorOption) => void
}

export function ColorSelector({ colors, value, onChange }: ColorSelectorProps) {
  return (
    <div className="mt-8">
      <h2 className="font-mono text-nav uppercase tracking-widest text-gold">
        Color
      </h2>
      <div
        role="radiogroup"
        aria-label="Color"
        className="mt-4"
      >
        <ColorSwatchGrid
          mode="single"
          colors={colors}
          selected={value.name}
          onSelect={onChange}
        />
      </div>
      <p className="mt-3 font-mono text-sm text-cream/80">{value.name}</p>
    </div>
  )
}
