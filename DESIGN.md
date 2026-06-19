# NOVARI — Design System & Tokens

This document captures the complete visual design system for the NOVARI e-commerce experience, extracted from the reference image and codified for the React + Tailwind implementation in `/src`.

---

## 1. Brand Identity

| Attribute | Value |
|-----------|-------|
| Brand name | NOVARI |
| Positioning | Premium, minimal, dark-fashion essentials |
| Tagline | *Essential forms engineered to outlive the trend cycle.* |
| Voice | Restrained, confident, architectural |
| Mood | Cinematic, nocturnal, tactile |

The brand avoids decorative clutter. Hierarchy is built through scale, tracking, and generous negative space rather than color variety.

---

## 2. Color Palette

### Semantic Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `obsidian` | `#070707` | Primary page background, deepest overlays |
| `charcoal` | `#141414` | Product card surfaces, elevated panels |
| `cream` | `#BABABA` | Primary text, borders, icons |
| `gold` | `#7A6751` | Logo star, accent rules, hover states, column headings |

### Opacity Variants

| Variant | Usage |
|---------|-------|
| `cream/80` | Secondary body copy, muted prices |
| `cream/60` | Footer links at rest |
| `cream/45` | Intro shine sweep |
| `obsidian/80` | Bottom gradient on hero image |
| `obsidian/60` | Left-side gradient fade on hero image |
| `obsidian/40` | Product card hover overlay |

### Color Usage Rules

- **Backgrounds**: Almost always `obsidian`. No gradients behind sections.
- **Text**: Primary `cream`, muted with opacity. Never pure white.
- **Accents**: `gold` is the only warm accent and is used sparingly: logo mark, horizontal rules, footer column titles, hover fills.
- **Borders**: `cream` at full opacity for navbar, buttons, and product-card add buttons.
- **Hover**: Interactive elements shift to `gold` fill/border with `obsidian` text where filled.

---

## 3. Typography System

### Font Families

| Token | Font | Role |
|-------|------|------|
| `font-display` | `Instrument Serif` | Section headings (`Latest Drops`), editorial moments |
| `font-mono` | `Geist Mono` | UI, navigation, buttons, body copy, prices |
| `font-script` | `Vujahday Script` | Hero display word *Distinction* |

### Type Scale

| Token | Size | Line Height | Letter Spacing | Use Case |
|-------|------|-------------|----------------|----------|
| `text-wordmark` | `1.25rem` | `1` | `0.3em` | Logo wordmark in navbar/footer |
| `text-wordmark-intro` | `1.5rem` | `1` | `0.3em` | Intro animation wordmark |
| `text-nav` | `0.85rem` | `1` | `0.2em` | Navbar links, buttons, footer column titles |
| `text-brand-statement` | `1.5rem` | `1.3` | — | Tagline in footer |
| `text-hero-display` | `clamp(2.75rem, 6vw, 4.5rem)` | `0.95` | `-0.01em` | Script hero display word |
| `text-xl` | `1.25rem` | `1.75` | `0.05em` | *Built for* prefix |
| `text-6xl` / `text-3xl` | `3.75rem` / `1.875rem` | `1` | `0.025em` | Section heading `Latest Drops` |
| `text-sm` | `0.875rem` | `1.5` | — | Product names, prices, footer body |
| `text-base` | `1rem` | `1.5` | — | Hero subcopy, footer tagline |

### Typographic Patterns

- **Uppercase treatment**: Navigation, buttons, section labels, product names, footer column titles.
- **Tracking**: Wide tracking (`0.2em`–`0.3em`) for uppercase UI text.
- **Mixed voice**: Hero pairs rigid uppercase mono with a single flowing script word.
- **Display heading**: `Latest Drops` is uppercase serif with wide tracking, creating an editorial poster feel.
- **Body text**: Left-aligned, max-width constrained (`max-w-sm`, `max-w-xs`), comfortable line-height.

---

## 4. Spacing System

### Section Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-nav` | `4.5rem` | Navbar height |
| `spacing-section-sm` | `5rem` | Hero text panel padding |
| `spacing-section` | `7.5rem` | Default vertical section padding |
| `spacing-section-lg` | `10rem` | Larger section padding (footer, latest drops top) |

### Content Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `gap-product` | `1.5rem` | Product grid gap on mobile |
| `gap-product-lg` | `2rem` | Product grid gap on desktop |
| `px-6` / `md:px-10` | `1.5rem` / `2.5rem` | Site horizontal gutters |

### Component Spacing

- **Navbar**: `py-4` vertical padding, `grid-cols-3`, outer link groups `gap-6 md:gap-10`.
- **Hero text panel**: `px-8 lg:px-16`, `py-section-sm`, internal `gap-4`.
- **Hero rule**: `w-1/12`, `border-gold`.
- **Product card info row**: `p-4`, internal flex with `gap-4`.
- **Footer**: `gap-12` between columns.

---

## 5. Layout & Grid

### Site Container

- Max-width is intentionally fluid (`max-w-site: 100%`) for full-bleed sections.
- Inner content is constrained by gutters (`px-6 md:px-10`) and occasional `max-w-7xl` in the footer.

### Hero Grid

```
grid-template-columns: hero = 4fr 6fr
```

- Left: text panel, vertically centered.
- Right: full-bleed image, `min-h-hero` = `calc(100svh - 4.5rem)`.
- On mobile the grid collapses to a single column.

### Product Grid

```
grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4
```

- Equal-width cards.
- Square product images (`aspect-square`).
- No external container rounding.

### Footer Grid

```
grid-template-columns: 1fr 1fr
```

- Column 1: brand mark, tagline, gold rule, social links.
- Column 2: link list under `Shop`.

---

## 6. Border & Radius System

### Corner Radius

- **Global reset**: `border-radius: 0` on all elements.
- No rounded cards, buttons, or images anywhere in the UI.

### Borders

| Usage | Color | Width | Notes |
|-------|-------|-------|-------|
| Navbar bottom | `cream` | `1px` | Full-width separator |
| Hero section bottom | `cream` | `1px` | Full-width separator |
| Primary CTA | `cream` | `1px` | Outlined; fills `gold` on hover |
| Product add button | `cream` | `1px` | Square `32px`; fills `gold` on hover |
| Horizontal accent rule | `gold` | `1px` | `w-1/12` |

---

## 7. Component Specs

### 7.1 Navbar

- **Position**: `sticky top-0`, `z-50`.
- **Background**: `bg-obsidian` opaque.
- **Structure**: 3-column grid; left nav links, centered logo lockup, right utility links.
- **Links**: uppercase mono, `text-nav`, `tracking-widest`, `text-cream`, hover to `gold`.
- **Logo lockup**: star mark (`h-7`) + wordmark image, `gap-3`.
- **Border**: `border-b border-cream`.

### 7.2 Logo Lockup

- **Composition**: inline flex row, star icon left, wordmark right.
- **Star**: gold-tinted geometric mark, `h-7`.
- **Wordmark**: "NOVARI" in serif uppercase tracking, image asset.
- **Alignment**: centered in navbar, left-aligned in footer.

### 7.3 Hero

- **Layout**: 2-column desktop, stacked mobile.
- **Left panel**:
  - Pre-headline: uppercase mono `text-xl`, wide tracking: "BUILT FOR".
  - Display word: `font-script text-hero-display text-cream`: "Distinction".
  - Gold horizontal rule.
  - Subcopy: mono `text-base`, `text-cream/80`, max-width `sm`.
  - CTA button: outlined border, uppercase `text-nav`, arrow icon, hover fill `gold`.
- **Right panel**:
  - Full-bleed grayscale lifestyle image.
  - Bottom gradient: `from-obsidian/80 via-transparent to-transparent`.
  - Left gradient: `from-obsidian via-obsidian/60 to-transparent` to improve text legibility.

### 7.4 Product Card

- **Surface**: `bg-charcoal`.
- **Image**: square, `object-cover`, scales `1.02` on hover.
- **Hover overlay**: `bg-obsidian/40` with centered "View Product →" text.
- **Info row**:
  - Product name: uppercase mono, `text-sm`, `text-cream`.
  - Price: `text-sm`, `text-cream/80`.
  - Add button: `32px × 32px` square border button with `+`, fills `gold` on hover.

### 7.5 Section Header

- **Title**: `font-display text-6xl md:text-3xl uppercase tracking-wide text-cream`.
- **Link**: uppercase mono, `text-nav tracking-widest`, "View All →", hover `gold`.
- **Layout**: flex row, space-between, `pb-6`.

### 7.6 Footer

- **Background**: `bg-obsidian`.
- **Padding**: `py-section lg:py-section-lg`, `px-6 md:px-10`.
- **Brand column**: logo, tagline, gold rule, social links with icon + label.
- **Link columns**:
  - Title: `font-mono text-nav uppercase tracking-widest text-gold`.
  - Links: `font-mono text-sm text-cream opacity-60`, hover to `opacity-100`.

---

## 8. Motion & Interaction

### Animation Philosophy

Motion is slow, cinematic, and purposeful. Transitions are smooth (`ease-out`, custom `[0.22, 1, 0.36, 1]`) rather than bouncy.

### Intro Animation

- Full-screen `bg-obsidian` overlay, `z-intro`.
- Logo enters at `scale(2.6)` centered, holds with a cream shine sweep.
- After 1.2s, logo travels and scales down to the navbar position.
- Overlay fades out; main content fades in.

### Scroll Reveals

- Elements use `whileInView` with `viewport={{ once: true }}`.
- Typical entrance: `opacity: 0 → 1`, `y: 16–24px → 0`.
- Durations: 0.5s–0.8s.
- Product cards stagger by `index * 0.08s`.

### Hover States

| Element | Rest | Hover |
|---------|------|-------|
| Nav links | `text-cream` | `text-gold` |
| Text links (View All) | `text-cream` | `text-gold` |
| Primary CTA | border `cream`, text `cream` | border `gold`, bg `gold`, text `obsidian` |
| Add button | border `cream`, text `cream` | border `gold`, bg `gold`, text `obsidian` |
| Product card image | scale 1 | scale 1.02 |
| Product card overlay | opacity 0 | opacity 1 |
| Footer links | opacity 0.6 | opacity 1 |

### Transitions

- Default duration: `300ms`.
- Easing: `ease-out` for color, `[0.22, 1, 0.36, 1]` for layout/travel animations.

---

## 9. Section-by-Section Spec

### Section: Navbar

| Property | Value |
|----------|-------|
| Height | `4.5rem` |
| Position | sticky top |
| Background | `obsidian` |
| Border | `1px solid cream` bottom |
| Columns | 3 (links / logo / links) |
| Link style | uppercase mono, wide tracking, cream → gold hover |

### Section: Hero

| Property | Value |
|----------|-------|
| Layout | 4fr / 6fr grid |
| Height | `calc(100svh - 4.5rem)` |
| Left bg | `obsidian` |
| Right bg | full-bleed grayscale image |
| Headline | "BUILT FOR" + script "Distinction" |
| Subcopy | "Essential forms engineered to outlive the trend cycle." |
| CTA | "DISCOVER COLLECTION →" |

### Section: Latest Drops

| Property | Value |
|----------|-------|
| Top padding | `section` / `section-lg` |
| Header | "Latest Drops" (serif display) + "View All →" (mono) |
| Grid | 4 columns on desktop, 2 on tablet, 1 on mobile |
| Card surface | `charcoal` |
| Cards shown | Premium Tee, Archive Tee, Box Tee, Raw Tee |

### Section: Footer

| Property | Value |
|----------|-------|
| Background | `obsidian` |
| Padding | `section` / `section-lg` vertical |
| Grid | 2 columns on desktop |
| Content | Logo + tagline + social / Shop links |

---

## 10. Asset Inventory

| Asset | Path | Usage |
|-------|------|-------|
| Hero Image | `/public/assets/Hero Image.webp` | Current hero background |
| Hero Image 1 | `/public/assets/Hero Image 1.webp` | Alternate hero media (unused) |
| T-shirt placeholder | `/public/assets/T-shirt placeholder.webp` | Product card images |
| Novari Logo | `/public/assets/Novari Logo.webp` | Star mark |
| Novari Wordmark | `/public/assets/Novari Wordmark.webp` | Text logotype |
| Favicon | `/public/favicon.svg` | Browser tab icon |
| Icons sprite | `/public/icons.svg` | Icon system |

---

## 11. Responsive Strategy

| Breakpoint | Key Changes |
|------------|-------------|
| Mobile (<640px) | Single-column hero; 1-column product grid; footer stacks; smaller display type |
| Tablet (640–1024px) | 2-column product grid; hero may still stack |
| Desktop (>1024px) | Full 4/6 hero split; 4-column product grid; 3-column footer; largest display type |

- All horizontal padding steps from `px-6` to `md:px-10`.
- Section spacing steps from `section` to `section-lg`.
- Hero script display uses `clamp()` to scale fluidly.

---

## 12. Accessibility Notes

- All interactive elements have visible focus states by default (browser outline).
- Color contrast relies on `cream` (#BABABA) on `obsidian` (#070707), which passes WCAG AA.
- Gold accent is decorative; no critical information is conveyed by gold alone.
- Product add buttons include `aria-label` with the product name.
- Logo images are decorative (`aria-hidden="true"`).

---

## 13. Implementation Mapping

The tokens above are already implemented in:

- `tailwind.config.ts` — color, font, spacing, grid, and sizing tokens.
- `src/index.css` — global reset, base styles, `shine-mask` utility.
- `src/components/Navbar.tsx` — navbar component.
- `src/components/Hero.tsx` — hero section.
- `src/components/LatestDrops.tsx` + `ProductCard.tsx` — product grid.
- `src/components/Footer.tsx` — footer.
- `src/components/Logo.tsx` — logo lockup.
- `src/components/IntroAnimation.tsx` — page-load animation.

---

*Document version: 1.0 — extracted from the NOVARI reference image and aligned with the current codebase.*
