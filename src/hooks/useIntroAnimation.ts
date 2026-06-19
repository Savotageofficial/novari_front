import { useCallback, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export function useIntroAnimation() {
  const prefersReducedMotion = useReducedMotion()
  const [animationComplete, setAnimationComplete] = useState(false)
  const introComplete = animationComplete || (prefersReducedMotion ?? false)
  const logoRef = useRef<HTMLDivElement>(null)

  const handleIntroComplete = useCallback(() => {
    setAnimationComplete(true)
  }, [])

  return { introComplete, logoRef, handleIntroComplete } as const
}
