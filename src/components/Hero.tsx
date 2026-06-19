import { m } from 'framer-motion'
import { Button } from './primitives'
import { Reveal } from './Reveal'

const heroImage = '/assets/Hero Image.webp'

function scrollToCollections() {
  document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  return (
    <section className="grid grid-cols-1 border-b border-cream lg:grid-cols-hero">
      <div className="flex flex-col items-start justify-center gap-4 px-8 py-section-sm text-center lg:px-16">
        <Reveal delay={0.1} y={24}>
          <h1 className="mb-4 text-start font-mono text-xl uppercase tracking-widest text-cream">
            Built for <br />
            <span className="font-script text-hero-display normal-case text-cream select-none">
              Distinction
            </span>
          </h1>
        </Reveal>

        <hr className="w-1/12 border border-gold" />

        <Reveal delay={0.2} y={16}>
          <p className="mt-6 max-w-sm text-start font-mono text-sm leading-relaxed text-pretty text-cream/80 md:text-base">
            Essential forms engineered to outlive the trend cycle.
          </p>
        </Reveal>

        <Reveal delay={0.3} y={16}>
          <Button onClick={scrollToCollections} className="mt-8">
            Discover Collection →
          </Button>
        </Reveal>
      </div>

      <div className="relative min-h-hero overflow-hidden bg-obsidian">
        <m.img
          src={heroImage}
          alt="Novari hero image"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-obsidian/80 via-transparent to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-obsidian via-obsidian/60 to-transparent" />
      </div>
    </section>
  )
}
