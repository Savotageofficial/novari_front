import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../lib/utils'

interface TextFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string
  hint?: string
  error?: string
  containerClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, hint, error, containerClassName, id, className, required, ...rest },
    ref
  ) {
    const autoId = useId()
    const inputId = id ?? `field-${autoId}`
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <div className={cn('flex flex-col gap-2', containerClassName)}>
        <label
          htmlFor={inputId}
          className="font-mono text-sm uppercase tracking-widest text-cream/80"
        >
          {label}
          {required && (
            <span className="ml-1 text-cream/45" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-12 w-full border bg-obsidian px-4 py-3 font-mono text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:outline-none',
            error
              ? 'border-cream/60 focus:border-gold'
              : 'border-cream/30 focus:border-gold',
            'disabled:cursor-not-allowed disabled:opacity-40',
            className
          )}
          {...rest}
        />
        {hint && !error && (
          <p id={hintId} className="font-mono text-xs text-cream/45">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="font-mono text-xs text-cream"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
