import { useState } from 'react'
import { m } from 'framer-motion'
import { LogoLockup } from './Logo'
import { MobileMenu } from './MobileMenu'
import { NavButton, RouterLink } from './primitives'
import { useCartActions, useCartState } from '../hooks/useCart'

interface NavbarProps {
  visible: boolean
  logoRef?: React.Ref<HTMLDivElement>
}

export function Navbar({ visible, logoRef }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const { count } = useCartState()
  const { open: openCart } = useCartActions()

  return (
    <header className="sticky top-0 z-navbar border-b border-cream bg-obsidian">
      <nav className="grid grid-cols-3 items-center gap-2 px-6 py-4 md:gap-4 md:px-10">
        <m.div
          className="hidden items-center gap-6 md:flex md:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <RouterLink to="/products">Products</RouterLink>
        </m.div>

        <div className="flex items-center md:hidden">
          <m.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
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
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </m.button>
        </div>

        <div className="flex justify-center">
          <m.div
            ref={logoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <LogoLockup
              className="items-center"
              starClassName="h-7"
              wordmarkClassName="text-wordmark"
            />
          </m.div>
        </div>

        <m.div
          className="hidden items-center justify-end gap-6 md:flex md:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <NavButton onClick={openCart} aria-label={`Open cart, ${count} items`}>
            Cart [{count}]
          </NavButton>
        </m.div>

        <m.div
          className="flex items-center justify-end md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <NavButton onClick={openCart} className="px-0" aria-label={`Open cart, ${count} items`}>
            Cart [{count}]
          </NavButton>
        </m.div>
      </nav>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        count={count}
        onOpenCart={openCart}
      />
    </header>
  )
}
