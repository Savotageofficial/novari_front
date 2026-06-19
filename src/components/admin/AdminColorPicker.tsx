import { COLOR_OPTIONS } from '../../data/colors'
import type { ColorOption } from '../../data/colors'
import { ColorSwatchGrid } from '../ColorSwatchGrid'
import { AdminAddColorFields } from './AdminAddColorFields'

interface AdminColorPickerProps {
  selectedColors: string[]
  onToggleColor: (color: ColorOption) => void
  availableColors?: ColorOption[]
  onAddColor?: (name: string, hex: string) => boolean
}

export function AdminColorPicker({
  selectedColors,
  onToggleColor,
  availableColors = COLOR_OPTIONS,
  onAddColor,
}: AdminColorPickerProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-mono text-nav uppercase tracking-widest text-gold">
        Colors
      </legend>
      <ColorSwatchGrid
        mode="multi"
        colors={availableColors}
        selected={selectedColors}
        onSelect={onToggleColor}
        showCheckmark
      />
      <p className="font-mono text-sm text-cream/60">
        {selectedColors.length > 0
          ? selectedColors.join(', ')
          : 'No colors selected'}
      </p>
      {onAddColor && <AdminAddColorFields onAddColor={onAddColor} />}
    </fieldset>
  )
}
