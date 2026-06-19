import type { ReactNode } from 'react'

interface CheckboxProps {
  label: ReactNode
  checked: boolean
  onChange: () => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-4 py-1.5">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="h-4 w-4 shrink-0 border border-cream/60 bg-transparent transition-colors duration-300 peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-obsidian" />
      <span className="font-mono text-sm uppercase tracking-wide text-cream/80 transition-colors duration-300 group-hover:text-cream">
        {label}
      </span>
    </label>
  )
}
