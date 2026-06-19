import { Link } from 'react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar visible />
      <main className="flex min-h-[calc(100svh-4.5rem)] items-center justify-center bg-obsidian px-6">
        <div className="text-center">
          <h1 className="font-display text-6xl uppercase tracking-wide text-cream md:text-8xl">
            404
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-cream/60">
            Page not found
          </p>
          <Link
            to="/"
            className="mt-8 inline-block font-mono text-nav uppercase tracking-widest text-cream transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Return home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
