import { useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Link } from 'react-router'
import { LogoLockup } from './Logo'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { useFocusTrap } from '../hooks/useFocusTrap'

const MotionLink = m(Link)

interface MobileMenuItem {
  label: string
  href: string
  kind: 'link' | 'action'
}

const mobileMenuItems: MobileMenuItem[] = [
  { label: 'Products', href: '/products', kind: 'link' },
]

const linkVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  count: number
  onOpenCart: () => void
}

export function MobileMenu({
  open,
  onClose,
  count,
  onOpenCart,
}: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useLockBodyScroll(open)
  useEscapeKey(open, onClose)
  useFocusTrap(open, containerRef)

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          ref={containerRef}
          className="fixed inset-0 z-menu flex flex-col bg-obsidian md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-nav items-center justify-between border-b border-cream px-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                aria-hidden="true"
              >
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
            <LogoLockup
              className="items-center"
              starClassName="h-7"
              wordmarkClassName="text-wordmark"
            />
            <span className="h-8 w-8" aria-hidden="true" />
          </div>

          <m.nav
            className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-section"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.06, delayChildren: 0.1 },
              },
            }}
          >
            {mobileMenuItems.map((item) =>
              item.kind === 'link' ? (
                <MotionLink
                  key={item.label}
                  to={item.href}
                  onClick={() => onClose()}
                  className="font-mono text-2xl uppercase tracking-widest text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  variants={linkVariants}
                >
                  {item.label}
                </MotionLink>
              ) : (
                <m.button
                  key={item.label}
                  type="button"
                  onClick={() => onClose()}
                  className="font-mono text-2xl uppercase tracking-widest text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  variants={linkVariants}
                >
                  {item.label}
                </m.button>
              )
            )}
            <m.button
              key="cart"
              type="button"
              onClick={() => {
                onClose()
                onOpenCart()
              }}
              className="font-mono text-2xl uppercase tracking-widest text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              variants={linkVariants}
            >
              Cart [{count}]
            </m.button>
          </m.nav>
        </m.div>
      )}
    </AnimatePresence>
  )
}
