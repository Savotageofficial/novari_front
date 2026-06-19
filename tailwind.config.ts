import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#070707',
        charcoal: '#141414',
        cream: '#BABABA',
        gold: '#7A6751',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        mono: ['"Geist Mono"', 'monospace'],
        script: ['"Vujahday Script"', 'cursive'],
      },
      fontSize: {
        nav: ['0.85rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        'brand-statement': ['1.5rem', { lineHeight: '1.3' }],
        wordmark: ['1.25rem', { lineHeight: '1', letterSpacing: '0.3em' }],
        'wordmark-intro': ['1.5rem', { lineHeight: '1', letterSpacing: '0.3em' }],
        'hero-display': [
          'clamp(2.75rem, 6vw, 4.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.01em' },
        ],
      },
      letterSpacing: {
        brand: '0.3em',
      },
      spacing: {
        nav: '4.5rem',
        section: '7.5rem',
        'section-lg': '10rem',
        'section-sm': '5rem',
      },
      minHeight: {
        hero: 'calc(100svh - 4.5rem)',
      },
      gridTemplateColumns: {
        hero: '4fr 6fr',
      },
      scale: {
        '102': '1.02',
      },
      borderRadius: {
        none: '0',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      opacity: {
        link: '0.6',
      },
      gap: {
        product: '1.5rem',
        'product-lg': '2rem',
      },
      maxWidth: {
        site: '100%',
      },
      height: {
        logo: '2.5rem',
        'logo-intro': '5rem',
      },
      width: {
        logo: 'auto',
      },
      zIndex: {
        intro: '100',
        drawer: '90',
        menu: '80',
        navbar: '50',
      },
    },
  },
  plugins: [],
} satisfies Config
