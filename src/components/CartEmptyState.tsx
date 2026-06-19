interface CartEmptyStateProps {
  onClose: () => void
}

export function CartEmptyState({ onClose }: CartEmptyStateProps) {
  return (
    <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-6 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-cream/60">
        Your cart is empty
      </p>
      <button
        type="button"
        onClick={onClose}
        className="font-mono text-nav uppercase tracking-widest text-cream underline-offset-4 transition-colors duration-300 hover:text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Continue shopping →
      </button>
    </div>
  )
}
