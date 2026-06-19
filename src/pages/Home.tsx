import { AnimatePresence } from 'framer-motion'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { IntroAnimation } from '../components/IntroAnimation'
import { LatestDrops } from '../components/LatestDrops'
import { Navbar } from '../components/Navbar'
import { LoadingBlock } from '../components/LoadingBlock'
import { ErrorState } from '../components/ErrorState'
import { useIntroAnimation } from '../hooks/useIntroAnimation'
import { useProducts } from '../hooks/useProducts'

export default function Home() {
  const { introComplete, logoRef, handleIntroComplete } = useIntroAnimation()
  const { products, isLoading, error, reload } = useProducts()

  return (
    <>
      <Navbar visible={introComplete} logoRef={logoRef} />

      <AnimatePresence>
        {!introComplete && (
          <IntroAnimation onComplete={handleIntroComplete} targetRef={logoRef} />
        )}
      </AnimatePresence>

      <main>
        <Hero />
        {isLoading ? (
          <LoadingBlock label="Loading latest drops" />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <LatestDrops products={products} />
        )}
        <Footer />
      </main>
    </>
  )
}
