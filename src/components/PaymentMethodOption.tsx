import { useId } from 'react'
import { cn } from '../lib/utils'

interface PaymentMethodOptionProps {
  value: string
  checked: boolean
  onChange: (value: string) => void
  name: string
  title: string
  description: string
  disabled?: boolean
  unavailableLabel?: string
}

export function PaymentMethodOption({
  value,
  checked,
  onChange,
  name,
  title,
  description,
  disabled = false,
  unavailableLabel,
}: PaymentMethodOptionProps) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className={cn(
        'group relative flex cursor-pointer items-start gap-4 border bg-obsidian p-4 transition-colors duration-300',
        checked
          ? 'border-gold'
          : 'border-cream/30 hover:border-cream/60',
        disabled && 'cursor-not-allowed opacity-50 hover:border-cream/30'
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'mt-1 inline-block h-4 w-4 shrink-0 border transition-colors duration-300',
          checked ? 'border-gold bg-gold' : 'border-cream/60 bg-transparent',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-obsidian'
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-sm uppercase tracking-wide text-cream">
            {title}
          </span>
          {disabled && unavailableLabel && (
            <span className="font-mono text-xs uppercase tracking-widest text-cream/45">
              {unavailableLabel}
            </span>
          )}
        </div>
        <p className="font-mono text-xs leading-relaxed text-cream/60">
          {description}
        </p>
      </div>
    </label>
  )
}
