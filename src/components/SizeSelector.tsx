import { SIZE_OPTIONS } from '../data/sizes'
import type { SizeOption } from '../data/sizes'

interface SizeSelectorProps {
  value: SizeOption
  onChange: (size: SizeOption) => void
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <div className="mt-8">
      <h2 className="font-mono text-nav uppercase tracking-widest text-gold">
        Size
      </h2>
      <div
        role="radiogroup"
        aria-label="Size"
        className="mt-4 flex items-center gap-3"
      >
        {SIZE_OPTIONS.map((size) => (
          <button
            key={size.value}
            type="button"
            role="radio"
            aria-checked={value.value === size.value}
            onClick={() => onChange(size)}
            className={`h-10 w-10 border font-mono text-sm uppercase tracking-wide transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              value.value === size.value
                ? 'border-cream bg-cream text-obsidian'
                : 'border-cream/40 text-cream hover:border-cream'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-sm text-cream/80">{value.label}</p>
    </div>
  )
}
