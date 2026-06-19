import { useRef, type ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { useFocusTrap } from '../hooks/useFocusTrap'

const EASE = [0.22, 1, 0.36, 1] as const

interface SideDrawerProps {
  open: boolean
  onClose: () => void
  side: 'left' | 'right'
  width: string
  children: ReactNode
  className?: string
  overlayClassName?: string
  duration?: number
  role?: string
  'aria-label'?: string
  'aria-modal'?: boolean
}

export function SideDrawer({
  open,
  onClose,
  side,
  width,
  children,
  className = '',
  overlayClassName = 'bg-obsidian/70',
  duration = 0.3,
  role,
  'aria-label': ariaLabel,
  'aria-modal': ariaModal,
}: SideDrawerProps) {
  const containerRef = useRef<HTMLElement>(null)
  useLockBodyScroll(open)
  useEscapeKey(open, onClose)
  useFocusTrap(open, containerRef)

  const initialX = side === 'left' ? '-100%' : '100%'
  const sideClass = side === 'left' ? 'left-0' : 'right-0'

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={onClose}
            className={`absolute inset-0 cursor-default ${overlayClassName}`}
          />
          <m.aside
            ref={containerRef}
            className={`absolute top-0 h-full ${width} ${sideClass} ${className}`}
            initial={{ x: initialX }}
            animate={{ x: 0 }}
            exit={{ x: initialX }}
            transition={{ duration, ease: EASE }}
            role={role}
            aria-modal={ariaModal}
            aria-label={ariaLabel}
          >
            {children}
          </m.aside>
        </m.div>
      )}
    </AnimatePresence>
  )
}
