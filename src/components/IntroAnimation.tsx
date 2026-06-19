import { useLayoutEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { LogoLockup } from './Logo'

interface IntroAnimationProps {
  onComplete: () => void
  targetRef: React.RefObject<HTMLElement | null>
}

const ENTER_SCALE = 2.6

export function IntroAnimation({ onComplete, targetRef }: IntroAnimationProps) {
  const lockupRef = useRef<HTMLDivElement>(null)
  const [delta, setDelta] = useState({ x: 0, y: 0 })
  const [phase, setPhase] = useState<'shine' | 'travel'>('shine')

  useLayoutEffect(() => {
    const lockup = lockupRef.current
    const target = targetRef.current
    if (!lockup || !target) return

    const from = lockup.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    setDelta({
      x: to.left + to.width / 2 - (from.left + from.width / 2),
      y: to.top + to.height / 2 - (from.top + from.height / 2),
    })

    const id = window.setTimeout(() => setPhase('travel'), 1200)
    return () => window.clearTimeout(id)
  }, [targetRef])

  return (
    <m.div
      className="fixed inset-0 z-intro flex items-center justify-center bg-obsidian"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <m.div
        ref={lockupRef}
        className="relative overflow-hidden"
        initial={{ scale: ENTER_SCALE, x: 0, y: 0 }}
        animate={
          phase === 'travel'
            ? { scale: 1, x: delta.x, y: delta.y }
            : { scale: ENTER_SCALE, x: 0, y: 0 }
        }
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (phase === 'travel') onComplete()
        }}
      >
        <LogoLockup className="items-center" starClassName="h-7" wordmarkClassName="text-wordmark" />

        <m.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cream/45 to-transparent"
          initial={{ x: '-160%' }}
          animate={{ x: '260%' }}
          transition={{ duration: 0.85, ease: 'easeInOut', delay: 0.45 }}
        />
      </m.div>
    </m.div>
  )
}
