import type { ReactNode } from 'react'

interface FilterSectionProps {
  title: string
  children: ReactNode
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <>
      <hr className="border-cream/20 mb-3" />
      <fieldset className="py-6">
        <legend className="mb-5 font-mono text-nav uppercase tracking-widest text-gold">
          {title}
        </legend>
        <div className="flex flex-col gap-3">{children}</div>
      </fieldset>
    </>
  )
}
