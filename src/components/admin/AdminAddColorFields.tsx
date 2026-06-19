import { useState } from 'react'
import { Button } from '../primitives'
import { TextField } from '../TextField'

interface AdminAddColorFieldsProps {
  onAddColor: (name: string, hex: string) => boolean
}

export function AdminAddColorFields({ onAddColor }: AdminAddColorFieldsProps) {
  const [name, setName] = useState('')
  const [hex, setHex] = useState('#BABABA')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    const added = onAddColor(name, hex)
    if (!added) {
      setError('Enter a unique color name and valid hex value.')
      return
    }
    setName('')
    setHex('#BABABA')
    setError(null)
  }

  return (
    <div className="border border-cream/20 bg-obsidian p-4">
      <p className="font-mono text-sm uppercase tracking-widest text-cream/80">
        Add new color
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Slate"
        />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="admin-new-color-hex"
            className="font-mono text-sm uppercase tracking-widest text-cream/80"
          >
            Swatch
          </label>
          <input
            id="admin-new-color-hex"
            type="color"
            value={hex}
            onChange={(event) => setHex(event.target.value.toUpperCase())}
            className="h-12 w-full cursor-pointer border border-cream/30 bg-obsidian p-1 sm:w-16"
          />
        </div>
        <Button type="button" onClick={handleSubmit}>
          Add color
        </Button>
      </div>
      {error && (
        <p className="mt-3 font-mono text-xs text-gold" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
