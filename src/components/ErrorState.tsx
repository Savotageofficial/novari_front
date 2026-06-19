import { Button } from './primitives'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ message, onRetry, className = '' }: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-section text-center ${className}`}
      role="alert"
    >
      <p className="max-w-md font-mono text-sm text-gold">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="ghost">
          Try again
        </Button>
      )}
    </div>
  )
}
