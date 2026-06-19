export interface ColorOption {
  name: string
  hex: string
}

export const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Obsidian', hex: '#070707' },
  { name: 'Bone', hex: '#E5E5E5' },
  { name: 'Ashe', hex: '#7A7A7A' },
  { name: 'Gold', hex: '#7A6751' },
]

export const COLOR_SWATCHES: Record<string, string> = {
  Obsidian: '#070707',
  Bone: '#E5E5E5',
  Ashe: '#7A7A7A',
  Gold: '#7A6751',
}

export function mergeColorOptions(
  base: ColorOption[],
  extra: ColorOption[]
): ColorOption[] {
  const seen = new Set(base.map((color) => color.name.toLowerCase()))
  const merged = [...base]
  for (const color of extra) {
    const key = color.name.trim()
    if (!key || seen.has(key.toLowerCase())) continue
    merged.push({ name: key, hex: color.hex })
    seen.add(key.toLowerCase())
  }
  return merged
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim()
  const short = /^#?([0-9a-fA-F]{3})$/.exec(trimmed)
  if (short) {
    const [r, g, b] = short[1].split('')
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }
  const long = /^#?([0-9a-fA-F]{6})$/.exec(trimmed)
  if (long) return `#${long[1]}`.toUpperCase()
  return null
}
