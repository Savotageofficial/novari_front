interface LoadingBlockProps {
  label?: string
  className?: string
}

export function LoadingBlock({
  label = 'Loading',
  className = '',
}: LoadingBlockProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-section text-center ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-pulse border border-cream/20 bg-charcoal" />
      <p className="font-mono text-sm uppercase tracking-widest text-cream/60">
        {label}
      </p>
    </div>
  )
}
