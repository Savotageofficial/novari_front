interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (range: [number, number]) => void
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [low, high] = value
  const span = max - min
  const lowPercent = span === 0 ? 0 : ((low - min) / span) * 100
  const highPercent = span === 0 ? 100 : ((high - min) / span) * 100

  const handleLowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLow = Number(event.target.value)
    onChange([Math.min(nextLow, high), high])
  }

  const handleHighChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextHigh = Number(event.target.value)
    onChange([low, Math.max(nextHigh, low)])
  }

  const rangeInputClass =
    'pointer-events-none absolute top-1/2 left-0 h-4 w-full -translate-y-1/2 appearance-none bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:cursor-pointer [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-transparent'

  return (
    <div className="pt-4 pb-6">
      <div className="relative h-px bg-cream/20">
        <div
          className="absolute h-full bg-gold"
          style={{
            left: `${lowPercent}%`,
            width: `${highPercent - lowPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          onChange={handleLowChange}
          className={rangeInputClass}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          onChange={handleHighChange}
          className={rangeInputClass}
          aria-label="Maximum price"
        />
      </div>
      <div className="mt-5 flex justify-between font-mono text-sm text-cream/80">
        <span>{low} EGP</span>
        <span>{high} EGP</span>
      </div>
    </div>
  )
}
